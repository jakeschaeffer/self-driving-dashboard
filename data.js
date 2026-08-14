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

  // 2026 updates (Jul 2026 research pass)
  alphabetQ1:      { url: "https://www.cnbc.com/2026/04/29/alphabet-googl-q1-2026-earnings.html", label: "Alphabet Q1 2026", type: "company" },
  electrekWaymo1400:{ url: "https://electrek.co/2026/05/13/waymo-expands-coverage-1400-square-miles-11-cities/", label: "Electrek", type: "press" },
  electrekFlood:   { url: "https://electrek.co/2026/05/12/waymo-recalls-3791-robotaxis-flooded-road-ota-software-fix/", label: "Electrek", type: "press" },
  tcWorkZone:      { url: "https://techcrunch.com/2026/06/18/waymo-recalls-nearly-4000-robotaxis-to-stop-them-driving-into-highway-construction-zones/", label: "TechCrunch", type: "press" },
  foxSantaMonica:  { url: "https://www.foxbusiness.com/lifestyle/waymo-recalls-massive-autonomous-fleet-incident-flags-major-safety-issue", label: "Fox Business", type: "press" },
  cnbcTexasFleet:  { url: "https://www.cnbc.com/2026/05/28/tesla-robotaxi-fleet-texas-one-tenth-size-of-waymos-filings-reveal.html", label: "CNBC", type: "press" },
  electrekUnredact:{ url: "https://electrek.co/2026/05/15/tesla-unredacts-robotaxi-crash-narratives-nhtsa/", label: "Electrek", type: "press" },
  engadgetMiami:   { url: "https://www.engadget.com/2207974/tesla-expands-robotaxi-service-to-small-section-of-miami/", label: "Engadget", type: "press" },
  techtimesAustin: { url: "https://www.techtimes.com/articles/317890/20260605/tesla-robotaxi-covers-entire-austin-metro-245-square-miles-about-20-driverless-cars.htm", label: "TechTimes", type: "press" },
  nhtsaSgo:        { url: "https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting", label: "NHTSA SGO", type: "regulator" },
  baiduIr:         { url: "https://ir.baidu.com/news-releases/news-release-details/baidu-announces-first-quarter-2026-results/", label: "Baidu Q1 2026", type: "company" },
  cnevApollo:      { url: "https://cnevpost.com/2026/02/27/baidu-apollo-go-robotaxi-300000-weekly-rides-expands-to-south-korea/", label: "CNEVPost", type: "press" },
  electrekZoox:    { url: "https://electrek.co/2026/03/24/zoox-expands-current-service-area-and-is-bringing-its-purpose-built-robotaxi-to-two-new-cities/", label: "Electrek", type: "press" },
  ponyIr:          { url: "https://www.sec.gov/Archives/edgar/data/0001969302/000110465926066016/tm2615604d1_ex99-1.pdf", label: "Pony.ai Q4 2025", type: "company" },
  caixinWeRide:    { url: "https://www.caixinglobal.com/2026-05-28/china-robotaxi-firms-expand-fleets-despite-regulatory-pause-102448697.html", label: "Caixin", type: "press" },
  auroraIr:        { url: "https://ir.aurora.tech/news-events/press-releases/detail/128/aurora-expands-driverless-trucking-service-from-fort-worth-to-el-paso", label: "Aurora", type: "company" },
  tcNuro:          { url: "https://techcrunch.com/2026/05/05/nuro-receives-driverless-testing-permit-ahead-of-uber-robotaxi-service-launch/", label: "TechCrunch", type: "press" },
  tcWayve:         { url: "https://techcrunch.com/2026/03/12/uber-wayve-and-nissan-plan-to-launch-a-robotaxi-service-in-tokyo-this-year/", label: "TechCrunch", type: "press" },
  insideEvsMoia:   { url: "https://insideevs.com/news/792355/volkswagen-id-buzz-robotaxi-testing-los-angeles/", label: "InsideEVs", type: "press" },
  tcMayMobility:   { url: "https://techcrunch.com/2025/09/10/lyfts-modest-robotaxi-launch-highlights-growing-gap-with-uber-and-waymo/", label: "TechCrunch", type: "press" },
  tcMotional:      { url: "https://techcrunch.com/2026/01/11/motional-puts-ai-at-center-of-robotaxi-reboot-as-it-targets-2026-for-driverless-service/", label: "TechCrunch", type: "press" },
  scdCruise:       { url: "https://www.smartcitiesdive.com/news/general-motors-shuts-cruise-robotaxi-unit-mary-barra/735205/", label: "Smart Cities Dive", type: "press" },

  // ---- Aug 2026 research pass — Waymo ----
  waymoSafetyJun26:{ url: "https://waymo.com/blog/shorts/safetydata-june26/", label: "Waymo Jun 2026 safety update", type: "company" },
  waymoUpdates:    { url: "https://waymo.com/updates/", label: "Waymo Updates", type: "company" },
  waymoNewRoCities:{ url: "https://waymo.com/blog/shorts/ro-den-lv-sd-tmpa/", label: "Waymo Jul 2026", type: "company" },
  alphabetQ2:      { url: "https://9to5google.com/2026/07/22/alphabet-q2-2026-earnings/", label: "Alphabet Q2 2026", type: "company" },
  iihsWaymo:       { url: "https://www.iihs.org/news/detail/waymos-driverless-cars-crash-less-often-than-people", label: "IIHS Jul 2026", type: "academic" },
  electrekIihs:    { url: "https://electrek.co/2026/07/25/waymo-is-2-3-safer-than-a-human-driver-says-iihs-with-some-caveats/", label: "Electrek / IIHS", type: "press" },
  tcWaymoRides:    { url: "https://techcrunch.com/2026/03/27/waymo-skyrocketing-ridership-in-one-chart/", label: "TechCrunch", type: "press" },
  govtechFleet:    { url: "https://www.govtech.com/transportation/waymo-files-software-recall-on-nearly-3-800-robotaxis", label: "GovTech / NHTSA filing", type: "press" },
  nbcdfwDallas:    { url: "https://www.nbcdfw.com/news/local/pedestrian-killed-suv-crash-waymo-dallas/4060058/", label: "NBC DFW", type: "press" },
  templetonDallas: { url: "https://www.forbes.com/sites/bradtempleton/2026/08/10/waymo-fatality-likely-not-at-fault-here-are-new-details-and-what-ifs/", label: "Forbes / Templeton", type: "press" },
  tcFreewayReturn: { url: "https://techcrunch.com/2026/07/29/waymo-robotaxis-are-starting-to-return-to-freeways/", label: "TechCrunch", type: "press" },
  ntsbSchoolBus:   { url: "https://www.ntsb.gov/investigations/Pages/HWY26FH008.aspx", label: "NTSB HWY26FH008", type: "regulator" },

  // ---- Aug 2026 research pass — Tesla ----
  teslaFsdSafety:  { url: "https://www.tesla.com/fsd/safety", label: "Tesla FSD Safety Report", type: "company" },
  teslaQ2Deck:     { url: "https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q2-2026-Update.pdf", label: "Tesla Q2 2026 update", type: "company" },
  driveTeslaFsd:   { url: "https://driveteslacanada.ca/news/tesla-releases-new-fsd-safety-stats-after-crossing-8-2-billion-miles-driven/", label: "Drive Tesla", type: "press" },
  driveTeslaApEnd: { url: "https://driveteslacanada.ca/news/tesla-autopilot-comes-to-an-end-in-north-america/", label: "Drive Tesla", type: "press" },
  teslaratiApQ3:   { url: "https://www.teslarati.com/tesla-new-safety-report-autopilot-nine-times-safer-humans-q3-2025/", label: "Teslarati", type: "press" },
  koopmanFsd:      { url: "https://philkoopman.substack.com/p/new-tesla-fsd-safety-data", label: "Koopman (CMU)", type: "press" },
  nhtsaEa26002:    { url: "https://static.nhtsa.gov/odi/inv/2026/INOA-EA26002-10023.pdf", label: "NHTSA EA26002", type: "regulator" },
  nhtsaPe25012:    { url: "https://static.nhtsa.gov/odi/inv/2025/INOA-PE25012-19171.pdf", label: "NHTSA PE25012", type: "regulator" },
  electrekSgo:     { url: "https://electrek.co/2026/07/22/tesla-adas-crashes-record-207-one-month/", label: "Electrek / NHTSA SGO", type: "press" },
  gljTracker:      { url: "https://finance.yahoo.com/news/teslas-fsd-safety-metrics-sharply-023107020.html", label: "GLJ via teslafsdtracker", type: "crowdsource" },
  ntaRelease:      { url: "https://www.notateslaapp.com/software-updates/version/2026.21.6/release-notes", label: "NotATeslaApp release notes", type: "press" },
  ntaV15:          { url: "https://www.notateslaapp.com/news/4484/tesla-robotaxis-are-already-running-fsd-v15", label: "NotATeslaApp", type: "press" },
  nta380k:         { url: "https://www.notateslaapp.com/news/4486/tesla-robotaxi-hits-380k-unsupervised-miles-names-next-markets", label: "NotATeslaApp", type: "press" },
  bloombergFleet:  { url: "https://www.bloomberg.com/news/features/2026-06-10/tesla-robotaxi-fleet-totals-just-59-vehicles-despite-musk-promises", label: "Bloomberg", type: "press" },
  electrekCpuc:    { url: "https://electrek.co/2026/03/25/california-regulator-confirms-tesla-not-operating-autonomous-vehicle-service/", label: "Electrek / CPUC", type: "press" },
  electrekRtFlat:  { url: "https://electrek.co/2026/07/22/tesla-robotaxi-growth-flat-own-chart-q2-2026/", label: "Electrek", type: "press" },
};

