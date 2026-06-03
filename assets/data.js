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
    agenda: 2
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
  }

};
