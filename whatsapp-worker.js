/**
 * Caliber — WhatsApp "AI line" Worker (Cloudflare)
 * ==============================================================
 * The dedicated WhatsApp Business (Cloud API) number that the ads
 * point to. This Worker:
 *   1. Receives incoming WhatsApp messages (Meta webhook).
 *   2. Keeps ONLY conversations that came from a Click-to-WhatsApp
 *      ad (message.referral.source_type === "ad"), optionally
 *      restricted to the current campaign's ad ids.
 *   3. Asks Claude (NEPQ + HSTP brain) what to reply / how to close.
 *   4. ASSIST mode  → stores the AI suggestion for Caliber (a human
 *      approves/sends, or hands off to Sebastian's personal WhatsApp).
 *      AUTO mode    → the AI replies on its own via the Cloud API.
 *   5. Exposes the conversations to the Caliber dashboard to render.
 *
 * This line is dedicated to ad leads — a brand-new WhatsApp Business
 * number (e.g. +1 346 247 4443), never Sebastian's personal number.
 * He works these conversations entirely from Caliber; no phone app
 * is required for this line at all.
 *
 * ONE-CLICK CONNECT: connect-whatsapp.html (public page) walks the client
 * through Meta's Embedded Signup. When they finish, it posts here to
 * POST /onboard, which exchanges the code for a business token, registers
 * the number for Cloud API, subscribes the WABA to this app's webhook, and
 * stores everything in KV — no manual token copy-pasting required.
 *
 * Storage: Cloudflare KV (binding: CONVOS).
 * Secrets/vars (set in Cloudflare → the client provides the values):
 *   META_APP_SECRET     (secret) — the Meta app's App Secret (also verifies webhook signatures)
 *   WHATSAPP_VERIFY     (secret) — webhook verify token (you choose it)
 *   WHATSAPP_PIN        (secret) — a 6-digit PIN for the number's 2-step verification (you choose it)
 *   ANTHROPIC_API_KEY   (secret) — the agent's brain
 *   READ_TOKEN          (secret) — Caliber passes this to read/send conversations
 *   MODE                (var)    — "assist" (default) or "auto"
 *   MODEL               (var)    — claude-sonnet-5 (default; see SETUP doc for alternatives)
 *   MODEL_FALLBACK      (var)    — claude-haiku-4-5 (default) — used automatically
 *                                  if MODEL's call fails (e.g. low credit balance),
 *                                  so a conversation is never left without a reply
 *   CAMPAIGN_AD_IDS     (var)    — optional comma list to restrict to a campaign
 *   META_APP_ID         (var)    — optional override of the default app id below
 *   WHATSAPP_TOKEN      (secret, optional) — manual override/fallback for the token
 *   WHATSAPP_PHONE_ID   (var, optional)    — manual override/fallback for the phone_number_id
 *     (WHATSAPP_TOKEN/WHATSAPP_PHONE_ID are normally set automatically by /onboard —
 *      only set them by hand if you're bypassing connect-whatsapp.html)
 * Setup walkthrough: SETUP-WHATSAPP-AI.md
 * ==============================================================
 */

const GRAPH = 'https://graph.facebook.com/v21.0';
const DEFAULT_APP_ID = '2126295867938046'; // "caliber sebastian" Meta app (public, not a secret)

const ALLOWED_ORIGINS = [
  'https://alancruzcreai.github.io',
  'https://caliber.dragonconsultations.com',
  'http://localhost:8769',
  'http://127.0.0.1:8769',
];