// ============================================================
// SITE — top-level metadata.
// ============================================================

export const SITE = {
  lastUpdated: "Jul 2026", // shown in the header. Update whenever data changes.
};

// ============================================================
// PAGES — title + subtitle copy for each top-level tab.
// `id` is the URL/state key. `nav` is the short label shown in the tab bar.
// ============================================================

export const PAGES = [
  {
    id: "home",
    nav: "Overview",
    title: "How close are self-driving cars to human-level safety?",
    sub: "Tesla, Waymo, and human drivers by miles between safety events. Log scale — each step right is 10× safer.",
  },
  {
    id: "waymo",
    nav: "Waymo",
    title: "Waymo",
    sub: "220.6M rider-only miles through Mar 2026, across 11 commercial metros. Company safety data alongside the independent IIHS study — and one fatality.",
  },
  {
    id: "tesla",
    nav: "Tesla FSD",
    title: "Tesla FSD",
    sub: "Fast improvement through 2025, but the crowdsourced trend reversed in 2026. A large gap remains to unsupervised.",
  },
  {
    id: "others",
    nav: "Others",
    title: "Other Players",
    sub: "Robotaxis and driverless trucking beyond Waymo and Tesla.",
  },
  {
    id: "targets",
    nav: "Road to Steeringless",
    title: "Road to Steeringless",
    sub: "What must be cleared to remove the steering wheel?",
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
  // 50M is Waymo's own serious-injury figure as of early 2026. The Jun 2026 update
  // publishes 0.01 vs 0.23 crashes per million miles (94% fewer) — one significant
  // figure, too rounded to derive a precise miles-per-event number, so the number
  // stands and only the as-of date moves. See the Note on the Waymo page.
  { nines: 7.7, miles: 50000000,   label: "Waymo",           sublabel: "Serious injury crash rate (as of early 2026)", event: "serious injury", category: "waymo", intensity: 2, source: SOURCES.waymoSafety },
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
  { label: "Driverless miles",             value: "220.6M", sublabel: "Rider-only, through Mar 2026",  accent: "#3b82f6", source: SOURCES.waymoSafety },
  { label: "Weekly rides",                 value: "~500K",  sublabel: "Flat since Q1 2026; 1M/week is the year-end target", accent: "#60a5fa", source: SOURCES.tcWaymoRides },
  { label: "IIHS (independent)",           value: "↓68%",   sublabel: "Fewer police-reportable crashes per mile, 2021–24", accent: "#22c55e", source: SOURCES.iihsWaymo },
  { label: "Waymo's own claim",            value: "↓94%",   sublabel: "Fewer serious-injury crashes — self-reported",   accent: "#4ade80", source: SOURCES.waymoSafetyJun26 },
  { label: "Cities",                       value: "11",     sublabel: "Commercial metros + 4 driverless, not yet public", accent: "#8b5cf6", source: SOURCES.waymoUpdates },
  { label: "Fleet",                        value: "~3.8–4K", sublabel: "From NHTSA recall populations — no official count", accent: "#a78bfa", source: SOURCES.govtechFleet },
];

export const TESLA_STATS = [
  { label: "FSD v14 best",                 value: "1,454",  sublabel: "Miles / critical disengagement · crowdsourced", accent: "#fbbf24", source: SOURCES.teslaTracker },
  { label: "Cumulative FSD miles",         value: "13.38B", sublabel: "Tesla's live counter, read 14 Aug 2026",   accent: "#f59e0b", source: SOURCES.teslaFsdSafety },
  { label: "Robotaxi fleet",               value: "~59",    sublabel: "Total incl. Bay Area; 42 registered in Texas", accent: "#ef4444", source: SOURCES.bloombergFleet },
  { label: "Gap to unsupervised",          value: "~460×",  sublabel: "1,454 mi vs. Elluswamy's 670K mi target", accent: "#dc2626", source: SOURCES.electrekMusk },
];

// ============================================================
// CRASH_RATES — table on the AV vs Humans page.
//
// All values are miles between events. Strings (not numbers) so we can show
// approximate values like "~5M" or "1 fatality*".
//
// goodFlag: true = outperforming human average (green), false = worse (amber/red),
//           null = no comparable data ("—")
// ============================================================

export const CRASH_RATES = [
  { metric: "Police-reported crash", human: "529K", waymo: "~476K",         tesla: "~57K",     waymoGood: false, teslaGood: false, source: SOURCES.nhtsa },
  { metric: "Injury crash",          human: "252K", waymo: "1.35M",         tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.kusano2025 },
  { metric: "Serious injury crash",  human: "~5M",  waymo: "50M",           tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.waymoSafety },
  // One fatality in 220.6M rider-only miles (Dallas, 7 Aug 2026). Still a lower rate
  // than the 86M-mile human fatal-crash baseline, hence waymoGood: true — but the
  // footnote under the table carries the circumstances, and it must stay there.
  { metric: "Fatal crash",           human: "86M",  waymo: "1 fatality*",   tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.nhtsa },
];

// ============================================================
// WAYMO_CRASH_REDUCTION — by severity, for the Waymo & Comparison pages.
// Numbers are incidents per million miles (IPMM).
//
// waymo/human are null where the publisher gives a reduction percentage but no
// underlying rate — the card then shows the reduction alone rather than inventing
// a denominator. Waymo rows are self-reported over 220.6M rider-only miles through
// Mar 2026; the Swiss Re row is a separate property-damage study from Dec 2024.
// ============================================================

export const WAYMO_CRASH_REDUCTION = [
  { category: "Serious injury+",         waymo: 0.01, human: 0.23, reduction: 94, source: SOURCES.waymoSafetyJun26 },
  { category: "All injury",              waymo: 0.71, human: 3.91, reduction: 82, source: SOURCES.waymoSafetyJun26 },
  { category: "Airbag deploy",           waymo: 0.30, human: 1.68, reduction: 82, source: SOURCES.waymoSafetyJun26 },
  { category: "Pedestrian injury",       waymo: null, human: null, reduction: 93, source: SOURCES.waymoSafetyJun26 },
  { category: "Cyclist injury",          waymo: null, human: null, reduction: 84, source: SOURCES.waymoSafetyJun26 },
  { category: "Motorcyclist injury",     waymo: null, human: null, reduction: 84, source: SOURCES.waymoSafetyJun26 },
  { category: "Property dmg (Swiss Re)", waymo: 0.36, human: 3.08, reduction: 88, source: SOURCES.swissRe },
];

// ============================================================
// WAYMO_IIHS_STUDY — the independent IIHS analysis (Eric Teoh, published
// 2026-07-23). Highest-quality non-company evidence the site carries, so it gets
// its own shape rather than being folded into WAYMO_CRASH_REDUCTION (different
// mileage base, different period, different crash definition).
// ============================================================

export const WAYMO_IIHS_STUDY = {
  headline: [
    { label: "Police-reportable crashes", reduction: 68 },
    { label: "Single-vehicle crashes",    reduction: 85 },
    { label: "Injury crashes",            reduction: 81 },
  ],
  rate: { waymo: "1.28", human: "4.06", unit: "police-reportable crashes per million vehicle miles travelled" },
  byCity: [
    { city: "Phoenix",       change: -76 },
    { city: "Los Angeles",   change: -71 },
    { city: "San Francisco", change: -35 },
    { city: "Austin",        change: 4, note: "small sample" },
  ],
  basis: "~50M Waymo driverless miles (2021–2024) against ~222B human miles. 89 police-reportable Waymo crashes, 64 of them in driverless mode; about 25% of reported crashes were discarded in data cleaning.",
  caveats: "Austin is the one city where Waymo came out worse, on a small sample. Waymo also drives mostly on low-speed streets (50% of its crashes are under 25 mph, vs. 8% for humans), close to half its miles carry no occupant, and it shows higher crash rates in the dark. IIHS adds that US AV crash-reporting infrastructure is not adequate for large-scale monitoring.",
  source: SOURCES.iihsWaymo,
  caveatSource: SOURCES.electrekIihs,
};

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
  { period: "Mar 2026", miles: 221 },
];

