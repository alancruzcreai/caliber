#!/usr/bin/env node
/**
 * Caliber — Meta Ads sync robot
 * ------------------------------------------------------------
 * Pulls live data from the Meta Marketing API and writes
 * assets/meta-live.json, which the dashboard reads.
 *
 * Runs inside GitHub Actions on a schedule. The access token
 * is injected from GitHub Secrets (META_ACCESS_TOKEN) and is
 * NEVER committed to the repo.
 *
 * Env:
 *   META_ACCESS_TOKEN  (required) — System User token, scope ads_read
 *   META_AD_ACCOUNT    (optional) — defaults to Sebastian's account
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const API = 'v21.0';
const TOKEN = process.env.META_ACCESS_TOKEN;
const ACCOUNT = process.env.META_AD_ACCOUNT || 'act_1656033801684436'; // Dragon Consultations
const OUT = path.join(__dirname, '..', 'assets', 'meta-live.json');

if (!TOKEN) {
  console.error('✗ META_ACCESS_TOKEN no está definido. Aborta.');
  process.exit(1);
}

const BASE = `https://graph.facebook.com/${API}`;

// Small helper: GET a Graph endpoint, return parsed JSON (throws on API error)
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

// Account-level insights for a given window
async function accountInsights(datePreset) {
  try {
    const r = await graph(`${ACCOUNT}/insights`, {
      fields: 'spend,impressions,clicks,cpm,cpc,ctr,reach,frequency',
      date_preset: datePreset,
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
    return { error: e.message, hasData: false };
  }
}

// Campaigns + their insights
async function campaigns() {
  try {
    const r = await graph(`${ACCOUNT}/campaigns`, {
      fields: 'name,status,objective,insights.date_preset(maximum){spend,impressions,clicks,cpm,cpc,ctr,reach}',
      limit: '50',
    });
    return (r.data || []).map((c) => {
      const i = (c.insights && c.insights.data && c.insights.data[0]) || {};
      return {
        id: c.id, name: c.name, status: c.status, objective: c.objective || '',
        spend: num(i.spend), impressions: num(i.impressions), clicks: num(i.clicks),
        cpm: num(i.cpm), cpc: num(i.cpc), ctr: num(i.ctr), reach: num(i.reach),
      };
    });
  } catch (e) {
    return { error: e.message };
  }
}

// Breakdown helper (age, gender, country, publisher_platform)
async function breakdown(by, preset = 'maximum') {
  try {
    const r = await graph(`${ACCOUNT}/insights`, {
      fields: 'spend,impressions,clicks,ctr',
      breakdowns: by,
      date_preset: preset,
      limit: '100',
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

  let accountName = ACCOUNT;
  try {
    const meta = await graph(ACCOUNT, { fields: 'name,currency,account_status,amount_spent' });
    accountName = meta.name || ACCOUNT;
  } catch (e) { /* non-fatal */ }

  const [w7, w30, wMax, camps, bdAge, bdGender, bdCountry, bdPlacement] = await Promise.all([
    accountInsights('last_7d'),
    accountInsights('last_30d'),
    accountInsights('maximum'),
    campaigns(),
    breakdown('age'),
    breakdown('gender'),
    breakdown('country'),
    breakdown('publisher_platform'),
  ]);

  const out = {
    account: {
      id: ACCOUNT,
      name: accountName,
      connected: true,
      // syncedAt is filled by the workflow (Date is unavailable deterministically here)
      syncedAt: process.env.SYNC_TS || null,
    },
    windows: { last_7d: w7, last_30d: w30, maximum: wMax },
    campaigns: camps,
    breakdowns: { age: bdAge, gender: bdGender, country: bdCountry, placement: bdPlacement },
  };

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  const activeCount = Array.isArray(camps) ? camps.filter(c => c.status === 'ACTIVE').length : 0;
  console.log(`✓ meta-live.json escrito.`);
  console.log(`  · spend (max): $${wMax.spend} · campañas: ${Array.isArray(camps) ? camps.length : 0} (${activeCount} activas)`);
  console.log(`  · últimos 30d: ${w30.hasData ? '$' + w30.spend : 'sin gasto'}`);
})().catch((e) => {
  console.error('✗ Falló el sync:', e.message);
  process.exit(1);
});
