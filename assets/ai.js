// ============================================
// CALIBER — AI agent layer
// ============================================
// Five agents power the Command Center. In this static
// prototype they run as convincing MOCKS (deterministic,
// derived from real data shape) so the demo always works
// with zero backend and zero API keys.
//
// Each function is marked  // AI:  at the exact call site
// where a real Claude API request would go. To make them
// real, route these through a serverless function
// (// INTEGRATION POINT below) that holds the key server-side.
//
//   model rec: triage/insights → Claude Haiku (fast/cheap)
//              conversation     → Claude Sonnet (voice quality)
// ============================================

(function () {
  const AI_ENABLED = false; // flip true once a backend proxy exists

  // Tiny helper to fake network latency so loading states show
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // INTEGRATION POINT: Claude API — server-side proxy.
  // Replace mockOnly() bodies with: await fetch('/api/ai', {…}).
  async function callClaude(/* { system, messages, model } */) {
    // AI: real request would happen here (server-side only).
    throw new Error('AI backend not configured — using mock');
  }

  // ── 1. Creative briefs ─────────────────────
  // generateCreativeBriefs(segment, painPoint) → hook variants + format
  window.aiGenerateCreativeBriefs = async function (segment, painPoint) {
    await wait(650);
    if (AI_ENABLED) { try { /* AI: briefs */ return await callClaude(); } catch (e) {} }
    const pain = painPoint || (segment && segment.pain) || 'lose your routine on the road';
    const label = (segment && segment.label) || 'travelers';
    return {
      // mock: 4 angle-diverse hooks calibrated to the 6-pillar program
      briefs: [
        { angle: "Status quo",   format: "9:16", hook: `Most ${label.toLowerCase()} are quietly ${pain}. Here's the fix.`, value: "A system that moves with your lifestyle, not against it." },
        { angle: "Transformation",format: "4:5",  hook: `From ${pain} to peak shape in 10 weeks — without a gym.`, value: "Nutrition, recovery & nervous-system protocols you run anywhere." },
        { angle: "Peer",          format: "1:1",  hook: `What my ${label.toLowerCase()} clients fly in for.`, value: "Built with founders, GPs and yacht crew who refuse to restart." },
        { angle: "Contrarian",    format: "9:16", hook: `Stop the 5 AM cold plunge. Do this instead.`, value: "The 90-second nervous-system reset before any high-stakes day." }
      ],
      note: "Mock output · connect Claude for live generation"
    };
  };

  // ── 2. Lead triage scoring ─────────────────
  // scoreLeadTriage(thread, profile) → { score, axes, reason, temp }
  window.aiScoreLeadTriage = async function (lead) {
    await wait(400);
    if (AI_ENABLED) { try { /* AI: triage */ return await callClaude(); } catch (e) {} }
    // mock: leads already carry axes+reason; derive a clean verdict
    const a = lead.axes || { fit: 50, payment: 50, intent: 50, tone: 50 };
    const score = lead.score != null ? lead.score : Math.round((a.fit + a.payment + a.intent + a.tone) / 4);
    const temp = score >= 70 ? 'hot' : score >= 50 ? 'warm' : 'cold';
    return {
      score, temp,
      axes: [
        { key: "Lifestyle fit",   value: a.fit },
        { key: "Ability to pay",  value: a.payment },
        { key: "Query intent",    value: a.intent },
        { key: "Language & tone", value: a.tone }
      ],
      reason: lead.reason || "Derived from conversation signals.",
      recommendation: score >= 70 ? "Hand to Sebastian — ready to book."
        : score >= 50 ? "Nurture 1-2 more turns, confirm budget."
        : "Low fit — share free resources, don't push."
    };
  };

  // ── 3. Conversation copilot (Sebastian's voice) ──
  // suggestNextMessage(thread) → next message draft (human approves)
  // Hard rules: ≤2 sentences, ONE question, mirror language,
  // no links before turn 3, honest if asked "are you a bot?".
  window.aiSuggestNextMessage = async function (lead) {
    await wait(550);
    if (AI_ENABLED) { try { /* AI: conversation */ return await callClaude(); } catch (e) {} }
    const es = lead.lang === 'ES';
    const last = (lead.thread && lead.thread[lead.thread.length - 1]) || { text: '' };
    const turns = (lead.thread || []).filter(m => m.who === 'ai').length;
    const txt = last.text.toLowerCase();
    let suggestion, why;

    if (/bot|robot|automat|máquina|machine/.test(txt)) {
      suggestion = es ? "Soy parte del equipo de Sebastian — él entra directo en la llamada. ¿Te late agendarla?"
                      : "I'm part of Sebastian's team — he joins the call himself. Want to set it up?";
      why = "Honesty rule: never pretend to be the founder or fully human.";
    } else if (lead.status === 'hot' && /next|agend|book|cómo|how|schedul/.test(txt)) {
      suggestion = es ? "Perfecto. Sebastian tiene jueves 4 PM o viernes 11 AM (tu hora). ¿Cuál te queda?"
                      : "Perfect. Sebastian has Thursday 4 PM or Friday 11 AM your time. Which works?";
      why = "Hot + asking to proceed → offer two concrete slots (no cold calendar link).";
    } else if (lead.status === 'cold') {
      suggestion = es ? "Gracias por la honestidad — este programa es para quien viaja mucho. Te dejo recursos gratis 🙏"
                      : "Appreciate the honesty — this is built for heavy travelers. Here are some free resources 🙏";
      why = "Low fit → exit gracefully, no pressure, protect the brand.";
    } else {
      suggestion = es ? "Suena a buen fit. ¿Cuántos meses al año estás viajando?"
                      : "Sounds like a good fit. How many months a year are you traveling?";
      why = "Warm → one qualifying question to surface lifestyle fit.";
    }
    return {
      suggestion, why,
      rules: [
        "≤ 2 sentences",
        "Exactly one question",
        es ? "Mirrors Spanish" : "Mirrors English",
        turns < 3 ? "No links yet (before turn 3)" : "Links allowed"
      ],
      requiresApproval: true
    };
  };

  // ── 4. Daily insight (funnel bottleneck) ────
  // getDailyInsight(funnelMetrics) → bottleneck + 1-2 actions
  window.aiGetDailyInsight = async function (funnel) {
    await wait(500);
    if (AI_ENABLED) { try { /* AI: insight */ return await callClaude(); } catch (e) {} }
    // mock: find the stage furthest below its goal (lower-is-better for usd, higher for pct)
    const gaps = funnel
      .filter(f => f.goal != null)
      .map(f => {
        const lowerBetter = f.format === 'usd';
        const gap = lowerBetter ? (f.value - f.goal) / f.goal : (f.goal - f.value) / f.goal;
        return { f, gap };
      })
      .sort((a, b) => b.gap - a.gap);
    const worst = (gaps[0] && gaps[0].f) || funnel.find(f => f.bottleneck);
    return {
      bottleneck: worst.label,
      headline: `Today's bottleneck is ${worst.label.toLowerCase()} (${worst.value}${worst.format === 'pct' ? '%' : ''}).`,
      detail: worst.key === 'book'
        ? "Booking rate is 18 pts under goal. The qualified leads are there — the ask to book is leaking."
        : `${worst.metric} is off target. That's where the next dollar of effort pays back most.`,
      actions: worst.key === 'book'
        ? ["Add a 1-tap slot picker right after qualification", "Send a same-day reminder to the 65 qualified-but-unbooked"]
        : ["Tighten the offer at this step", "A/B test the message that moves leads to the next stage"],
      note: "Mock insight · connect Claude for live analysis"
    };
  };

  // ── 5. Unit-economics simulator ────────────
  // simulateUnitEconomics(assumptions) → levers to hit a profitable $3k close
  window.aiSimulateUnitEconomics = async function (a) {
    await wait(450);
    if (AI_ENABLED) { try { /* AI: simulate */ return await callClaude(); } catch (e) {} }
    // mock: identify the cheapest lever to reach 1 profitable client
    const levers = [];
    if (a.bookingRate < 45) levers.push({ lever: "Booking rate", from: a.bookingRate + "%", to: "45%", impact: "Biggest unlock — same spend, ~40% more calls." });
    if (a.closeRate < 20) levers.push({ lever: "Close rate", from: a.closeRate + "%", to: "20%", impact: "Sharper Express Call script lifts revenue with zero extra ad spend." });
    if (a.costPerQualified > 9) levers.push({ lever: "Cost / qualified", from: "$" + (a.costPerQualified || 10.5), to: "$9", impact: "Better creative + tighter targeting lowers cost per qualified lead." });
    return {
      verdict: "You're already profitable at 1 client — the goal now is repeatability.",
      levers: levers.slice(0, 2),
      note: "Mock simulation · connect Claude for live what-if reasoning"
    };
  };

  window.AI_ENABLED = AI_ENABLED;
})();