// ============================================================
// WAYMO_INCIDENTS — known limitations and incidents. Newest first.
//
// severity: "high" | "medium" | "info"  (drives the left border color)
// source: optional — null for "Ongoing" entries that don't have a single citation
// ============================================================

export const WAYMO_INCIDENTS = [
  { date: "Aug 2026", text: "First fatality involving a Waymo: a pedestrian struck by an SUV in Dallas was thrown into oncoming lanes and then contacted at ~5 mph by an unoccupied Waymo, and died. Police preliminary findings and independent analysis indicate Waymo was likely not at fault.", severity: "high", source: SOURCES.nbcdfwDallas },
  { date: "Jul 2026", text: "Freeway rides resumed in Phoenix on Jul 29, after all freeway operations were suspended on May 19 following 13 incidents of driving into closed work zones; other cities to follow", severity: "medium", source: SOURCES.tcFreewayReturn },
  { date: "Jun 2026", text: "Recall of ~4,000 vehicles after 13 instances of entering closed highway work zones", severity: "medium", source: SOURCES.tcWorkZone },
  { date: "May 2026", text: "Full-fleet recall (3,791 vehicles) after a San Antonio flooded-road incident — OTA fix", severity: "medium", source: SOURCES.electrekFlood },
  { date: "Mar 2026", text: "NTSB opened an investigation into Waymo vehicles passing stopped school buses in at least two states; Austin ISD logged 19 instances in the 2025–26 school year", severity: "high", source: SOURCES.ntsbSchoolBus },
  { date: "Jan 2026", text: "NHTSA probe (PE26001): robotaxi struck a child near a Santa Monica school", severity: "high",   source: SOURCES.foxSantaMonica },
  { date: "Dec 2025", text: "SF power outage caused some vehicles to freeze in intersections",   severity: "medium", source: SOURCES.slashdot },
  { date: "Oct 2025", text: "NHTSA investigation into ~20 school bus passing incidents in Austin; 3,067-vehicle recall followed", severity: "high", source: SOURCES.npr },
  { date: "Ongoing",  text: "Operates only in pre-mapped geofenced areas; no snow capability",    severity: "info",   source: null },
  { date: "Ongoing",  text: "Remote operators assist with edge cases — not fully independent",    severity: "info",   source: null },
];

