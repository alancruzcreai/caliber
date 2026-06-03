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

// campaign.id IN [...] filter as Meta expects it
const campaignFilter = (ids) =>
  JSON.stringify([{ field: 'campaign.id', operator: 'IN', value: ids }]);

// Aggregated insights for a window, restricted to the given campaign ids
async function windowInsights(datePreset, ids) {
  if (!ids.length) {
    return { spend: 0, impressions: 0, clicks: 0, cpm: 0, cpc: 0, ctr: 0, reach: 0, frequency: 0, hasData: false, from: null, to: null };
  }
  try {
    const r = await graph(`${ACCOUNT}/insights`, {
      fields: 'spend,impressions,clicks,cpm,cpc,ctr,reach,frequency',
      date_preset: datePreset,
      filtering: campaignFilter(ids),
      level: 'account',
    });
    const d = (r.data && r.data[0]) || {};
    return {
      spend: num(d.spend), impressions: num(d.impressions), clicks: num(d.clicks),
      cpm: num(d.cpm), cpc: num(d.cpc), ctr: num(d.ctr),
      reach: num(d.reach), frequency: num(d.frequency),
      hasData: !!(r.data && r.data.length),
      from: d.date_start || null, to: d.date_stop || null,
    };
  } catch (e) {
    return { error: e.message, spend: 0, impressions: 0, clicks: 0, cpm: 0, cpc: 0, ctr: 0, reach: 0, hasData: false };
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
      fields: 'name,status,effective_status,objective,insights.date_preset(maximum){spend,impressions,clicks,cpm,cpc,ctr,reach}',
      limit: '200',
    });
    allCampaigns = (r.data || []).map((c) => {
      const i = (c.insights && c.insights.data && c.insights.data[0]) || {};
      return {
        id: c.id, name: c.name, status: c.status, effective_status: c.effective_status,
        objective: c.objective || '',
        spend: num(i.spend), impressions: num(i.impressions), clicks: num(i.clicks),
        cpm: num(i.cpm), cpc: num(i.cpc), ctr: num(i.ctr), reach: num(i.reach),
      };
    });
  } catch (e) {
    console.error(`  ✗ No pude listar campañas: ${e.message}`);
  }

  console.log(`  campañas totales en la cuenta: ${allCampaigns.length}`);
  allCampaigns.forEach(c => console.log(`    · [${c.effective_status || c.status}] ${c.id} — ${c.name.slice(0, 50)}`));

  // Decide which campaigns count:
  //  - if an allowlist is provided, use it
  //  - else: only ACTIVE (the new one + whatever Mauricio activates)
  let selected;
  if (ALLOWLIST.length) {
    selected = allCampaigns.filter(c => ALLOWLIST.includes(c.id));
    console.log(`  filtro: allowlist (${ALLOWLIST.length} ids)`);
  } else {
    selected = allCampaigns.filter(c => c.status === 'ACTIVE' || c.effective_status === 'ACTIVE');
    console.log(`  filtro: solo ACTIVAS`);
  }
  const ids = selected.map(c => c.id);
  console.log(`  campañas seleccionadas: ${ids.length}`);

  // Windows + breakdowns restricted to selected campaigns
  const [w7, w30, wMax, bdAge, bdGender, bdCountry, bdPlacement] = await Promise.all([
    windowInsights('last_7d', ids),
    windowInsights('last_30d', ids),
    windowInsights('maximum', ids),
    breakdown('age', ids),
    breakdown('gender', ids),
    breakdown('country', ids),
    breakdown('publisher_platform', ids),
  ]);

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
    breakdowns: { age: bdAge, gender: bdGender, country: bdCountry, placement: bdPlacement },
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`✓ meta-live.json escrito · ${ids.length} campaña(s) activa(s) · spend(max) $${wMax.spend}`);
})().catch((e) => {
  console.error('✗ Falló el sync:', e.message);
  process.exit(1);
});
