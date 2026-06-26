#!/usr/bin/env node
/**
 * Caliber — Meta Ads sync robot
 * ------------------------------------------------------------
 * Pulls live data from the Meta Marketing API and writes
 * assets/meta-live.json, which the dashboard reads.
 *
 * SCOPE: only ACTIVE campaigns are reported. Paused/old campaigns
 * are ignored. Account totals & breakdowns are computed from the
 * active campaigns only (via campaign.id filtering), so the numbers
 * reflect exactly what's running now (the campaign Mauricio launched
 * plus any future ones he activates).
 *
 * Runs inside GitHub Actions on a schedule. Token from Secrets.
 *
 * Env:
 *   META_ACCESS_TOKEN  (required) — user/system token, scope ads_read
 *   META_AD_ACCOUNT    (optional) — defaults to the live account
 *   META_CAMPAIGN_IDS  (optional) — comma-separated allowlist; if set,
 *                                   overrides the "active only" filter
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const API = 'v21.0';
const TOKEN = process.env.META_ACCESS_TOKEN;
const ACCOUNT = process.env.META_AD_ACCOUNT || 'act_120218744349790215';
const ALLOWLIST = (process.env.META_CAMPAIGN_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
const OUT = path.join(__dirname, '..', 'assets', 'meta-live.json');

if (!TOKEN) {
  console.error('✗ META_ACCESS_TOKEN no está definido. Aborta.');
  process.exit(1);
}

const BASE = `https://graph.facebook.com/${API}`;

async function graph(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('access_token', TOKEN);
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) {
    throw new Error(`Meta API ${json.error.code}: ${json.error.message} (${endpoint})`);
  }
  return json;
}

const num = (v) => (v == null ? 0 : parseFloat(v));

// Messaging conversations started ("chats with Sebastian" = leads) from an
// insights `actions` array. Mauricio's HSTP campaigns optimize for messaging,
// so the real "lead" is a started conversation, not a link click.
function chatsFromActions(actions) {
  if (!Array.isArray(actions)) return 0;
  const exact = actions.find(a => a && a.action_type === 'onsite_conversion.messaging_conversation_started_7d');
  if (exact) return num(exact.value);
  const any = actions.find(a => a && typeof a.action_type === 'string' && a.action_type.indexOf('messaging_conversation_started') !== -1);
  return any ? num(any.value) : 0;
}

// Value of a single action type out of an insights `actions` array
function actionVal(actions, type) {
  if (!Array.isArray(actions)) return 0;
  const a = actions.find(x => x && x.action_type === type);
  return a ? num(a.value) : 0;
}

// "Lead = started a chat with Sebastian." For MESSAGING (Conversaciones)
// campaigns that's a messaging conversation; for TRAFFIC→WhatsApp campaigns
// it's the link click that opens WhatsApp (Meta doesn't log a conversation
// for the traffic objective). Pick the best real signal available.
function leadCount(d) {
  const m = chatsFromActions(d && d.actions);
  if (m > 0) return { leads: m, src: 'messaging' };
  const lk = actionVal(d && d.actions, 'link_click');
  if (lk > 0) return { leads: lk, src: 'link_click' };
  const cl = num(d && d.clicks);
  if (cl > 0) return { leads: cl, src: 'clicks' };
  return { leads: 0, src: 'none' };
}

// Derived "view → chat" metrics for any insights row `d`
function chatMetrics(spend, impressions, d) {
  const lc = leadCount(d);
  return {
    chats: lc.leads,
    chatSrc: lc.src,                                                       // messaging | link_click | clicks
    ctrChat: impressions ? +(lc.leads / impressions * 100).toFixed(2) : 0, // view → chat %
    cpl: lc.leads ? +(spend / lc.leads).toFixed(2) : null,                 // cost per lead/chat
  };
}

// campaign.id IN [...] filter as Meta expects it
const campaignFilter = (ids) =>
  JSON.stringify([{ field: 'campaign.id', operator: 'IN', value: ids }]);

// Aggregated insights for a window, restricted to the given campaign ids
async function windowInsights(datePreset, ids) {
  if (!ids.length) {
    return { spend: 0, impressions: 0, clicks: 0, cpm: 0, cpc: 0, ctr: 0, reach: 0, frequency: 0, chats: 0, ctrChat: 0, cpl: null, hasData: false, from: null, to: null };
  }
  try {
    const r = await graph(`${ACCOUNT}/insights`, {
      fields: 'spend,impressions,clicks,cpm,cpc,ctr,reach,frequency,actions',
      date_preset: datePreset,
      filtering: campaignFilter(ids),
      level: 'account',
    });
    const d = (r.data && r.data[0]) || {};
    const spend = num(d.spend), impressions = num(d.impressions);
    return {
      spend, impressions, clicks: num(d.clicks),
      cpm: num(d.cpm), cpc: num(d.cpc), ctr: num(d.ctr),
      reach: num(d.reach), frequency: num(d.frequency),
      ...chatMetrics(spend, impressions, d),
      hasData: !!(r.data && r.data.length),
      from: d.date_start || null, to: d.date_stop || null,
    };
  } catch (e) {
    return { error: e.message, spend: 0, impressions: 0, clicks: 0, cpm: 0, cpc: 0, ctr: 0, reach: 0, frequency: 0, chats: 0, ctrChat: 0, cpl: null, hasData: false };
  }
}

// Breakdown restricted to campaign ids
async function breakdown(by, ids, preset = 'maximum') {
  if (!ids.length) return [];
  try {
    const r = await graph(`${ACCOUNT}/insights`, {
      fields: 'spend,impressions,clicks,ctr',
      breakdowns: by,
      date_preset: preset,
      filtering: campaignFilter(ids),
      level: 'account',
      limit: '200',
    });
    return (r.data || []).map((d) => ({
      key: d[by] || d.country || d.publisher_platform || 'unknown',
      spend: num(d.spend), impressions: num(d.impressions),
      clicks: num(d.clicks), ctr: num(d.ctr),
    }));
  } catch (e) {
    return [];
  }
}

// Ad SETS under the given campaigns, with all-time insights
async function adsetsForCampaigns(ids) {
  if (!ids.length) return [];
  try {
    const r = await graph(`${ACCOUNT}/adsets`, {
      fields: 'name,status,effective_status,campaign{name},insights.date_preset(maximum){spend,impressions,reach,frequency,clicks,actions}',
      filtering: JSON.stringify([{ field: 'campaign.id', operator: 'IN', value: ids }]),
      limit: '200',
    });
    return (r.data || []).map((s) => {
      const i = (s.insights && s.insights.data && s.insights.data[0]) || {};
      const spend = num(i.spend), impressions = num(i.impressions);
      return {
        id: s.id, name: s.name, status: s.status, effective_status: s.effective_status,
        campaign: (s.campaign && s.campaign.name) || '',
        spend, impressions, clicks: num(i.clicks),
        reach: num(i.reach), frequency: num(i.frequency),
        ...chatMetrics(spend, impressions, i),
      };
    });
  } catch (e) { console.error('  ✗ adsets:', e.message); return []; }
}

// ADS (the leaf — same rows you see in Meta's "Anuncios" view) under the campaigns
async function adsForCampaigns(ids) {
  if (!ids.length) return [];
  try {
    const r = await graph(`${ACCOUNT}/ads`, {
      fields: 'name,status,effective_status,adset{name},campaign{name},insights.date_preset(maximum){spend,impressions,reach,frequency,clicks,cpm,cpc,ctr,actions}',
      filtering: JSON.stringify([{ field: 'campaign.id', operator: 'IN', value: ids }]),
      limit: '500',
    });
    return (r.data || []).map((a) => {
      const i = (a.insights && a.insights.data && a.insights.data[0]) || {};
      const spend = num(i.spend), impressions = num(i.impressions);
      return {
        id: a.id, name: a.name, status: a.status, effective_status: a.effective_status,
        adset: (a.adset && a.adset.name) || '',
        campaign: (a.campaign && a.campaign.name) || '',
        spend, impressions, clicks: num(i.clicks),
        cpm: num(i.cpm), cpc: num(i.cpc), ctr: num(i.ctr),
        reach: num(i.reach), frequency: num(i.frequency),
        ...chatMetrics(spend, impressions, i),
      };
    });
  } catch (e) { console.error('  ✗ ads:', e.message); return []; }
}

(async () => {
  console.log(`→ Sync Meta · cuenta ${ACCOUNT}`);

  // Account meta
  let accountName = ACCOUNT;
  try {
    const meta = await graph(ACCOUNT, { fields: 'name,currency,account_status' });
    accountName = meta.name || ACCOUNT;
    console.log(`  cuenta: ${accountName}`);
  } catch (e) {
    console.error(`  ✗ No pude leer la cuenta ${ACCOUNT}: ${e.message}`);
  }

  // All campaigns (to know status), with their full-history insights
  let allCampaigns = [];
  try {
    const r = await graph(`${ACCOUNT}/campaigns`, {
      fields: 'name,status,effective_status,objective,insights.date_preset(maximum){spend,impressions,clicks,cpm,cpc,ctr,reach,frequency,actions}',
      limit: '200',
    });
    allCampaigns = (r.data || []).map((c) => {
      const i = (c.insights && c.insights.data && c.insights.data[0]) || {};
      const spend = num(i.spend), impressions = num(i.impressions);
      return {
        id: c.id, name: c.name, status: c.status, effective_status: c.effective_status,
        objective: c.objective || '',
        spend, impressions, clicks: num(i.clicks),
        cpm: num(i.cpm), cpc: num(i.cpc), ctr: num(i.ctr),
        reach: num(i.reach), frequency: num(i.frequency),
        ...chatMetrics(spend, impressions, i),
      };
    });
  } catch (e) {
    console.error(`  ✗ No pude listar campañas: ${e.message}`);
  }

  console.log(`  campañas totales en la cuenta: ${allCampaigns.length}`);
  allCampaigns.forEach(c => console.log(`    · [${c.effective_status || c.status}] ${c.id} — ${c.name.slice(0, 50)}`));

  // Which campaigns count = (in the allowlist) OR (currently ACTIVE).
  //  - allowlist = the specific campaign(s) we always want shown, even paused
  //  - ACTIVE = anything Mauricio turns on later shows up automatically
  // Old paused campaigns not in the allowlist stay hidden.
  const isActive = (c) => c.status === 'ACTIVE' || c.effective_status === 'ACTIVE';
  const selected = allCampaigns.filter(c => ALLOWLIST.includes(c.id) || isActive(c));
  console.log(`  filtro: allowlist (${ALLOWLIST.length}) + activas → ${selected.length} campaña(s)`);
  const ids = selected.map(c => c.id);
  console.log(`  campañas seleccionadas: ${ids.length}`);

  // Windows + breakdowns + ad sets + ads, all restricted to selected campaigns
  const [w7, w30, wMax, bdAge, bdGender, bdCountry, bdPlacement, adsets, ads] = await Promise.all([
    windowInsights('last_7d', ids),
    windowInsights('last_30d', ids),
    windowInsights('maximum', ids),
    breakdown('age', ids),
    breakdown('gender', ids),
    breakdown('country', ids),
    breakdown('publisher_platform', ids),
    adsetsForCampaigns(ids),
    adsForCampaigns(ids),
  ]);

  console.log(`  conjuntos: ${adsets.length} · anuncios: ${ads.length}`);
  ads.forEach(a => console.log(`    · [${a.effective_status || a.status}] ${(a.name || '').slice(0, 44)} — $${a.spend} · impr ${a.impressions} · reach ${a.reach} · chats ${a.chats}`));

  const out = {
    account: {
      id: ACCOUNT,
      name: accountName,
      connected: true,
      scope: ALLOWLIST.length ? 'allowlist' : 'active_only',
      activeCount: ids.length,
      syncedAt: process.env.SYNC_TS || null,
    },
    windows: { last_7d: w7, last_30d: w30, maximum: wMax },
    campaigns: selected,    // only the selected (active) campaigns
    adsets,                 // ad sets under the selected campaigns
    ads,                    // ads (same rows as Meta's "Anuncios" view)
    breakdowns: { age: bdAge, gender: bdGender, country: bdCountry, placement: bdPlacement },
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`✓ meta-live.json escrito · ${ids.length} campaña(s) · ${ads.length} anuncio(s) · spend(max) $${wMax.spend}`);
})().catch((e) => {
  console.error('✗ Falló el sync:', e.message);
  process.exit(1);
});