// ============================================================
// TESLA_VERSION_PROGRESS — version-over-version improvement bars.
// Crowdsourced, biased optimistic — see note in dashboard.
//
// `metric` is optional. The v14.1 and v14.2 rows are the only ones the source
// explicitly describes as *city* miles per critical disengagement (GLJ Research
// citing teslafsdtracker.com). That may not be the same measure as the earlier
// rows' tracker averages, so they are labelled rather than merged — do not read
// 1,454 → 4,109 → 809 as a single clean series.
// ============================================================

export const TESLA_VERSION_PROGRESS = [
  { version: "v11",   date: "2023 Q1", milesPerIntervention: 5,    nines: 0.7 },
  { version: "v12.3", date: "2024 Q2", milesPerIntervention: 80,   nines: 1.9 },
  { version: "v12.5", date: "2024 Q3", milesPerIntervention: 183,  nines: 2.3 },
  { version: "v13",   date: "2025 Q1", milesPerIntervention: 493,  nines: 2.7 },
  { version: "v13.2", date: "2025 Q2", milesPerIntervention: 700,  nines: 2.8 },
  { version: "v14",   date: "2025 Q4", milesPerIntervention: 1454, nines: 3.2 },
  { version: "v14.1", date: "Oct 2025", milesPerIntervention: 4109, nines: 3.6, metric: "city miles", source: SOURCES.gljTracker },
  { version: "v14.2", date: "Mar 2026", milesPerIntervention: 809,  nines: 2.9, metric: "city miles", source: SOURCES.gljTracker },
];

