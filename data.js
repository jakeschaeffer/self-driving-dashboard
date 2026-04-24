// AVProgress — single source of truth for every stat the site tracks.
//
// See DATA.md for an exhaustive description of the structure, source-quality
// conventions, and the update workflow (regulator data vs. self-reported vs.
// crowdsourced — they each get treated a little differently).
//
// The dashboard imports from here and renders it. Keep the shape stable; if
// you need a new shape, add a new exported array rather than overloading an
// existing one.

// ============================================================
// SOURCES — catalog of canonical citations.
//
// Add a source here once, then reference it from any row via SOURCES.foo.
// Updating the URL/label flows to every place it appears. For a one-off
// source that won't be reused, an inline { url, label } object on the row
// works fine — same shape.
//
// Each source is { url: string, label: string, type: "regulator" | "academic"
// | "company" | "crowdsource" | "press" }.
// `type` is hint metadata only — the UI doesn't currently render it, but
// /qa scripts and source-quality audits use it.
// ============================================================

export const SOURCES = {
  // Regulators / official
  nhtsa:           { url: "https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762", label: "NHTSA",            type: "regulator" },
  caDmv:           { url: "https://thelastdriverlicenseholder.com/2025/02/03/2024-disengagement-reports-from-california/", label: "CA DMV via LDLH", type: "regulator" },
  nhtsaPressZoox:  { url: "https://www.nhtsa.gov/press-releases/nhtsa-issues-first-ever-demonstration-exemption-american-built-automated-vehicles", label: "NHTSA",            type: "regulator" },
  fedReg:          { url: "https://www.federalregister.gov/documents/2022/03/30/2022-05426/occupant-protection-for-vehicles-with-automated-driving-systems", label: "Federal Register", type: "regulator" },

  // Academic / peer-reviewed
  kusano2025:      { url: "https://www.tandfonline.com/doi/full/10.1080/15389588.2024.2380786", label: "Kusano et al. 2025", type: "academic" },
  rand:            { url: "https://www.rand.org/pubs/research_reports/RR1478.html",             label: "RAND",               type: "academic" },
  iihs:            { url: "https://www.iihs.org/news/detail/first-partial-driving-automation-safeguard-ratings-show-industry-has-work-to-do", label: "IIHS",        type: "academic" },
  chop:            { url: "https://injury.research.chop.edu/blog/posts/self-driving-vehicles-and-child-passenger-safety", label: "Children's Hospital of Philadelphia", type: "academic" },

  // Company / self-reported
  waymoSafety:     { url: "https://waymo.com/safety/impact",                                    label: "Waymo Safety",       type: "company" },
  swissRe:         { url: "https://waymo.com/blog/2024/12/new-swiss-re-study-waymo",            label: "Swiss Re / Waymo Dec 2024", type: "company" },
  teslaSafety:     { url: "https://www.tesla.com/VehicleSafetyReport",                          label: "Vehicle Safety Reports", type: "company" },

  // Crowdsourced
  teslaTracker:    { url: "https://www.teslafsdtracker.com/",                                   label: "teslafsdtracker.com", type: "crowdsource" },

  // Press / analysis
  electrekAmci:    { url: "https://electrek.co/2024/09/26/tesla-full-self-driving-third-party-testing-13-miles-between-interventions/", label: "Electrek / AMCI",   type: "press" },
  electrekMusk:    { url: "https://electrek.co/2025/01/13/elon-musk-misrepresents-data-that-shows-tesla-is-still-years-away-from-unsupervised-self-driving/", label: "Electrek", type: "press" },
  electrekClaims:  { url: "https://electrek.co/2025/04/22/here-are-all-crazy-claims-elon-musk-made-tesla-self-driving-today/", label: "Electrek", type: "press" },
  fortune:         { url: "https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/", label: "Fortune", type: "press" },
  cnbc:            { url: "https://www.cnbc.com/2025/12/08/waymo-paid-rides-robotaxi-tesla.html", label: "CNBC",             type: "press" },
  axios:           { url: "https://www.axios.com/2026/02/24/waymo-robotaxis-now-available-in-10-cities", label: "Axios",     type: "press" },
  npr:             { url: "https://www.npr.org/2025/12/06/nx-s1-5635614/waymo-school-buses-recall", label: "NPR",            type: "press" },
  slashdot:        { url: "https://tech.slashdot.org/story/25/12/27/0645206/waymo-updates-vehicles-to-better-handle-power-outages---but-still-faces-criticism", label: "Slashdot", type: "press" },
  techCrunch:      { url: "https://techcrunch.com/2025/01/30/elon-musk-reveals-elon-musk-was-wrong-about-full-self-driving/", label: "TechCrunch", type: "press" },
  teslarati:       { url: "https://www.teslarati.com/tesla-fsd-successfully-completes-full-coast-to-coast-drive-with-zero-interventions/", label: "Teslarati", type: "press" },
  notATeslaApp:    { url: "https://www.notateslaapp.com/news/3514/tesla-owner-reaches-almost-13000-miles-of-intervention-free-fsd-driving", label: "NotATeslaApp", type: "press" },
  openTools:       { url: "https://opentools.ai/news/nhtsa-investigates-teslas-fsd-mode-for-traffic-safety-violations-what-it-means-for-the-future-of-autonomous-driving", label: "OpenTools", type: "press" },

  // Industry forecasts
  mckinsey:        { url: "https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/our-insights/future-of-autonomous-vehicles-industry", label: "McKinsey", type: "press" },
  spGlobal:        { url: "https://www.spglobal.com/mobility/en/research-analysis/fuel-for-thought-waiting-for-autonomy.html", label: "S&P Global", type: "press" },
  wef:             { url: "https://www.weforum.org/stories/2025/05/autonomous-vehicles-technology-future/", label: "WEF",     type: "press" },

  // Regulatory commentary
  foley:           { url: "https://www.foley.com/insights/publications/2025/11/driving-into-2026-the-state-of-nhtsa-and-the-future-of-vehicle-safety-regulation/", label: "Foley & Lardner", type: "press" },
  covington:       { url: "https://www.cov.com/-/media/files/corporate/publications/2025/02/what-nhtsas-autonomous-vehicle-proposal-means-for-cos.pdf", label: "Covington", type: "press" },
  avia:            { url: "https://www.theavindustry.org/press-release/avia-statement-on-the-introduction-of-self-drive-act", label: "AVIA", type: "press" },
};