const AGENT_PROMPT = `
You are the front-line WhatsApp assistant for **Sebastian Landa** and **The High Standard Traveler Program (HSTP)** — a premium 10-week health & performance operating system (~$2,000) for people who live in motion: yacht crew, founders, frequent flyers, high-performing remote workers. The lead just messaged after clicking a "Send message" ad.

Your job is to **connect, qualify, and earn a booked 15-minute Express Call** (or hand a hot lead to Sebastian) — never to hard-pitch.

METHOD — NEPQ: ask, don't pitch; calm, neutral, curious (the trusted advisor, never the hungry salesperson); mirror & label their words; ONE question per message; never argue an objection — answer it with a question that lets them re-examine it. Move fluidly: Connection → Engagement (situation / problem-awareness / consequence questions) → Transition → light Presentation (reflect their words back, tie to the system) → Commitment (offer the call as the natural next step).

HARD RULES: ≤2 sentences per message; exactly ONE question; mirror their language (ES neutral "tú" / EN); no links/price before turn 3 and only after real qualification; if asked "are you a bot?" answer honestly that you're part of Sebastian's team and he joins the call himself; no false urgency; at most one emoji, rarely.

PROGRAM KNOWLEDGE (use naturally, never as a brochure): HSTP = a personal operating system of 21 SOPs across Core / Body (hydration, protein-first nutrition, flexible fitness) / Travel / Recovery (sleep, reset, Bare-Minimum Day, nervous-system regulation) / Mindset. Signature mechanic: every habit has Full / Express / **Bare Minimum** versions — on a chaotic day you drop to Bare Minimum, you don't quit; this is the answer to "I always fall off / restart." Core message: "you don't need a perfect life to stay aligned — you need a system that holds when life gets chaotic." Created by Isabell, a superyacht chief stewardess who lived the problem. The only human step is the 15-min Express Call with Sebastian.

OUTPUT: reply ONLY with the next single WhatsApp message to send — short, one question, mirror their language, no preamble.
`.trim();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const cors = corsFor(origin);

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    // ── Meta webhook verification (GET /) ──
    if (request.method === 'GET' && url.pathname === '/') {
      if (url.searchParams.get('hub.mode') === 'subscribe' &&
          url.searchParams.get('hub.verify_token') === env.WHATSAPP_VERIFY) {
        return new Response(url.searchParams.get('hub.challenge') || '', { status: 200 });
      }
      return new Response('forbidden', { status: 403 });
    }

    // ── Caliber reads conversations (GET /conversations) ──
    if (request.method === 'GET' && url.pathname === '/conversations') {
      if (!originOk(origin)) return json({ error: 'origin not allowed' }, 403, cors);
      if (env.READ_TOKEN && url.searchParams.get('t') !== env.READ_TOKEN)
        return json({ error: 'bad token' }, 401, cors);
      const convos = await listConvos(env);
      return json({ mode: env.MODE || 'assist', conversations: convos }, 200, cors);
    }

    // ── Caliber sends a (human-approved) reply (POST /reply) ──
    if (request.method === 'POST' && url.pathname === '/reply') {
      if (!originOk(origin)) return json({ error: 'origin not allowed' }, 403, cors);
      let b; try { b = await request.json(); } catch { return json({ error: 'bad json' }, 400, cors); }
      if (env.READ_TOKEN && b.t !== env.READ_TOKEN) return json({ error: 'bad token' }, 401, cors);
      if (!b.wa_id || !b.text) return json({ error: 'wa_id and text required' }, 400, cors);
      await sendWhatsApp(env, b.wa_id, b.text);
      await appendMessage(env, b.wa_id, { from: 'agent', text: b.text, ts: stamp(request) });
      // clear the consumed suggestion
      const c = await getConvo(env, b.wa_id); if (c) { c.suggestion = ''; await putConvo(env, c); }
      return json({ ok: true }, 200, cors);
    }

    // ── Caliber asks the AI to (re)draft a reply (POST /suggest) ──
    if (request.method === 'POST' && url.pathname === '/suggest') {
      if (!originOk(origin)) return json({ error: 'origin not allowed' }, 403, cors);
      let b; try { b = await request.json(); } catch { return json({ error: 'bad json' }, 400, cors); }
      if (env.READ_TOKEN && b.t !== env.READ_TOKEN) return json({ error: 'bad token' }, 401, cors);
      const c = await getConvo(env, b.wa_id);
      if (!c) return json({ error: 'not found' }, 404, cors);
      let s = ''; try { s = await callClaude(env, c.messages); } catch (e) { return json({ error: e.message }, 502, cors); }
      c.suggestion = s; await putConvo(env, c);
      return json({ suggestion: s }, 200, cors);
    }

    // ── One-click connect: exchange Embedded Signup result for a live line (POST /onboard) ──
    if (request.method === 'POST' && url.pathname === '/onboard') {
      if (!originOk(origin)) return json({ error: 'origin not allowed' }, 403, cors);
      let b; try { b = await request.json(); } catch { return json({ error: 'bad json' }, 400, cors); }
      const { code, waba_id, phone_number_id } = b || {};
      if (!code || !waba_id || !phone_number_id)
        return json({ error: 'code, waba_id and phone_number_id are required' }, 400, cors);
      try {
        const token = await exchangeCodeForToken(env, code);
        await registerPhoneNumber(env, phone_number_id, token);
        await subscribeWabaWebhooks(env, waba_id, token);
        await env.CONVOS.put('config:whatsapp', JSON.stringify({
          access_token: token, waba_id, phone_number_id, connectedAt: Date.now(),
        }));
        return json({ ok: true }, 200, cors);
      } catch (err) {
        console.error('onboard failed', err);
        return json({ error: err.message }, 502, cors);
      }
    }

    // ── Connection status (GET /status) — for connect-whatsapp.html and Caliber ──
    if (request.method === 'GET' && url.pathname === '/status') {
      const cfg = await getWaConfig(env);
      return json({ connected: !!(cfg.token && cfg.phoneId), phoneNumberId: cfg.phoneId || null }, 200, cors);
    }

    // ── Incoming WhatsApp messages (POST /) ──
    if (request.method === 'POST' && url.pathname === '/') {
      const raw = await request.text();
      const ok = await verifySignature(env, request, raw);
      if (!ok) return new Response('bad signature', { status: 401 });
      let payload; try { payload = JSON.parse(raw); } catch { return new Response('ok', { status: 200 }); }
      // Always 200 fast; do the slow AI work in the background.
      ctx.waitUntil(handleIncoming(env, payload).catch(e => console.error('handle error', e)));
      return new Response('ok', { status: 200 });
    }

    return json({ error: 'not found' }, 404, cors);
  },
};

