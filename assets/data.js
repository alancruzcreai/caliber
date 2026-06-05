// ============================================
// CALIBER — Mock data (shared across screens)
// ============================================

window.CALIBER_DATA = {

  user: {
    name: "Sebastian Landa",
    role: "Operator · Owner",
    initials: "SL"
  },

  navCounts: {
    dashboard: null,
    conversations: 12,
    leads: 17,
    ads: null,
    agenda: 2,
    inbox: 6
  },

  kpis: [
    { label: "DMs Today",         value: 47, delta: "+12 vs yesterday", trend: "up",   spark: [4,8,6,12,9,14,11,18,15,21,19,23] },
    { label: "Awaiting Review",   value: 17, delta: "8 marked hot",      trend: "flat", spark: [12,14,11,13,15,14,16,17,15,17,16,17] },
    { label: "Calls This Week",   value: 9,  delta: "of 10 capacity",    trend: "up",   spark: [1,2,2,1,3,2,3,4,3,5,7,9] },
    { label: "Pipeline Value",    value: "$67.5K", delta: "+$22K WoW",   trend: "up",   spark: [22,28,35,30,42,48,52,55,60,62,65,67] }
  ],

  pipeline: [
    { stage: "01", label: "DMs received this month",     value: 247, pct: 100 },
    { stage: "02", label: "Engaged in discovery",        value: 168, pct: 68 },
    { stage: "03", label: "Marked hot by AI",            value: 84,  pct: 34 },
    { stage: "04", label: "Passed human qualification",  value: 41,  pct: 17 },
    { stage: "05", label: "Booked with Sebastian",       value: 37,  pct: 15 },
    { stage: "06", label: "Closed — became clients",     value: 11,  pct: 4.5 }
  ],

  leadsHot: [
    {
      handle: "@marco_jet",
      name: "Marco Petrov",
      score: 87,
      lang: "EN",
      country: "Greece · yacht-based",
      vertical: "Yacht captain",
      pain: "lose all routine when guests are on board",
      priorInvestment: "Wim Hof Method — abandoned week 4",
      budgetSignal: "Confirmed $5-10K range (turn 5)",
      sourceTheme: "@luxuryyachtworld",
      angleHit: "C",
      why: [
        "Specific pain, not generic",
        "Confirmed a range without the AI pushing",
        "Prior investment = knows this costs money"
      ],
      lastTurn: 6,
      status: "awaiting_review",
      flag: "🇬🇷"
    },
    {
      handle: "@julio_vc",
      name: "Julio Álvarez",
      score: 79,
      lang: "ES",
      country: "Mexico · CDMX/PV",
      vertical: "VC / Founder",
      pain: "I travel 9 months a year and my deep sleep collapses",
      priorInvestment: "Strategic Coach, dropped it for lack of time",
      budgetSignal: "Confirmed $8-15K range (turn 6)",
      sourceTheme: "@founders.daily",
      angleHit: "B",
      why: [
        "Specific metrics (deep sleep)",
        "Verifiable title: GP at a top-10 LATAM fund",
        "Mentioned peers already in similar programs"
      ],
      lastTurn: 6,
      status: "awaiting_review",
      flag: "🇲🇽"
    },
    {
      handle: "@kira.ldn",
      name: "Kira Ashford",
      score: 74,
      lang: "EN",
      country: "London · UK",
      vertical: "Tech exec",
      pain: "fly weekly LDN-SFO, cortisol is wrecked",
      priorInvestment: "Joe Dispenza retreats × 3",
      budgetSignal: "Implied — mentioned $20K spend on retreats",
      sourceTheme: "@executivewellness",
      angleHit: "D",
      why: [
        "Named biological pain (cortisol)",
        "Documentable prior investment",
        "Technical language — high sophistication"
      ],
      lastTurn: 7,
      status: "awaiting_review",
      flag: "🇬🇧"
    },
    {
      handle: "@dani.miami",
      name: "Daniela Restrepo",
      score: 68,
      lang: "ES",
      country: "Miami · FL",
      vertical: "Family office",
      pain: "routines don't last me more than 3 weeks when traveling",
      priorInvestment: "Local coaches only",
      budgetSignal: "Not confirmed yet",
      sourceTheme: "@luxurywellbeing",
      angleHit: "A",
      why: [
        "Recognizes the problem precisely",
        "Audience with willingness to invest",
        "Budget not yet confirmed — pending turn 7"
      ],
      lastTurn: 5,
      status: "awaiting_review",
      flag: "🇨🇴"
    }
  ],

  conversations: [
    { handle: "@marco_jet",    score: 87, status: "hot",     lastMsg: "yeah, 7 months on yacht mostly",      timeAgo: "2m", unread: 1, lang: "EN" },
    { handle: "@julio_vc",     score: 79, status: "hot",     lastMsg: "yeah, I'm a GP at a fund here in MX",  timeAgo: "8m", unread: 0, lang: "ES" },
    { handle: "@kira.ldn",     score: 74, status: "hot",     lastMsg: "cortisol panels are on file, yes",    timeAgo: "12m", unread: 2, lang: "EN" },
    { handle: "@dani.miami",   score: 68, status: "warm",    lastMsg: "let me check and I'll confirm",        timeAgo: "1h", unread: 0, lang: "ES" },
    { handle: "@trev.singapore", score: 62, status: "warm",    lastMsg: "what's the time commitment weekly?",  timeAgo: "1h", unread: 0, lang: "EN" },
    { handle: "@sara.mtz",     score: 41, status: "cool",    lastMsg: "okay, thanks for the info",            timeAgo: "3h", unread: 0, lang: "ES" },
    { handle: "@lifeofdana",   score: 52, status: "cool",    lastMsg: "interesting, will think about it",    timeAgo: "5h", unread: 0, lang: "EN" },
    { handle: "@nico.zrh",     score: 38, status: "cool",    lastMsg: "I'm not actively looking right now",  timeAgo: "Yest", unread: 0, lang: "EN" }
  ],

  transcriptMarco: [
    { who: "ai",   t: "10:42", text: "Hey Marco — saw you came through the Mykonos reel. The program isn't for everyone, so I'd like to ask 2 things before I send any info. Cool?" },
    { who: "lead", t: "10:44", text: "yeah go ahead" },
    { who: "ai",   t: "10:44", text: "Are you traveling 5+ months a year or mostly remote?" },
    { who: "lead", t: "10:46", text: "7 months, on yacht mostly. captain on a 60m" },
    { who: "ai",   t: "10:46", text: "Heavy. What's the bottleneck when guests are aboard — sleep, training, food discipline, or recovery?" },
    { who: "lead", t: "10:52", text: "honestly all of it falls apart. I lose all routine when guests are on board" },
    { who: "ai",   t: "10:53", text: "That's the core thing this program was built for. If we worked together for 10 weeks and one thing changed, what would it be?" },
    { who: "lead", t: "10:58", text: "consistency. I keep restarting. tried wim hof, dropped it week 4" },
    { who: "ai",   t: "10:58", text: "Got it. We work with yacht crew, founders, and a few GPs. Most invest between $5-10K a year in their health. Is that in your range right now?" },
    { who: "lead", t: "11:04", text: "yeah, that's reasonable. what's next?" }
  ],

  themePages: [
    { handle: "@luxuryyachtworld",  followers: "312K",  reel: "$850",   feed: "$520",  story: "$280",   audit: 84, vertical: "luxury_travel",   fav: true,  audience: "67% male · 30-55 · US/EU/MX" },
    { handle: "@founders.daily",     followers: "480K",  reel: "$1,200", feed: "$720",  story: "$380",   audit: 91, vertical: "exec_fitness",    fav: true,  audience: "72% male · 28-50 · global" },
    { handle: "@biohackerelite",     followers: "156K",  reel: "$420",   feed: "$260",  story: "$140",   audit: 78, vertical: "biohacking",      fav: false, audience: "61% male · 32-55 · US/UK" },
    { handle: "@executivewellness",  followers: "201K",  reel: "$600",   feed: "$360",  story: "$190",   audit: 81, vertical: "exec_fitness",    fav: true,  audience: "58% female · 30-48 · US/EU" },
    { handle: "@luxurywellbeing",    followers: "270K",  reel: "$720",   feed: "$440",  story: "$240",   audit: 79, vertical: "luxury_wellness", fav: false, audience: "64% female · 30-50 · global" },
    { handle: "@jetlife.luxe",        followers: "890K",  reel: "$2,400", feed: "$1,400",story: "$720",   audit: 67, vertical: "luxury_travel",   fav: false, audience: "55% male · 25-45 · global", risk: true },
    { handle: "@yachtcaptains.club", followers: "98K",   reel: "$320",   feed: "$200",  story: "$110",   audit: 88, vertical: "yacht",            fav: false, audience: "84% male · 28-50 · MED/CARIB" },
    { handle: "@grounded.execs",      followers: "112K",  reel: "$360",   feed: "$220",  story: "$120",   audit: 86, vertical: "exec_fitness",    fav: false, audience: "53% male · 32-52 · US/EU" }
  ],

  creatives: [
    { id: "C-01", format: "reel",     angle: "C", hook: "What my Monaco-based clients fly in for",       lang: "EN", posted: 8,  cls: "reel"     },
    { id: "C-02", format: "carousel", angle: "A", hook: "Most $1M+ travelers are silently losing this",  lang: "EN", posted: 3,  cls: "carousel" },
    { id: "C-03", format: "reel",     angle: "B", hook: "From jet-lagged to VO2max 95th in 90 days",    lang: "EN", posted: 12, cls: "reel"     },
    { id: "C-04", format: "static",   angle: "D", hook: "The 90-second nervous-system reset",            lang: "EN", posted: 5,  cls: "static"   },
    { id: "C-05", format: "reel",     angle: "E", hook: "Stop your 5 AM cold plunge. Do this instead.",  lang: "EN", posted: 6,  cls: "reel"     },
    { id: "C-06", format: "carousel", angle: "C", hook: "What my Monaco clients come looking for", lang: "ES", posted: 2,  cls: "carousel" },
    { id: "C-07", format: "reel",     angle: "B", hook: "From chronic jet lag to top 5% VO2max in 12 weeks", lang: "ES", posted: 4,  cls: "reel"     },
    { id: "C-08", format: "static",   angle: "D", hook: "90-second nervous-system reset before a C-suite", lang: "ES", posted: 2,  cls: "static" }
  ],

  todaysCalls: [
    {
      time: "10:00 — 10:40",
      tz: "your time · Mexico City",
      name: "Marco Petrov",
      handle: "@marco_jet",
      flag: "🇬🇷",
      vertical: "Yacht captain",
      country: "Greece · yacht-based",
      lang: "EN",
      score: 87,
      pain: "lose all routine when guests are on board",
      priorPrograms: "Wim Hof — abandoned week 4",
      budgetConfirmed: "$5-10K range",
      whyClicked: "Mykonos reel — peer endorsement angle",
      angleToOpen: "Lead with nervous system (Demartini twist). He abandoned Wim Hof not because of cold, but because no system survived guest weeks. Position the 6-pillar dynamic system as the answer to his exact failure.",
      hotButtons: ["consistency without rigidity", "reset between charters", "I keep restarting"],
      sourceTheme: "@luxuryyachtworld",
      zoomLink: "#"
    },
    {
      time: "16:00 — 16:40",
      tz: "your time · Mexico City",
      name: "Julio Álvarez",
      handle: "@julio_vc",
      flag: "🇲🇽",
      vertical: "VC · General Partner",
      country: "Mexico · CDMX",
      lang: "ES",
      score: 79,
      pain: "I travel 9 months a year and my deep sleep collapses",
      priorPrograms: "Strategic Coach (Foundations), dropped it for time",
      budgetConfirmed: "$8-15K range",
      whyClicked: "Founders.daily reel — transformation angle",
      angleToOpen: "Anchor in metrics: he talked about deep sleep. Open with how the 6 pillars improve sleep score in 14 days. He dropped Strategic Coach over time — position the program as less time friction but deeper.",
      hotButtons: ["my deep sleep collapses", "I can't take more programs that demand 5 hrs/week", "my partners are in something like this"],
      sourceTheme: "@founders.daily",
      zoomLink: "#"
    }
  ],

  weekAhead: [
    { day: "MON", date: "25", calls: 2 },
    { day: "TUE", date: "26", calls: 2 },
    { day: "WED", date: "27", calls: 2, today: true },
    { day: "THU", date: "28", calls: 1 },
    { day: "FRI", date: "29", calls: 2 },
    { day: "SAT", date: "30", calls: 0 },
    { day: "SUN", date: "31", calls: 0 }
  ],

  // ============================================
  // META ADS — schema aligned with Marketing API
  // (Insights endpoint field names preserved so the
  //  real-data swap is a source change, not a redesign)
  // ============================================

  meta: {
    account: {
      id: "act_1029384756",
      name: "Dragon Consultations — HSTP",
      currency: "USD",
      timezone: "America/Mexico_City",
      connected: false,            // flips true once Meta token is wired
      lastSync: "demo data"
    },

    // window-level rollup (account/insights?date_preset=last_30d)
    accountInsights: {
      date_preset: "last_30d",
      spend: 11480.00,
      impressions: 1894200,
      clicks: 28410,
      cpm: 6.06,                   // spend / impressions * 1000
      cpc: 0.40,                   // spend / clicks
      ctr: 1.50,                   // clicks / impressions * 100
      reach: 612400,
      frequency: 3.09,
      // custom-computed downstream (Meta + lead tracker)
      conversations: 1240,
      appointments: 168,
      qualified: 41,
      customers: 11,
      revenue: 82500.00            // 11 × $7,500 ticket
    },

    // funnel — each stage carries its own cost-per
    funnel: [
      { key: "impressions",   label: "Impressions",        value: 1894200, cost: 0.006,  costLabel: "CPM $6.06", meta: true  },
      { key: "clicks",        label: "Link clicks",        value: 28410,   cost: 0.40,   costLabel: "per click", meta: true  },
      { key: "conversations", label: "DM conversations",   value: 1240,    cost: 9.26,   costLabel: "per convo", meta: false },
      { key: "appointments",  label: "Calls booked",       value: 168,     cost: 68.33,  costLabel: "per booking", meta: false },
      { key: "qualified",     label: "Qualified leads",    value: 41,      cost: 280.00, costLabel: "per qualified", meta: false },
      { key: "customers",     label: "Clients closed",     value: 11,      cost: 1043.64,costLabel: "CAC", meta: false }
    ],

    // campaigns (account/campaigns + insights per campaign)
    campaigns: [
      {
        id: "23859x001", name: "HSTP · Founders · Transformation",
        status: "ACTIVE", objective: "OUTCOME_LEADS", platform: "facebook",
        spend: 4120, impressions: 642000, clicks: 11200, cpm: 6.42, cpc: 0.37, ctr: 1.74,
        conversations: 512, appointments: 71, qualified: 19, customers: 6,
        cpl: 216.84, cac: 686.67, roas: 10.9, trend: "up"
      },
      {
        id: "23859x002", name: "HSTP · Yacht crew · Peer",
        status: "ACTIVE", objective: "OUTCOME_LEADS", platform: "instagram",
        spend: 2890, impressions: 388000, clicks: 6800, cpm: 7.45, cpc: 0.43, ctr: 1.75,
        conversations: 318, appointments: 44, qualified: 11, customers: 3,
        cpl: 262.73, cac: 963.33, roas: 7.8, trend: "up"
      },
      {
        id: "23859x003", name: "HSTP · Exec wellness · Nervous system",
        status: "ACTIVE", objective: "OUTCOME_LEADS", platform: "facebook",
        spend: 2210, impressions: 401000, clicks: 5900, cpm: 5.51, cpc: 0.37, ctr: 1.47,
        conversations: 248, appointments: 34, qualified: 8, customers: 2,
        cpl: 276.25, cac: 1105.00, roas: 6.8, trend: "flat"
      },
      {
        id: "23859x004", name: "HSTP · Cold · Contrarian (5AM)",
        status: "ACTIVE", objective: "OUTCOME_LEADS", platform: "facebook",
        spend: 1640, impressions: 312000, clicks: 3210, cpm: 5.26, cpc: 0.51, ctr: 1.03,
        conversations: 124, appointments: 14, qualified: 2, customers: 0,
        cpl: 820.00, cac: null, roas: 0, trend: "down"
      },
      {
        id: "23859x005", name: "HSTP · Retargeting · 7d clickers",
        status: "ACTIVE", objective: "OUTCOME_LEADS", platform: "facebook",
        spend: 620, impressions: 151200, clicks: 1300, cpm: 4.10, cpc: 0.48, ctr: 0.86,
        conversations: 38, appointments: 5, qualified: 1, customers: 0,
        cpl: 620.00, cac: null, roas: 0, trend: "flat"
      }
    ],

    // benchmarks for "good/warn/bad" coloring (industry-ish)
    benchmarks: { cpm: 8.0, cpc: 0.60, ctr: 1.0, cpl: 350, cac: 1200, roas: 5 },

    // breakdowns (insights?breakdowns=age,gender / country / publisher_platform)
    breakdowns: {
      age: [
        { bucket: "25-34", spend: 2180, clicks: 5400, qualified: 6,  ctr: 1.32 },
        { bucket: "35-44", spend: 4560, clicks: 11800, qualified: 18, ctr: 1.81 },
        { bucket: "45-54", spend: 3420, clicks: 8200, qualified: 13, ctr: 1.69 },
        { bucket: "55-64", spend: 1320, clicks: 3010, qualified: 4,  ctr: 1.22 }
      ],
      gender: [
        { bucket: "male",   spend: 7240, qualified: 27, ctr: 1.66 },
        { bucket: "female", spend: 4010, qualified: 13, ctr: 1.41 },
        { bucket: "unknown",spend: 230,  qualified: 1,  ctr: 0.98 }
      ],
      country: [
        { code: "US", name: "United States", spend: 4820, qualified: 16, cac: 980 },
        { code: "MX", name: "Mexico",        spend: 2410, qualified: 9,  cac: 720 },
        { code: "GB", name: "United Kingdom",spend: 1680, qualified: 6,  cac: 1100 },
        { code: "AE", name: "UAE",           spend: 1290, qualified: 5,  cac: 1340 },
        { code: "ES", name: "Spain",        spend: 880,  qualified: 3,  cac: 950 },
        { code: "CH", name: "Switzerland",   spend: 400,  qualified: 2,  cac: 1500 }
      ],
      placement: [
        { name: "IG Reels",       spend: 4180, qualified: 17, ctr: 1.92 },
        { name: "IG Stories",     spend: 2240, qualified: 7,  ctr: 1.43 },
        { name: "FB Feed",        spend: 3110, qualified: 11, ctr: 1.51 },
        { name: "FB Reels",       spend: 1150, qualified: 4,  ctr: 1.28 },
        { name: "Audience Net.",  spend: 800,  qualified: 2,  ctr: 0.74 }
      ]
    },

    // custom audiences for retargeting (customaudiences endpoint)
    audiences: [
      { name: "Clicked · no DM (7d)",        size: 18400, type: "retargeting", suggested: "Warm reminder reel", potential: "high" },
      { name: "DM'd · no booking (14d)",     size: 612,   type: "retargeting", suggested: "Social proof carousel", potential: "high" },
      { name: "Booked · no-show (30d)",      size: 47,    type: "retargeting", suggested: "1:1 re-book DM",       potential: "medium" },
      { name: "Video 75% viewers (30d)",     size: 24300, type: "retargeting", suggested: "Direct CTA reel",      potential: "medium" },
      { name: "Lookalike · closed clients",  size: 1900000, type: "lookalike", suggested: "Scale top creative",  potential: "high" },
      { name: "Lookalike · qualified leads", size: 2100000, type: "lookalike", suggested: "Test new angle",      potential: "medium" }
    ],

    // 30-day daily series for the trend chart (spend, qualified)
    daily: [
      {d:"01",spend:352,qualified:1},{d:"02",spend:368,qualified:1},{d:"03",spend:381,qualified:2},
      {d:"04",spend:359,qualified:1},{d:"05",spend:402,qualified:2},{d:"06",spend:418,qualified:1},
      {d:"07",spend:390,qualified:2},{d:"08",spend:374,qualified:1},{d:"09",spend:421,qualified:2},
      {d:"10",spend:438,qualified:2},{d:"11",spend:402,qualified:1},{d:"12",spend:455,qualified:3},
      {d:"13",spend:468,qualified:2},{d:"14",spend:412,qualified:1},{d:"15",spend:389,qualified:2},
      {d:"16",spend:432,qualified:2},{d:"17",spend:448,qualified:1},{d:"18",spend:461,qualified:3},
      {d:"19",spend:455,qualified:2},{d:"20",spend:478,qualified:2},{d:"21",spend:492,qualified:1},
      {d:"22",spend:468,qualified:2},{d:"23",spend:412,qualified:1},{d:"24",spend:389,qualified:2},
      {d:"25",spend:402,qualified:1},{d:"26",spend:438,qualified:1},{d:"27",spend:455,qualified:2},
      {d:"28",spend:461,qualified:0},{d:"29",spend:448,qualified:1},{d:"30",spend:421,qualified:1}
    ],

    // actionable insight cards (generated rules → text)
    insights: [
      { tone: "good",  title: "Founders campaign is your engine",
        body: "ROAS 10.9× and lowest CAC ($687). Shift +30% budget here from the Cold/Contrarian set.",
        action: "Reallocate $500/day" },
      { tone: "bad",   title: "Cold · Contrarian is leaking budget",
        body: "$1,640 spent, 0 clients, CPL 2.3× your average. CTR 1.03% — creative fatigue likely.",
        action: "Pause or refresh creative" },
      { tone: "good",  title: "35-44 is your sweet spot",
        body: "44% of qualified leads, CTR 1.81%. Tighten age targeting and lift bids for this bracket.",
        action: "Narrow age range" },
      { tone: "warn",  title: "612 people DM'd but never booked",
        body: "A booking-reminder retargeting audience could recover ~8-12 calls at low cost.",
        action: "Launch re-book audience" }
    ]
  },

  // ============================================
  // COMMAND CENTER — growth funnel (Mauricio's view)
  // Numbers tell one coherent story: the bottleneck of
  // the period is BOOKING RATE (stage 4). Stage 3 (cost
  // per qualified lead) and stage 6 (close rate) always
  // carry the "money" / "close" emphasis.
  // ============================================
  growth: {
    period: "last_30d",
    spend: 1008.00,                 // total ad spend, 30d
    revenue: 12000.00,              // 4 clients × $3,000
    target: { ticket: 3000, clientsGoal: 1, clientsClosed: 4 },

    funnel: [
      { stage: 0, key: "cold",        label: "Cold audience",   what: "Travelers, yacht crew, high-performing remotes",
        metric: "CPM",                  value: 7.10,  unit: "usd",  goal: 8.00,  format: "usd",  toNext: 1.50 },
      { stage: 1, key: "ad",          label: "Ad",              what: "Pain hook + value (4:5 / 1:1 / 9:16)",
        metric: "Hook rate · CTR",      value: 1.50,  unit: "pct",  goal: 1.20,  format: "pct",  count: 2130, countLabel: "link clicks", toNext: 13.6 },
      { stage: 2, key: "whatsapp",    label: "Click → WhatsApp",what: "Keyword ALIGNED (ELEVATE in luxe)",
        metric: "CPL",                  value: 3.48,  unit: "usd",  goal: 4.00,  format: "usd",  count: 290,  countLabel: "conversations", toNext: 33.1 },
      { stage: 3, key: "qualify",     label: "Auto-reply + Qualify", what: "Welcome + 2–3 questions (human)",
        metric: "Cost / qualified lead",value: 10.50, unit: "usd",  goal: 9.00,  format: "usd",  count: 96,   countLabel: "qualified", toNext: 32.3,
        emphasis: "money", note: "← where the money is decided" },
      { stage: 4, key: "book",        label: "Book",            what: "Reserve the 15-min Express Call",
        metric: "Booking rate",         value: 32,    unit: "pct",  goal: 50,    format: "pct",  count: 31,   countLabel: "booked", toNext: 71.0,
        bottleneck: true },
      { stage: 5, key: "call",        label: "Express Call",    what: "Human close, 6-pillar system",
        metric: "Show-up rate",         value: 71,    unit: "pct",  goal: 75,    format: "pct",  count: 22,   countLabel: "showed", toNext: 18.2 },
      { stage: 6, key: "close",       label: "Close",           what: "Apply Now → Stripe",
        metric: "Close rate",           value: 18,    unit: "pct",  goal: 15,    format: "pct",  count: 4,    countLabel: "closed", toNext: 100,
        emphasis: "close", note: ">~1% of qualified is already profitable" },
      { stage: 7, key: "onboarding",  label: "Onboarding",      what: "Enters HSTP (1 yr · 10 wks + systems)",
        metric: "Retention",            value: 100,   unit: "pct",  goal: 90,    format: "pct",  count: 4,    countLabel: "onboarding" }
    ],

    // Unit-economics assumptions (editable in the calculator)
    unitEcon: {
      cpm: 7.10, ctr: 1.5, clickToConvo: 13.6, convoToQualified: 33.1,
      bookingRate: 32, showRate: 71, closeRate: 18, ticket: 3000
    },

    // Audience segments + pains (feed the creative-brief agent)
    segments: [
      { id: "yacht",    label: "Yacht crew",            pain: "lose all routine when guests are aboard" },
      { id: "founder",  label: "LATAM founders 30-45",  pain: "travel 9 months a year, deep sleep collapses" },
      { id: "remote",   label: "High-performing remotes",pain: "no system survives time zones" },
      { id: "exec",     label: "Traveling executives",  pain: "weekly long-haul wrecks cortisol" }
    ]
  },

  // ~Lead inbox (WhatsApp/IG DM via ManyChat) — mock threads
  // status: hot | warm | cold · score 0-100 · axes 0-100 each
  inbox: [
    { id:"l01", name:"Marco Petrov", handle:"@marco_jet", channel:"WhatsApp", lang:"EN", keyword:"ALIGNED", status:"hot", score:87,
      axes:{ fit:92, payment:80, intent:90, tone:85 }, reason:"Yacht captain (60m), asked about results twice, confirmed $5-10K range",
      vertical:"Yacht captain · Greece", lastMsg:"yeah, that's reasonable. what's next?", timeAgo:"2m", unread:1,
      thread:[
        {who:"lead",t:"10:41",text:"Hey, saw the Mykonos reel — ALIGNED"},
        {who:"ai",t:"10:42",text:"Hey Marco — glad it landed. This isn't for everyone, so 2 quick questions first. Cool?"},
        {who:"lead",t:"10:44",text:"yeah go ahead"},
        {who:"ai",t:"10:44",text:"Are you traveling 5+ months a year or mostly remote?"},
        {who:"lead",t:"10:46",text:"7 months, on yacht mostly. captain on a 60m"},
        {who:"ai",t:"10:47",text:"Heavy. What falls apart first when guests are aboard — sleep, training, or food?"},
        {who:"lead",t:"10:52",text:"honestly all of it. I lose all routine when guests are on board"},
        {who:"ai",t:"10:53",text:"That's exactly what this was built for. Most people we work with invest $5-10K a year in their health — is that in range for you?"},
        {who:"lead",t:"11:04",text:"yeah, that's reasonable. what's next?"}
      ]},
    { id:"l02", name:"Julio Álvarez", handle:"@julio_vc", channel:"WhatsApp", lang:"ES", keyword:"ALIGNED", status:"hot", score:81,
      axes:{ fit:88, payment:85, intent:80, tone:72 }, reason:"GP de fondo top-10 LATAM, métricas específicas (sueño profundo), peers en programas similares",
      vertical:"VC / Founder · CDMX", lastMsg:"sí, soy GP en un fondo aquí en MX", timeAgo:"9m", unread:0,
      thread:[
        {who:"lead",t:"09:30",text:"vi el anuncio, me interesa — ALIGNED"},
        {who:"ai",t:"09:31",text:"Qué bueno que escribiste. Antes de mandarte info, ¿viajas más de 5 meses al año o trabajas remoto?"},
        {who:"lead",t:"09:38",text:"viajo como 9 meses, mi sueño profundo se desploma"},
        {who:"ai",t:"09:39",text:"Ese es justo el cuello que atacamos. ¿A qué te dedicas, si se puede saber?"},
        {who:"lead",t:"09:45",text:"sí, soy GP en un fondo aquí en MX"}
      ]},
    { id:"l03", name:"Kira Ashford", handle:"@kira.ldn", channel:"IG DM", lang:"EN", keyword:"ELEVATE", status:"hot", score:78,
      axes:{ fit:80, payment:88, intent:72, tone:74 }, reason:"Flies LDN-SFO weekly, named cortisol, 3× Joe Dispenza retreats (~$20K spend)",
      vertical:"Tech exec · London", lastMsg:"cortisol panels are on file, yes", timeAgo:"14m", unread:2,
      thread:[
        {who:"lead",t:"08:10",text:"ELEVATE — how is this different from a retreat?"},
        {who:"ai",t:"08:12",text:"Fair question. Retreats reset you for a week; this builds a system that survives the travel. Do you fly often?"},
        {who:"lead",t:"08:20",text:"weekly LDN-SFO, cortisol is wrecked"},
        {who:"ai",t:"08:21",text:"Do you track it, or is that a feeling?"},
        {who:"lead",t:"08:25",text:"cortisol panels are on file, yes"}
      ]},
    { id:"l04", name:"Daniela Restrepo", handle:"@dani.mia", channel:"WhatsApp", lang:"ES", keyword:"ALIGNED", status:"warm", score:64,
      axes:{ fit:70, payment:55, intent:68, tone:60 }, reason:"Reconoce el problema con precisión, family office, budget aún sin confirmar",
      vertical:"Family office · Miami", lastMsg:"déjame ver y te confirmo", timeAgo:"1h", unread:0,
      thread:[
        {who:"lead",t:"Yest",text:"ALIGNED, las rutinas no me duran más de 3 semanas viajando"},
        {who:"ai",t:"Yest",text:"Te entiendo. ¿Cuántos meses al año estás fuera?"},
        {who:"lead",t:"Yest",text:"como medio año, entre Miami y Europa"},
        {who:"ai",t:"Yest",text:"Suena a buen fit. ¿Has invertido antes en algo de salud/coaching?"},
        {who:"lead",t:"1h",text:"déjame ver y te confirmo"}
      ]},
    { id:"l05", name:"Trevor Ng", handle:"@trev.sg", channel:"IG DM", lang:"EN", keyword:"ALIGNED", status:"warm", score:58,
      axes:{ fit:64, payment:50, intent:62, tone:55 }, reason:"Asked about weekly time commitment, no budget signal yet",
      vertical:"Remote founder · Singapore", lastMsg:"what's the time commitment weekly?", timeAgo:"1h", unread:0,
      thread:[
        {who:"lead",t:"11:00",text:"ALIGNED — what's the time commitment weekly?"},
        {who:"ai",t:"11:02",text:"Lighter than you'd think — built for people with no spare time. Are you traveling a lot right now?"}
      ]},
    { id:"l06", name:"Sara Mtz", handle:"@sara.mtz", channel:"WhatsApp", lang:"ES", keyword:"ALIGNED", status:"cold", score:38,
      axes:{ fit:42, payment:30, intent:40, tone:48 }, reason:"Preguntó precio de entrada, perfil no calza con viajero frecuente",
      vertical:"Wellness curiosa · MTY", lastMsg:"ok, gracias por la info", timeAgo:"3h", unread:0,
      thread:[
        {who:"lead",t:"07:00",text:"hola cuánto cuesta?"},
        {who:"ai",t:"07:01",text:"Depende de tu caso — ¿viajas seguido o es más por estar mejor en casa?"},
        {who:"lead",t:"07:20",text:"más en casa la verdad"},
        {who:"ai",t:"07:21",text:"Gracias por la honestidad — este programa está pensado para gente que viaja mucho. Te dejo recursos gratis por si te sirven 🙏"},
        {who:"lead",t:"3h",text:"ok, gracias por la info"}
      ]},
    { id:"l07", name:"Lucas Brandt", handle:"@lucas.zrh", channel:"IG DM", lang:"EN", keyword:"ELEVATE", status:"warm", score:61,
      axes:{ fit:66, payment:58, intent:60, tone:56 }, reason:"Private banker, luxe segment, polite but slow replies", vertical:"Private banker · Zürich",
      lastMsg:"interesting, send me more", timeAgo:"2h", unread:0, thread:[ {who:"lead",t:"2h",text:"ELEVATE, interesting, send me more"} ] },
    { id:"l08", name:"Renata Lima", handle:"@re.lima", channel:"WhatsApp", lang:"ES", keyword:"ALIGNED", status:"hot", score:75,
      axes:{ fit:82, payment:70, intent:74, tone:72 }, reason:"Atleta máster + ejecutiva, viaja por torneos, mencionó presupuesto", vertical:"Exec + athlete · São Paulo",
      lastMsg:"sí, ese rango está bien", timeAgo:"25m", unread:1, thread:[
        {who:"lead",t:"10:10",text:"ALIGNED — entreno pero viajando se me cae todo"},
        {who:"ai",t:"10:12",text:"Clarísimo. ¿Cuántos meses al año estás fuera?"},
        {who:"lead",t:"10:18",text:"6-7, compito en torneos máster"},
        {who:"ai",t:"10:19",text:"Buen fit. La mayoría invierte $5-10K/año en su salud — ¿te hace sentido?"},
        {who:"lead",t:"10:25",text:"sí, ese rango está bien"} ] },
    { id:"l09", name:"Omar Haddad", handle:"@omar.dxb", channel:"IG DM", lang:"EN", keyword:"ELEVATE", status:"warm", score:57,
      axes:{ fit:60, payment:62, intent:50, tone:55 }, reason:"Dubai-based, high payment signal, low intent (browsing)", vertical:"Real estate · Dubai",
      lastMsg:"maybe later this year", timeAgo:"4h", unread:0, thread:[ {who:"lead",t:"4h",text:"ELEVATE — maybe later this year"} ] },
    { id:"l10", name:"Paula Sender", handle:"@paula.bcn", channel:"WhatsApp", lang:"ES", keyword:"ALIGNED", status:"cold", score:33,
      axes:{ fit:35, payment:28, intent:38, tone:40 }, reason:"Estudiante, fuera del ICP", vertical:"Estudiante · Barcelona",
      lastMsg:"y hay opción gratis?", timeAgo:"5h", unread:0, thread:[ {who:"lead",t:"5h",text:"ALIGNED, y hay opción gratis?"} ] },
    { id:"l11", name:"Derek Cole", handle:"@derek.mia", channel:"IG DM", lang:"EN", keyword:"ALIGNED", status:"warm", score:60,
      axes:{ fit:64, payment:56, intent:60, tone:58 }, reason:"Charter pilot, irregular schedule, fits lifestyle", vertical:"Charter pilot · Miami",
      lastMsg:"my schedule is chaos honestly", timeAgo:"6h", unread:0, thread:[ {who:"lead",t:"6h",text:"ALIGNED — my schedule is chaos honestly"} ] },
    { id:"l12", name:"Ana Sofía R.", handle:"@anasofia", channel:"WhatsApp", lang:"ES", keyword:"ALIGNED", status:"hot", score:73,
      axes:{ fit:78, payment:68, intent:76, tone:70 }, reason:"Consultora que viaja semanal, pidió agendar", vertical:"Consultora · Bogotá",
      lastMsg:"cómo agendo la llamada?", timeAgo:"40m", unread:1, thread:[
        {who:"lead",t:"09:50",text:"ALIGNED, viajo cada semana por proyectos"},
        {who:"ai",t:"09:52",text:"Ese ritmo es justo el reto. ¿Has probado mantener rutina viajando?"},
        {who:"lead",t:"09:58",text:"lo intento y fracaso jajaja"},
        {who:"ai",t:"09:59",text:"Normal sin un sistema. ¿Te late una llamada de 15 min con Sebastian para ver si encaja?"},
        {who:"lead",t:"10:05",text:"cómo agendo la llamada?"} ] },
    { id:"l13", name:"Felix Wenger", handle:"@felix.gva", channel:"IG DM", lang:"EN", keyword:"ELEVATE", status:"cold", score:41,
      axes:{ fit:44, payment:50, intent:32, tone:46 }, reason:"Competitor scouting — generic questions, no personal pain", vertical:"Unknown · Geneva",
      lastMsg:"who runs this program?", timeAgo:"7h", unread:0, thread:[ {who:"lead",t:"7h",text:"ELEVATE — who runs this program?"} ] },
    { id:"l14", name:"Bianca Toscano", handle:"@bianca.t", channel:"WhatsApp", lang:"EN", keyword:"ALIGNED", status:"warm", score:62,
      axes:{ fit:68, payment:60, intent:58, tone:62 }, reason:"Yacht stew, lifestyle fit strong, payment unclear", vertical:"Yacht stewardess · Monaco",
      lastMsg:"we're between charters now", timeAgo:"8h", unread:0, thread:[ {who:"lead",t:"8h",text:"ALIGNED — we're between charters now"} ] },
    { id:"l15", name:"Hiro Tanaka", handle:"@hiro.tk", channel:"IG DM", lang:"EN", keyword:"ELEVATE", status:"warm", score:59,
      axes:{ fit:62, payment:64, intent:52, tone:56 }, reason:"Frequent flyer Tokyo-LA, polite, exploring", vertical:"Exec · Tokyo",
      lastMsg:"how long is the program?", timeAgo:"9h", unread:0, thread:[ {who:"lead",t:"9h",text:"ELEVATE — how long is the program?"} ] },
    { id:"l16", name:"Camila Ríos", handle:"@cami.rios", channel:"WhatsApp", lang:"ES", keyword:"ALIGNED", status:"cold", score:36,
      axes:{ fit:38, payment:32, intent:36, tone:42 }, reason:"Sin viaje frecuente, busca tips gratis", vertical:"Local · Lima",
      lastMsg:"tienes contenido gratis?", timeAgo:"10h", unread:0, thread:[ {who:"lead",t:"10h",text:"ALIGNED, tienes contenido gratis?"} ] },
    { id:"l17", name:"Nadia Volkov", handle:"@nadia.v", channel:"IG DM", lang:"EN", keyword:"ELEVATE", status:"hot", score:76,
      axes:{ fit:80, payment:78, intent:74, tone:70 }, reason:"Superyacht chief stew, high income, named specific pain", vertical:"Chief stewardess · Med",
      lastMsg:"yes, recovery between charters", timeAgo:"30m", unread:1, thread:[
        {who:"lead",t:"10:30",text:"ELEVATE — recovery is my problem"},
        {who:"ai",t:"10:31",text:"Say more — recovery from what specifically?"},
        {who:"lead",t:"10:40",text:"yes, recovery between charters"} ] },
    { id:"l18", name:"Greg Mason", handle:"@greg.nyc", channel:"WhatsApp", lang:"EN", keyword:"ALIGNED", status:"warm", score:55,
      axes:{ fit:58, payment:54, intent:52, tone:56 }, reason:"Hedge fund, traveling less lately, lukewarm", vertical:"Finance · NYC",
      lastMsg:"traveling less these days tbh", timeAgo:"11h", unread:0, thread:[ {who:"lead",t:"11h",text:"ALIGNED — traveling less these days tbh"} ] }
  ]

};
