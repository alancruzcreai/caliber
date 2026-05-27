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
        "Pain específico, no genérico",
        "Confirmó rango sin que la IA insistiera",
        "Prior investment = sabe que esto cuesta"
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
      country: "México · CDMX/PV",
      vertical: "VC / Founder",
      pain: "viajo 9 meses al año y mi sueño profundo se desploma",
      priorInvestment: "Strategic Coach, dejó por falta de tiempo",
      budgetSignal: "Confirmó rango $8-15K (turn 6)",
      sourceTheme: "@founders.daily",
      angleHit: "B",
      why: [
        "Métricas específicas (sueño profundo)",
        "Cargo verificable: GP en fondo top-10 LATAM",
        "Mencionó peers que ya están en programas similares"
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
        "Pain biológico nombrado (cortisol)",
        "Inversión previa documentable",
        "Lenguaje técnico — sofistication alta"
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
      pain: "rutinas no me duran más de 3 semanas viajando",
      priorInvestment: "Solo coaches locales",
      budgetSignal: "No confirmado aún",
      sourceTheme: "@luxurywellbeing",
      angleHit: "A",
      why: [
        "Reconoce el problema con precisión",
        "Audiencia con disposición a invertir",
        "Falta confirmación de budget — pendiente turn 7"
      ],
      lastTurn: 5,
      status: "awaiting_review",
      flag: "🇨🇴"
    }
  ],

  conversations: [
    { handle: "@marco_jet",    score: 87, status: "hot",     lastMsg: "yeah, 7 months on yacht mostly",      timeAgo: "2m", unread: 1, lang: "EN" },
    { handle: "@julio_vc",     score: 79, status: "hot",     lastMsg: "sí, soy GP en un fondo aquí en MX",   timeAgo: "8m", unread: 0, lang: "ES" },
    { handle: "@kira.ldn",     score: 74, status: "hot",     lastMsg: "cortisol panels are on file, yes",    timeAgo: "12m", unread: 2, lang: "EN" },
    { handle: "@dani.miami",   score: 68, status: "warm",    lastMsg: "déjame ver y te confirmo",            timeAgo: "1h", unread: 0, lang: "ES" },
    { handle: "@trev.singapore", score: 62, status: "warm",    lastMsg: "what's the time commitment weekly?",  timeAgo: "1h", unread: 0, lang: "EN" },
    { handle: "@sara.mtz",     score: 41, status: "cool",    lastMsg: "okay, gracias por la info",            timeAgo: "3h", unread: 0, lang: "ES" },
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
    { id: "C-06", format: "carousel", angle: "C", hook: "Lo que mis clientes en Monaco vienen a buscar", lang: "ES", posted: 2,  cls: "carousel" },
    { id: "C-07", format: "reel",     angle: "B", hook: "De jet lag crónico a VO2max top 5% en 12 sem.", lang: "ES", posted: 4,  cls: "reel"     },
    { id: "C-08", format: "static",   angle: "D", hook: "Reset nervioso en 90 segundos antes de un C-suite", lang: "ES", posted: 2,  cls: "static" }
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
      country: "México · CDMX",
      lang: "ES",
      score: 79,
      pain: "viajo 9 meses al año y mi sueño profundo se desploma",
      priorPrograms: "Strategic Coach (Foundations), dejó por tiempo",
      budgetConfirmed: "$8-15K range",
      whyClicked: "Founders.daily reel — transformation angle",
      angleToOpen: "Anclar en métricas: él habló de sueño profundo. Empezar con cómo los 6 pilares mejoran sleep score en 14 días. Strategic Coach lo dejó por tiempo — posicionar el programa como menor friction temporal pero más profundo.",
      hotButtons: ["sueño profundo se desploma", "no aguanto más programas que piden 5 hrs/semana", "mis socios están en algo así"],
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
  ]

};