// ============================================================
// TESLA_FSD_SUPERVISED / TESLA_ROBOTAXI — side-by-side fact lists.
//
// Each row is { label, value, source? }. source is optional — many Robotaxi
// rows are just facts derived from the same Fortune analysis (linked once at
// the bottom of the card in the dashboard).
// ============================================================

export const TESLA_FSD_SUPERVISED = [
  { label: "Shipping build",           value: "v14.3.7 (HW4)",   source: SOURCES.ntaRelease },
  { label: "HW3 build",                value: "v14.1 Lite",      source: SOURCES.ntaRelease },
  { label: "Robotaxi build",           value: "early v15",       source: SOURCES.ntaV15 },
  { label: "Released",                 value: "2026.21.6 · 9 Aug 2026", source: SOURCES.ntaRelease },
  { label: "Cumulative FSD miles",     value: "13.38B",          source: SOURCES.teslaFsdSafety },
  { label: "Paid FSD customers",       value: "1.48M (+56% YoY)", source: SOURCES.teslaQ2Deck },
  { label: "Attach rate, new NA cars", value: ">55%",            source: SOURCES.teslaQ2Deck },
  { label: "Best crowdsourced rate",   value: "1,454 mi/int",    source: SOURCES.teslaTracker },
  { label: "Independent test (AMCI)",  value: "13 mi/int",       source: SOURCES.electrekAmci },
  { label: "Coast-to-coast record",    value: "2,732 mi, 0 int", source: SOURCES.teslarati },
  { label: "Longest streak",           value: "12,961 mi",       source: SOURCES.notATeslaApp },
  { label: "Engineering analysis",     value: "3,203,754 vehicles · 9 crashes, 1 fatality", source: SOURCES.nhtsaEa26002 },
  { label: "Preliminary evaluation",   value: "2,882,566 vehicles · 58 incidents, 23 injuries", source: SOURCES.nhtsaPe25012 },
  { label: "Requires",                 value: "Human driver",    source: null },
];