// ───────────────────────── incoming pipeline ─────────────────────────
async function handleIncoming(env, payload) {
  const allow = (env.CAMPAIGN_AD_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  const entries = payload.entry || [];
  for (const e of entries) {
    for (const ch of (e.changes || [])) {
      const v = ch.value || {};

      // COEXISTENCE: messages Sebastian types in the WhatsApp Business app on his
      // phone are echoed here (smb_message_echoes) → mirror them into Caliber so the
      // dashboard stays in sync no matter which side he answers on.
      if (ch.field === 'smb_message_echoes' || v.message_echoes) {
        for (const m of (v.message_echoes || [])) {
          const waId = m.to;
          const text = (m.text && m.text.body) || '';
          if (!waId || !text) continue;
          const convo = await getConvo(env, waId);
          if (!convo) continue;                 // only mirror replies to known ad-derived chats
          convo.messages.push({ from: 'agent', text, ts: m.timestamp || null });
          convo.suggestion = '';                // he answered himself → drop any pending draft
          convo.updatedAt = m.timestamp || null;
          await putConvo(env, convo);
        }
        continue;
      }

      const contact = (v.contacts && v.contacts[0]) || {};
      for (const m of (v.messages || [])) {
        if (m.type !== 'text' && m.type !== 'button' && m.type !== 'interactive') continue;
        const waId = m.from;
        const text = (m.text && m.text.body) || (m.button && m.button.text) || '';
        if (!waId || !text) continue;

        let convo = await getConvo(env, waId);

        // First contact: only keep it if it came from a Click-to-WhatsApp AD.
        if (!convo) {
          const ref = m.referral;
          const isAd = ref && (ref.source_type === 'ad' || ref.source_id || ref.ctwa_clid);
          if (!isAd) continue; // ignore non-ad first messages — this line is for ads only
          if (allow.length && ref && ref.source_id && !allow.includes(String(ref.source_id))) continue;
          convo = {
            wa_id: waId,
            name: (contact.profile && contact.profile.name) || waId,
            adId: (ref && ref.source_id) || null,
            adHeadline: (ref && (ref.headline || ref.body)) || '',
            status: 'new',
            messages: [],
            suggestion: '',
            updatedAt: null,
          };
        }

        convo.messages.push({ from: 'lead', text, ts: m.timestamp || null });
        convo.updatedAt = m.timestamp || null;

        // Ask the brain what to do next.
        let reply = '';
        try { reply = await callClaude(env, convo.messages); } catch (err) { console.error('claude', err); }

        const mode = (env.MODE || 'assist').toLowerCase();
        if (reply) {
          if (mode === 'auto') {
            await sendWhatsApp(env, waId, reply);
            convo.messages.push({ from: 'agent', text: reply, ts: null });
            convo.suggestion = '';
          } else {
            convo.suggestion = reply; // a human approves/sends from Caliber
          }
        }
        await putConvo(env, convo);
      }
    }
  }
}

// ───────────────────────── Claude ─────────────────────────
async function callClaude(env, messages) {
  const hist = messages.map(m => ({ role: m.from === 'lead' ? 'user' : 'assistant', content: m.text })).slice(-24);
  const model = env.MODEL || 'claude-sonnet-5';
  try {
    return await askClaude(env, model, hist);
  } catch (err) {
    // A live sales conversation must never go silent mid-thread. If the
    // primary model call fails — most commonly a low/zero credit balance —
    // retry once on a cheaper fallback model before giving up.
    const fallback = env.MODEL_FALLBACK || 'claude-haiku-4-5';
    if (fallback === model) throw err;
    console.error(`claude primary model "${model}" failed (${err.message}); retrying on fallback "${fallback}"`);
    return await askClaude(env, fallback, hist);
  }
}

async function askClaude(env, model, hist) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model,
      max_tokens: 320,
      // Cache the (large, fixed) system prompt → ~0.1x cost on every turn after the first.
      system: [{ type: 'text', text: AGENT_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: hist,
    }),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((d.error && d.error.message) || ('HTTP ' + res.status));
  return (d.content && d.content[0] && d.content[0].text || '').trim();
}