// ============================================================
// SITE — top-level metadata.
// ============================================================

export const SITE = {
  lastUpdated: "Feb 2026", // shown in the header. Update whenever data changes.
};

// ============================================================
// PAGES — title + subtitle copy for each top-level tab.
// `id` is the URL/state key. `nav` is the short label shown in the tab bar.
// ============================================================

export const PAGES = [
  {
    id: "home",
    nav: "Progress overview",
    title: "How close are self-driving cars to human-level safety?",
    sub: "Comparing Tesla, Waymo, and human drivers by miles between safety events. The scale is logarithmic — each step right is 10× safer than the one before it.",
  },
  {
    id: "comparison",
    nav: "AV vs Humans",
    title: "AV vs. Human Drivers",
    sub: "Side-by-side performance data using the most rigorous available metrics.",
  },
  {
    id: "waymo",
    nav: "Waymo",
    title: "Waymo Deep Dive",
    sub: "127M driverless miles. Peer-reviewed safety data. The industry's clearest proof.",
  },
  {
    id: "tesla",
    nav: "Tesla FSD",
    title: "Tesla FSD Deep Dive",
    sub: "Rapid version-over-version improvement, but a large gap remains to unsupervised operation.",
  },
  {
    id: "targets",
    nav: "Road to Steeringless",
    title: "Road to Steeringless",
    sub: "What reliability and regulatory milestones must be cleared to remove the steering wheel?",
  },
];

// ============================================================
// COLORS — harmonized palette for the three families on the
// hero/ladder. Each row in NINES_SCALE_DATA picks a shade by
// (category, intensity).
// ============================================================

export const CAT_COLORS = {
  tesla: [
    "oklch(0.62 0.17 40)",   // intensity 0 — v12.5 AMCI
    "oklch(0.68 0.16 50)",   // 1 — v12.5 crowd
    "oklch(0.74 0.15 60)",   // 2 — v13
    "oklch(0.80 0.14 75)",   // 3 — v14
    "oklch(0.72 0.16 55)",   // 4 — Robotaxi
  ],
  waymo: [
    "oklch(0.70 0.14 240)",  // 0 — testing
    "oklch(0.64 0.16 245)",  // 1 — injury
    "oklch(0.56 0.17 250)",  // 2 — serious injury
  ],
  human: [
    "oklch(0.70 0.02 260)",  // 0 — avg
    "oklch(0.55 0.02 260)",  // 1 — fatal
  ],
};