export const TESLA_ROBOTAXI = [
  { label: "Launched",             value: "June 2025" },
  { label: "Unsupervised since",   value: "Jan 2026 (Austin)" },
  { label: "Metros live",          value: "7",                    source: SOURCES.teslaQ2Deck },
  { label: "Ramping unsupervised", value: "Austin · Dallas · Houston · Miami · Orlando · Tampa", source: SOURCES.teslaQ2Deck },
  { label: "SF Bay Area",          value: "Human safety driver — limousine permit only, no driverless permit applied for", source: SOURCES.electrekCpuc },
  { label: "Total fleet",          value: "~59 (Jun 2026)",       source: SOURCES.bloombergFleet },
  { label: "Fleet in Texas",       value: "~42 vs Waymo 577",     source: SOURCES.cnbcTexasFleet },
  { label: "Austin geofence",      value: "245 sq mi, ~20 cars",  source: SOURCES.techtimesAustin },
  { label: "Paid miles",           value: "~2.4M through Jun 2026 · ~0% growth in Q2", source: SOURCES.electrekRtFlat },
  { label: "Tesla claim",          value: ">380K fully unsupervised mi, “0 notable incidents” — unverified", source: SOURCES.nta380k },
  { label: "NHTSA incidents",      value: "17 (Jul 25–Mar 26)",   source: SOURCES.electrekUnredact },
  { label: "Crash rate (Feb 26)",  value: "1 per ~57K mi",        source: SOURCES.fortune },
  { label: "vs. human avg",        value: "~9x worse",            source: SOURCES.fortune },
];