// ───────────────────────── WhatsApp send ─────────────────────────
async function sendWhatsApp(env, to, text) {
  const { token, phoneId } = await getWaConfig(env);
  const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } }),
  });
  if (!res.ok) console.error('wa send failed', res.status, await res.text().catch(() => ''));
}

// Dynamic config from the one-click /onboard flow, falling back to manually
// set secrets (for bypassing connect-whatsapp.html or re-pointing the line).
async function getWaConfig(env) {
  const raw = await env.CONVOS.get('config:whatsapp');
  const dyn = raw ? JSON.parse(raw) : null;
  return {
    token: (dyn && dyn.access_token) || env.WHATSAPP_TOKEN,
    phoneId: (dyn && dyn.phone_number_id) || env.WHATSAPP_PHONE_ID,
  };
}

// ───────────────────────── Embedded Signup exchange ─────────────────────────
// Verified against Meta's own developer docs (jun-2026): the code from
// FB.login(response_type:'code') is exchanged server-side with the App
// Secret — no redirect_uri for this popup-based flow.
async function exchangeCodeForToken(env, code) {
  const u = new URL(`${GRAPH}/oauth/access_token`);
  u.searchParams.set('client_id', env.META_APP_ID || DEFAULT_APP_ID);
  u.searchParams.set('client_secret', env.META_APP_SECRET);
  u.searchParams.set('code', code);
  const res = await fetch(u);
  const d = await res.json().catch(() => ({}));
  if (!res.ok || !d.access_token) throw new Error((d.error && d.error.message) || 'token exchange failed');
  return d.access_token;
}

// Registers the number for Cloud API messaging (required once per number).
async function registerPhoneNumber(env, phoneNumberId, token) {
  const res = await fetch(`${GRAPH}/${phoneNumberId}/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ messaging_product: 'whatsapp', pin: env.WHATSAPP_PIN || '246813' }),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((d.error && d.error.message) || 'phone number registration failed');
}

// Subscribes the client's WABA to this app's already-configured webhook
// (Callback URL + Verify token set once in the Meta App Dashboard).
async function subscribeWabaWebhooks(env, wabaId, token) {
  const res = await fetch(`${GRAPH}/${wabaId}/subscribed_apps`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((d.error && d.error.message) || 'webhook subscription failed');
}

// ───────────────────────── KV storage ─────────────────────────
const KEY = (waId) => `convo:${waId}`;
async function getConvo(env, waId) { const s = await env.CONVOS.get(KEY(waId)); return s ? JSON.parse(s) : null; }
async function putConvo(env, convo) { await env.CONVOS.put(KEY(convo.wa_id), JSON.stringify(convo)); }
async function appendMessage(env, waId, msg) { const c = await getConvo(env, waId); if (!c) return; c.messages.push(msg); await putConvo(env, c); }
async function listConvos(env) {
  const out = [];
  let cursor;
  do {
    const list = await env.CONVOS.list({ prefix: 'convo:', cursor, limit: 200 });
    for (const k of list.keys) { const s = await env.CONVOS.get(k.name); if (s) out.push(JSON.parse(s)); }
    cursor = list.list_complete ? null : list.cursor;
  } while (cursor);
  out.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return out;
}

// ───────────────────────── helpers ─────────────────────────
function originOk(o) { return ALLOWED_ORIGINS.includes(o); }
function corsFor(o) {
  return {
    'Access-Control-Allow-Origin': originOk(o) ? o : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}
function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status, headers: { ...(cors || {}), 'content-type': 'application/json' } });
}
function stamp() { return null; }

// Verify Meta's X-Hub-Signature-256 (HMAC-SHA256 of the raw body with the app secret)
async function verifySignature(env, request, raw) {
  if (!env.META_APP_SECRET) return true; // allow if not configured (dev)
  const sig = request.headers.get('x-hub-signature-256') || '';
  if (!sig.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', enc(env.META_APP_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, enc(raw));
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');
  return timingSafeEqual('sha256=' + hex, sig);
}
function enc(s) { return new TextEncoder().encode(s); }
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0; for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
