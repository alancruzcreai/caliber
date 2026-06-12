/**
 * Caliber — AI Sales Agent proxy (Cloudflare Worker)
 * --------------------------------------------------------------
 * One tiny endpoint so ANYONE who opens the Caliber link can chat
 * with the REAL Claude-powered agent — zero setup on their side.
 *
 * The Anthropic API key lives ONLY here, as a Cloudflare secret.
 * It is never in the website, never in the git repo, never sent to
 * the browser. The browser sends { system, messages }; this worker
 * adds the secret key, relays to Claude, and returns the reply.
 *
 * SETUP (full walkthrough in SETUP-AI-AGENT.md):
 *   1. Cloudflare dashboard → Workers & Pages → Create Worker
 *      → replace the sample with this file → Deploy.
 *   2. Worker → Settings → Variables and Secrets → add a SECRET:
 *        ANTHROPIC_API_KEY = sk-ant-...        (your key, paid credits)
 *      (optional plain var) MODEL = claude-sonnet-4-6
 *   3. Copy the worker URL (https://xxxx.workers.dev) and send it to
 *      Alan. The URL is NOT a secret — it's safe to share/commit.
 * --------------------------------------------------------------
 */

// Only these origins may call the proxy (stops random sites burning
// your Anthropic credits). Add a custom domain here if you point one
// at the dashboard later.
const ALLOWED_ORIGINS = [
  'https://alancruzcreai.github.io',
  'http://localhost:8769',
  'http://127.0.0.1:8769',
];

const MAX_TOKENS = 400;   // replies are short DMs; this is plenty
const MAX_MESSAGES = 24;  // bound the relayed history

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);

    // Origin guard — browsers always send Origin on a cross-site POST.
    if (origin && !allowed) return json({ error: 'origin not allowed' }, 403, cors);

    if (!env.ANTHROPIC_API_KEY)
      return json({ error: 'server not configured: missing ANTHROPIC_API_KEY secret' }, 500, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'bad json' }, 400, cors); }

    const system = typeof body.system === 'string' ? body.system : '';
    let messages = Array.isArray(body.messages) ? body.messages : [];
    messages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }))
      .slice(-MAX_MESSAGES);

    if (!messages.length) return json({ error: 'no messages' }, 400, cors);

    let resp;
    try {
      resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: env.MODEL || 'claude-sonnet-4-6',
          max_tokens: MAX_TOKENS,
          system,
          messages,
        }),
      });
    } catch (e) {
      return json({ error: 'upstream fetch failed: ' + e.message }, 502, cors);
    }

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok)
      return json({ error: (data.error && data.error.message) || ('HTTP ' + resp.status) }, resp.status, cors);

    const text = (data.content && data.content[0] && data.content[0].text || '').trim();
    return json({ text }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'content-type': 'application/json' },
  });
}