// ============================================================
// TESLA_SAFETY_TENSION — the same system, two framings, side by side.
// Tesla's self-reported collision rate is the best case it makes for FSD; the
// NHTSA Standing General Order count is the worst. Neither belongs on the page
// without the other, and each carries the other side's rebuttal inline.
// ============================================================

export const TESLA_SAFETY_TENSION = [
  {
    title: "Tesla's own FSD safety report",
    kind: "Company self-reported",
    accent: "#fbbf24",
    rows: [
      { label: "FSD (Supervised) engaged",   value: "1 major collision / 5,300,676 mi" },
      { label: "Manual, active safety on",   value: "1 / 2,175,763 mi" },
      { label: "US average (Tesla's est.)",  value: "1 / ~660,000 mi" },
    ],
    sources: [SOURCES.teslaFsdSafety, SOURCES.driveTeslaFsd],
    rebuttal: "Rolling 12 months, US and Canada, China excluded. A “major collision” means an airbag deployed, FSD counts as engaged if it was active at any point in the 5 seconds before impact, and no fault is attributed. Phil Koopman's apples-to-apples comparison of FSD-on against FSD-off miles shrinks the advantage to roughly 1.8×, and notes the 5-second window understates FSD's involvement.",
    rebuttalSource: SOURCES.koopmanFsd,
  },
  {
    title: "NHTSA Standing General Order",
    kind: "Regulator-collected",
    accent: "#ef4444",
    rows: [
      { label: "Tesla ADAS crashes, H1 2026", value: "826 (+73% YoY)" },
      { label: "Record single month",         value: "207 (May 2026)" },
      { label: "All-time reported",           value: "3,763" },
    ],
    sources: [SOURCES.electrekSgo, SOURCES.nhtsaSgo],
    rebuttal: "Absolute counts with no mileage denominator. Tesla's reply, on its own safety page: its large, connected fleet detects and reports far more crashes than less-connected manufacturers do — “Tesla reports more collisions simply because we have a large, active and fully connected customer vehicle fleet.”",
    rebuttalSource: SOURCES.teslaFsdSafety,
  },
];

// Tesla version-projection text (shown as an aside under the version chart).
// If the per-version improvement rate changes, edit the multiplier and the
// projected values together.
export const TESLA_PROJECTION = {
  multiplier: "~2.7×",
  projections: "v15 → ~3,900 mi · v16 → ~10,500 mi · v17 → ~28,400 mi · v18 → ~76,700 mi · v19 → ~207,000 mi · v20 → ~560,000 mi",
  caveat: "This extrapolation no longer holds. The same crowdsourced tracker shows city miles per critical disengagement peaking at 4,109 on v14.1 (Oct 2025) and falling to 809 on v14.2 (Mar 2026) — a reversal, not a 2.7× step. No v14.3 tracker figure has been published. Improvement rates also tend to slow at higher reliability.",
};

// ============================================================
// MUSK_PREDICTIONS — track record of public claims vs. what shipped.
// Each entry is { year, claim, result, source }.
// ============================================================

export const MUSK_PREDICTIONS = [
  { year: "2015", claim: "Full autonomy by 2018",                  result: "Not achieved",                          source: SOURCES.electrekMusk },
  { year: "2016", claim: "LA to NY autonomous by end of 2017",     result: "Achieved Dec 2025 — 8 years late",      source: SOURCES.teslarati },
  { year: "2019", claim: "1 million robotaxis by 2020",            result: "~59 vehicles in total as of Jun 2026",  source: SOURCES.bloombergFleet },
  { year: "2022", claim: "Robotaxi production in 2024",            result: "First Cybercab built Feb 2026",         source: SOURCES.techCrunch },
  { year: "2025", claim: "Millions of robotaxis in H2 2025",       result: "~59 across 7 metros, Jun 2026",         source: SOURCES.bloombergFleet },
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
  { year: "~2028",      event: "L4 robotaxis in 20+ cities globally",            status: "Ahead of schedule — ~40 cities live (US + China)", color: "#22c55e", source: SOURCES.baiduIr },
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
  waymoSeriousInjuryRate: "about one event per 50 million miles, as of early 2026",
  source: SOURCES.chop,
};