// ============================================================
// NINES_SCALE_DATA — the hero ladder. Every row is one safety
// data point plotted on a log scale of miles between events.
//
// Shape per row:
//   nines       — log10(miles), e.g. miles=1454 → nines≈3.16
//   miles       — miles between events (the canonical number)
//   label       — system name shown in the row (e.g. "Tesla FSD v14")
//   sublabel    — short context line (e.g. "Crowdsourced average")
//   event       — what one tick means: "disengagement" | "crash" |
//                 "injury crash" | "serious injury" | "fatal crash"
//   category    — "tesla" | "waymo" | "human" — picks color family
//   intensity   — index into CAT_COLORS[category]
//   isBaseline  — optional; true for Human Average / Human Fatal
//   source      — SOURCES.x reference or inline { url, label }
// ============================================================

export const NINES_SCALE_DATA = [
  { nines: 1.1, miles: 13,         label: "Tesla FSD v12.5", sublabel: "AMCI independent test",       event: "disengagement",  category: "tesla", intensity: 0, source: SOURCES.electrekAmci },
  { nines: 2.3, miles: 183,        label: "Tesla FSD v12.5", sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", intensity: 1, source: SOURCES.teslaTracker },
  { nines: 2.7, miles: 493,        label: "Tesla FSD v13",   sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", intensity: 2, source: SOURCES.teslaTracker },
  { nines: 3.2, miles: 1454,       label: "Tesla FSD v14",   sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", intensity: 3, source: SOURCES.teslaTracker },
  { nines: 4.5, miles: 29000,      label: "Waymo (testing)", sublabel: "CA DMV disengagements",       event: "disengagement",  category: "waymo", intensity: 0, source: SOURCES.caDmv },
  { nines: 4.8, miles: 57000,      label: "Tesla Robotaxi",  sublabel: "Austin crash rate",           event: "crash",          category: "tesla", intensity: 4, source: SOURCES.fortune },
  { nines: 5.7, miles: 529000,     label: "Human Average",   sublabel: "All police-reported crashes", event: "crash",          category: "human", intensity: 0, isBaseline: true, source: SOURCES.nhtsa },
  { nines: 6.1, miles: 1350000,    label: "Waymo",           sublabel: "Injury crash rate",           event: "injury crash",   category: "waymo", intensity: 1, source: SOURCES.kusano2025 },
  { nines: 7.7, miles: 50000000,   label: "Waymo",           sublabel: "Serious injury crash rate",   event: "serious injury", category: "waymo", intensity: 2, source: SOURCES.waymoSafety },
  { nines: 7.9, miles: 86000000,   label: "Human Fatal",     sublabel: "Fatal crash rate only",       event: "fatal crash",    category: "human", intensity: 1, isBaseline: true, source: SOURCES.nhtsa },
];

// Resolve color from (category, intensity) — done once at module load so the UI
// can read d.color directly. New rows added below will pick up colors automatically.
NINES_SCALE_DATA.forEach(function(d) { d.color = CAT_COLORS[d.category][d.intensity]; });

// ============================================================
// STATS — the four "headline" stat cards on each page.
//
// Shape per card:
//   label    — small uppercase title
//   value    — big number (string — keep formatting like "50M mi" or "1,454")
//   sublabel — one-line context
//   accent   — color for the value
//   source   — SOURCES.x or inline { url, label }
// ============================================================

export const HOME_STATS = [
  { label: "Waymo best",                   value: "50M mi",   sublabel: "per serious injury crash",       accent: "#3b82f6", source: SOURCES.waymoSafety },
  { label: "Tesla FSD v14",                value: "1,454 mi", sublabel: "per critical disengagement",     accent: "#f59e0b", source: SOURCES.teslaTracker },
  { label: "Human baseline",               value: "529K mi",  sublabel: "per police-reported crash",      accent: "#a3a3a3", source: SOURCES.nhtsa },
  { label: "Gap: Tesla to unsupervised",   value: "~460×",    sublabel: "vs. Elluswamy 670K mi target",   accent: "#ef4444", source: SOURCES.electrekMusk },
];

export const WAYMO_STATS = [
  { label: "Driverless miles",             value: "127M+",  sublabel: "Through Sep 2025",   accent: "#3b82f6", source: SOURCES.waymoSafety },
  { label: "Weekly rides",                 value: "450K+",  sublabel: "Across 10 cities",   accent: "#60a5fa", source: SOURCES.cnbc },
  { label: "Safety vs humans",             value: "↓90%",   sublabel: "Fewer serious injuries", accent: "#22c55e", source: SOURCES.kusano2025 },
  { label: "Cities",                       value: "10",     sublabel: "Feb 2026",           accent: "#8b5cf6", source: SOURCES.axios },
];

export const TESLA_STATS = [
  { label: "FSD v14 best",                 value: "1,454",  sublabel: "Miles / critical disengagement", accent: "#fbbf24", source: SOURCES.teslaTracker },
  { label: "Improvement",                  value: "8×",     sublabel: "v12.5 to v14 in 14 months",      accent: "#f59e0b", source: SOURCES.teslaTracker },
  { label: "Robotaxi crash rate",          value: "1/57K",  sublabel: "Miles per crash (Austin)",       accent: "#ef4444", source: SOURCES.fortune },
  { label: "Gap to unsupervised",          value: "~460×",  sublabel: "vs. Elluswamy 670K target",      accent: "#dc2626", source: SOURCES.electrekMusk },
];

// ============================================================
// CRASH_RATES — table on the AV vs Humans page.
//
// All values are miles between events. Strings (not numbers) so we can show
// approximate values like "~5M" or "0 fatalities*".
//
// goodFlag: true = outperforming human average (green), false = worse (amber/red),
//           null = no comparable data ("—")
// ============================================================

export const CRASH_RATES = [
  { metric: "Police-reported crash", human: "529K", waymo: "~476K",         tesla: "~57K",     waymoGood: false, teslaGood: false, source: SOURCES.nhtsa },
  { metric: "Injury crash",          human: "252K", waymo: "1.35M",         tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.kusano2025 },
  { metric: "Serious injury crash",  human: "~5M",  waymo: "50M",           tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.waymoSafety },
  { metric: "Fatal crash",           human: "86M",  waymo: "0 fatalities*", tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.nhtsa },
];

// ============================================================
// WAYMO_CRASH_REDUCTION — by severity, for the Waymo & Comparison pages.
// Numbers are incidents per million miles.
// ============================================================

export const WAYMO_CRASH_REDUCTION = [
  { category: "Serious injury+",         waymo: 0.02, human: 0.23, reduction: 90 },
  { category: "All injury",              waymo: 0.74, human: 3.97, reduction: 81 },
  { category: "Airbag deploy",           waymo: 0.26, human: 1.44, reduction: 82 },
  { category: "Pedestrian injury",       waymo: 0.05, human: 0.59, reduction: 92 },
  { category: "Cyclist injury",          waymo: 0.03, human: 0.18, reduction: 83 },
  { category: "Property dmg (Swiss Re)", waymo: 0.36, human: 3.08, reduction: 88 },
];

// ============================================================
// WAYMO_MILES_TIMELINE — cumulative driverless miles by year (in millions).
// ============================================================

export const WAYMO_MILES_TIMELINE = [
  { period: "2020",     miles: 6 },
  { period: "2021",     miles: 10 },
  { period: "2022",     miles: 20 },
  { period: "2023",     miles: 35 },
  { period: "2024",     miles: 60 },
  { period: "Sep 2025", miles: 127 },
];

// ============================================================
// WAYMO_INCIDENTS — known limitations and incidents.
//
// severity: "high" | "medium" | "info"  (drives the left border color)
// source: optional — null for "Ongoing" entries that don't have a single citation
// ============================================================

export const WAYMO_INCIDENTS = [
  { date: "Oct 2025", text: "NHTSA investigation: 19–20 school bus passing incidents in Austin", severity: "high",   source: SOURCES.npr },
  { date: "Dec 2025", text: "Voluntary recall of 3,067 vehicles for school bus detection fix",   severity: "medium", source: SOURCES.npr },
  { date: "Dec 2025", text: "SF power outage caused some vehicles to freeze in intersections",   severity: "medium", source: SOURCES.slashdot },
  { date: "Ongoing",  text: "Operates only in pre-mapped geofenced areas; no snow capability",    severity: "info",   source: null },
  { date: "Ongoing",  text: "Remote operators assist with edge cases — not fully independent",    severity: "info",   source: null },
];

// ============================================================
// TESLA_VERSION_PROGRESS — version-over-version improvement bars.
// Crowdsourced, biased optimistic — see note in dashboard.
// ============================================================

export const TESLA_VERSION_PROGRESS = [
  { version: "v11",   date: "2023 Q1", milesPerIntervention: 5,    nines: 0.7 },
  { version: "v12.3", date: "2024 Q2", milesPerIntervention: 80,   nines: 1.9 },
  { version: "v12.5", date: "2024 Q3", milesPerIntervention: 183,  nines: 2.3 },
  { version: "v13",   date: "2025 Q1", milesPerIntervention: 493,  nines: 2.7 },
  { version: "v13.2", date: "2025 Q2", milesPerIntervention: 700,  nines: 2.8 },
  { version: "v14",   date: "2025 Q4", milesPerIntervention: 1454, nines: 3.2 },
];

// ============================================================
// TESLA_FSD_SUPERVISED / TESLA_ROBOTAXI — side-by-side fact lists.
//
// Each row is { label, value, source? }. source is optional — many Robotaxi
// rows are just facts derived from the same Fortune analysis (linked once at
// the bottom of the card in the dashboard).
// ============================================================

export const TESLA_FSD_SUPERVISED = [
  { label: "Best crowdsourced rate",   value: "1,454 mi/int",    source: SOURCES.teslaTracker },
  { label: "Independent test (AMCI)",  value: "13 mi/int",       source: SOURCES.electrekAmci },
  { label: "Coast-to-coast record",    value: "2,732 mi, 0 int", source: SOURCES.teslarati },
  { label: "Longest streak",           value: "12,961 mi",       source: SOURCES.notATeslaApp },
  { label: "NHTSA investigation",      value: "2.88M vehicles",  source: SOURCES.openTools },
  { label: "Requires",                 value: "Human driver",    source: null },
];

export const TESLA_ROBOTAXI = [
  { label: "Launched",          value: "June 2025" },
  { label: "Unsupervised since", value: "Jan 2026" },
  { label: "Fleet size",        value: "~31 vehicles" },
  { label: "Miles driven",      value: "~800,000" },
  { label: "Crashes",           value: "14" },
  { label: "Crash rate",        value: "1 per ~57K mi" },
  { label: "vs. human avg",     value: "~9x worse" },
  { label: "vs. Tesla w/o AP",  value: "~4x worse" },
];
// Robotaxi rows above all derive from the same Fortune analysis:
export const TESLA_ROBOTAXI_SOURCE = SOURCES.fortune;

// Tesla version-projection text (shown as an aside under the version chart).
// If the per-version improvement rate changes, edit the multiplier and the
// projected values together.
export const TESLA_PROJECTION = {
  multiplier: "~2.7×",
  projections: "v15 → ~3,900 mi · v16 → ~10,500 mi · v17 → ~28,400 mi · v18 → ~76,700 mi · v19 → ~207,000 mi · v20 → ~560,000 mi",
  caveat: "~6 more versions (~3 years) to reach the unsupervised threshold — if the rate holds. Historically, improvement rates slow at higher reliability.",
};

// ============================================================
// MUSK_PREDICTIONS — track record of public claims vs. what shipped.
// Each entry is { year, claim, result, source }.
// ============================================================

export const MUSK_PREDICTIONS = [
  { year: "2015", claim: "Full autonomy by 2018",                  result: "Not achieved",                          source: SOURCES.electrekMusk },
  { year: "2016", claim: "LA to NY autonomous by end of 2017",     result: "Achieved Dec 2025 — 8 years late",      source: SOURCES.teslarati },
  { year: "2019", claim: "1 million robotaxis by 2020",            result: "31 in Austin as of Feb 2026",           source: SOURCES.fortune },
  { year: "2022", claim: "Robotaxi production in 2024",            result: "Delayed to 2025-2026",                  source: SOURCES.techCrunch },
  { year: "2025", claim: "Millions of robotaxis in H2 2025",       result: "~31 operating",                         source: SOURCES.electrekClaims },
  { year: "2025", claim: "HW3 cars can do unsupervised FSD",       result: "Admitted upgrade needed",               source: SOURCES.techCrunch },
];

// ============================================================
// TARGET_THRESHOLDS — Road to Steeringless reliability targets.
//
// nines = log10(miles per event). 5.7 = human average crash rate.
// description is the rationale; color is the left-border accent.
// ============================================================

export const TARGET_THRESHOLDS = [
  { nines: 5.7, label: "Match human average",   description: "System matches avg human crash rate",                                            color: "#fbbf24" },
  { nines: 6.5, label: "Regulatory confidence", description: "~5x better than humans — likely threshold for unsupervised permits",             color: "#22c55e" },
  { nines: 7.0, label: "Remove steering wheel", description: "~20x better than humans — plausible threshold for steeringless mass-market",     color: "#3b82f6" },
  { nines: 7.5, label: "Child safety threshold", description: "~50x better than humans — trust a child alone in the vehicle",                   color: "#a855f7" },
];

// ============================================================
// REGULATORY_BARRIERS — non-technical blockers on the Steeringless page.
//
// status: "achieved" | "partial" | "blocked"  (drives the chip color)
// ============================================================

export const REGULATORY_BARRIERS = [
  { title: "Federal exemption cap", detail: "Max 2,500 non-compliant vehicles/year. No new legislation in a decade.",                        status: "blocked",  source: SOURCES.foley },
  { title: "FMVSS updates",         detail: "Crashworthiness updated (2022). Transmission, windshield, lighting still in progress.",        status: "partial",  source: SOURCES.fedReg },
  { title: "AV STEP program",       detail: "Voluntary safety-case framework proposed Jan 2025. No numeric thresholds. Not finalized.",      status: "partial",  source: SOURCES.covington },
  { title: "SELF DRIVE Act",        detail: "Would raise/eliminate 2,500 cap. Failed for ~10 years. New draft late 2025.",                   status: "blocked",  source: SOURCES.avia },
  { title: "Zoox exemption",        detail: "First NHTSA exemption for steeringless American AV (Aug 2025). Only 64 demo vehicles.",         status: "achieved", source: SOURCES.nhtsaPressZoox },
  { title: "NHTSA staffing",        detail: "Agency cut ~25% (780 to 575 employees). Reduced rulemaking capacity.",                          status: "blocked",  source: SOURCES.foley },
];

// ============================================================
// EXPERT_TIMELINES — consensus from McKinsey/S&P/WEF/BCG on rollout dates.
//
// year is a string so it can be "Now", "~2028", "2040s–60s", etc.
// color is the left-border + year-text accent.
// ============================================================

export const EXPERT_TIMELINES = [
  { year: "Now",        event: "L4 robotaxis in select cities (Waymo)",          status: "✅ Happening",          color: "#22c55e", source: SOURCES.axios },
  { year: "~2028",      event: "L4 robotaxis in 20+ cities globally",            status: "On track",              color: "#60a5fa", source: SOURCES.mckinsey },
  { year: "~2030",      event: "Large-scale L4 robotaxi rollout",                status: "Consensus",             color: "#60a5fa", source: SOURCES.mckinsey },
  { year: "~2032",      event: "L4 in privately owned vehicles (limited)",       status: "Optimistic",            color: "#fbbf24", source: SOURCES.mckinsey },
  { year: "~2035",      event: "<6% of new vehicles sold have L4",               status: "Forecast",              color: "#fbbf24", source: SOURCES.mckinsey },
  { year: "2035+",      event: "Consumer steeringless vehicles (mass market)",   status: "'Unlikely by 2035'",    color: "#ef4444", source: SOURCES.spGlobal },
  { year: "2040s–60s",  event: "Most safety/mobility benefits materialize",      status: "Long-range",            color: "#ef4444", source: SOURCES.wef },
];

// ============================================================
// CHILD_SAFETY — single-paragraph stat callout on the Steeringless page.
//
// This one is mostly prose, not a structured row, but the numbers are
// canonical so they live here.
// ============================================================

export const CHILD_SAFETY = {
  parentsComfortableDriving: "63%",
  parentsLetChildRideAlone: "21%",
  impliedCrashThreshold: "roughly 1 crash per 10M+ miles",
  waymoSeriousInjuryRate: "about one event per 50 million miles",
  source: SOURCES.chop,
};

// ============================================================
// FOOTER_SOURCES — short list of credits at the bottom of every page.
// ============================================================

export const FOOTER_SOURCES = [
  "NHTSA", "CA DMV", "Waymo Safety Impact", "Swiss Re", "Kusano et al. 2025",
  "teslafsdtracker.com", "AMCI Testing", "Fortune", "Electrek", "McKinsey", "RAND", "CHOP",
];