// ============================================================
// OTHERS_STATS / OTHER_PLAYERS — the Other Players page.
//
// OTHER_PLAYERS rows: { company, detail, scale, status, source }
// status: "driverless" | "supervised" | "testing" | "dead" (drives the chip color)
// scale is the headline number for the row (fleet, rides, miles — whatever
// that company discloses).
// ============================================================

export const OTHERS_STATS = [
  { label: "Apollo Go rides",      value: "22M+",   sublabel: "Cumulative, 27 cities worldwide",     accent: "#22d3ee", source: SOURCES.baiduIr },
  { label: "Pony.ai fleet",        value: "1,700+", sublabel: "Targeting 3,500+ by end of 2026",     accent: "#a78bfa", source: SOURCES.ponyIr },
  { label: "Aurora truck miles",   value: "250K+",  sublabel: "Driverless, zero at-fault collisions", accent: "#34d399", source: SOURCES.auroraIr },
  { label: "Zoox cities",          value: "2",      sublabel: "Las Vegas & SF; Miami, Austin next",  accent: "#f472b6", source: SOURCES.electrekZoox },
];

export const OTHER_PLAYERS = [
  { company: "Apollo Go (Baidu)", status: "driverless", scale: "22M+ rides",
    detail: "27 cities; 300K+ rides/week peak. Driverless in Dubai, Abu Dhabi, Seoul.", source: SOURCES.cnevApollo },
  { company: "Zoox (Amazon)",     status: "driverless", scale: "2 cities",
    detail: "Public rides in Las Vegas and SF; Miami and Austin announced; Uber app integration.", source: SOURCES.electrekZoox },
  { company: "Pony.ai",           status: "driverless", scale: "1,700+ fleet",
    detail: "China robotaxis; targeting 3,500+ vehicles in 20+ cities by end of 2026.", source: SOURCES.ponyIr },
  { company: "WeRide",            status: "driverless", scale: "~1,000 fleet",
    detail: "China + UAE; dual-listed Nasdaq and HKEX.", source: SOURCES.caixinWeRide },
  { company: "Aurora",            status: "driverless", scale: "250K+ mi",
    detail: "Driverless Class-8 trucking on Texas routes; 200+ trucks targeted by end of 2026.", source: SOURCES.auroraIr },
  { company: "Nuro",              status: "testing",    scale: "CA permit",
    detail: "Driverless testing permit May 2026; Uber robotaxi service in SF Bay planned.", source: SOURCES.tcNuro },
  { company: "Wayve",             status: "testing",    scale: "Tokyo 2026",
    detail: "Robotaxi pilot with Uber and Nissan; 10+ cities planned.", source: SOURCES.tcWayve },
  { company: "Mobileye / VW",     status: "testing",    scale: "LA 2026",
    detail: "ID.Buzz robotaxis with Uber; driverless targeted 2027.", source: SOURCES.insideEvsMoia },
  { company: "May Mobility",      status: "supervised", scale: "2 metros",
    detail: "Atlanta (Lyft) and Arlington TX (Uber), safety operators onboard.", source: SOURCES.tcMayMobility },
  { company: "Motional",          status: "testing",    scale: "Vegas EOY",
    detail: "AI-first reboot; driverless Las Vegas service by end of 2026.", source: SOURCES.tcMotional },
  { company: "Cruise (GM)",       status: "dead",       scale: "—",
    detail: "Shut down Dec 2024 after $10B+ in losses.", source: SOURCES.scdCruise },
];

// ============================================================
// FOOTER_SOURCES — short list of credits at the bottom of every page.
// ============================================================

export const FOOTER_SOURCES = [
  "NHTSA", "CA DMV", "Waymo Safety Impact", "Swiss Re", "Kusano et al. 2025",
  "teslafsdtracker.com", "AMCI Testing", "Fortune", "Electrek", "Baidu IR", "Aurora", "McKinsey",
];
