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
// `type` is rendered as a small tag next to every source link (see
// src/components/SourceTag.jsx), so readers can see how much to trust it.
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
};

// ============================================================
// SITE — top-level metadata.
// ============================================================

export const SITE = {
  lastUpdated: "Jul 2026", // shown in the header. Update whenever data changes.
  asOf: "2026-07",         // same date as "YYYY-MM"; charts use it as "today"
};

// ============================================================
// PAGES — title + subtitle copy for each top-level tab.
// `id` is the URL/state key. `nav` is the short label shown in the tab bar.
// ============================================================

export const PAGES = [
  {
    id: "home",
    nav: "Overview",
    eyebrow: "Self-driving safety, by the numbers",
    title: "How close are self-driving cars to human-level safety?",
    sub: "Tesla, Waymo, and human drivers by miles between safety events. Log scale — each step right is 10× safer.",
  },
  {
    id: "waymo",
    nav: "Waymo",
    title: "Waymo",
    sub: "220M+ driverless miles. Peer-reviewed safety data.",
  },
  {
    id: "tesla",
    nav: "Tesla FSD",
    title: "Tesla FSD",
    sub: "Fast version-over-version improvement; a large gap remains to unsupervised.",
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
// SAFETY_POINTS — the hero "road" on the Overview page. Every row is
// one safety data point, plotted on a log scale of miles between events.
// Each category gets its own lane; colors come from the CSS theme
// (src/styles/tokens.css), so there is nothing color-related to set here.
//
// Shape per row:
//   id       — unique, stable key (React uses it to track rows)
//   miles    — miles between events (the only number the chart needs)
//   label    — full name, used in tooltips and the data table
//   short    — compact name drawn next to the marker on the road
//   sublabel — short context line (e.g. "Crowdsourced average")
//   event    — what one event means. Must be a key of EVENT_TYPES below.
//   category — "tesla" | "waymo" | "human" — picks the lane
//   source   — SOURCES.x reference or inline { url, label, type }
// ============================================================

// The kinds of events a row can count. `human` names the matching row in
// HUMAN_BENCHMARKS so every system is compared like-for-like; a disengagement
// has no human equivalent, so it is compared against the all-crash rate and
// the UI flags that comparison as approximate.
export const EVENT_TYPES = {
  "disengagement":  { label: "critical disengagement", human: "crash", approx: true },
  "crash":          { label: "crash",                  human: "crash" },
  "injury crash":   { label: "injury crash",           human: "injury crash" },
  "serious injury": { label: "serious-injury crash",   human: "serious injury" },
  "fatal crash":    { label: "fatal crash",            human: "fatal crash" },
};

export const SAFETY_POINTS = [
  { id: "tesla-amci",      miles: 13,       label: "Tesla FSD v12.5",  short: "v12.5 (AMCI)",   sublabel: "AMCI independent test",       event: "disengagement",  category: "tesla", source: SOURCES.electrekAmci },
  { id: "tesla-v12-5",     miles: 183,      label: "Tesla FSD v12.5",  short: "v12.5",          sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", source: SOURCES.teslaTracker },
  { id: "tesla-v13",       miles: 493,      label: "Tesla FSD v13",    short: "v13",            sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", source: SOURCES.teslaTracker },
  { id: "tesla-v14",       miles: 1454,     label: "Tesla FSD v14",    short: "v14",            sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", source: SOURCES.teslaTracker },
  { id: "tesla-robotaxi",  miles: 57000,    label: "Tesla Robotaxi",   short: "Robotaxi",       sublabel: "Austin crash rate",           event: "crash",          category: "tesla", source: SOURCES.fortune },
  { id: "waymo-testing",   miles: 29000,    label: "Waymo (testing)",  short: "Testing",        sublabel: "CA DMV disengagements",       event: "disengagement",  category: "waymo", source: SOURCES.caDmv },
  { id: "waymo-injury",    miles: 1350000,  label: "Waymo",            short: "Injury",         sublabel: "Injury crash rate",           event: "injury crash",   category: "waymo", source: SOURCES.kusano2025 },
  { id: "waymo-serious",   miles: 50000000, label: "Waymo",            short: "Serious injury", sublabel: "Serious injury crash rate",   event: "serious injury", category: "waymo", source: SOURCES.waymoSafety },
  { id: "human-injury",    miles: 252000,   label: "Human drivers",    short: "Injury",         sublabel: "Injury crash rate",           event: "injury crash",   category: "human", source: SOURCES.kusano2025 },
  { id: "human-crash",     miles: 529000,   label: "Human drivers",    short: "All crashes",    sublabel: "All police-reported crashes", event: "crash",          category: "human", source: SOURCES.nhtsa },
  { id: "human-serious",   miles: 4300000,  label: "Human drivers",    short: "Serious injury", sublabel: "Serious injury crash rate (Waymo benchmark)", event: "serious injury", category: "human", source: SOURCES.waymoSafety },
  { id: "human-fatal",     miles: 86000000, label: "Human drivers",    short: "Fatal",          sublabel: "Fatal crash rate",            event: "fatal crash",    category: "human", source: SOURCES.nhtsa },
];

// Human benchmark per event type, looked up from the human rows above so each
// number lives in exactly one place.
export const HUMAN_BENCHMARKS = Object.fromEntries(
  SAFETY_POINTS.filter((d) => d.category === "human").map((d) => [d.event, d])
);

// ============================================================
// STATS — the four "headline" stat cards on each page.
//
// Shape per card:
//   label    — small uppercase title
//   value    — big number (string — keep formatting like "50M mi" or "1,454")
//   sublabel — one-line context
//   series   — optional "tesla" | "waymo" | "human": draws a small color key
//              beside the label so the tile matches the charts
//   source   — SOURCES.x or inline { url, label }
// ============================================================

export const HOME_STATS = [
  { label: "Waymo best",                   value: "50M mi",   sublabel: "per serious injury crash",       series: "waymo", source: SOURCES.waymoSafety },
  { label: "Tesla FSD v14",                value: "1,454 mi", sublabel: "per critical disengagement",     series: "tesla", source: SOURCES.teslaTracker },
  { label: "Human baseline",               value: "529K mi",  sublabel: "per police-reported crash",      series: "human", source: SOURCES.nhtsa },
  { label: "Gap: Tesla to unsupervised",   value: "~460×",    sublabel: "vs. Elluswamy 670K mi target", source: SOURCES.electrekMusk },
];

export const WAYMO_STATS = [
  { label: "Driverless miles",             value: "220M+",  sublabel: "Rider-only, through Mar 2026", source: SOURCES.waymoSafety },
  { label: "Weekly rides",                 value: "500K",   sublabel: "Target: 1M/week by end of 2026", source: SOURCES.alphabetQ1 },
  { label: "Safety vs humans",             value: "↓94%",   sublabel: "Fewer serious-injury crashes", source: SOURCES.waymoSafety },
  { label: "Cities",                       value: "11",     sublabel: "1,400+ sq mi service area", source: SOURCES.electrekWaymo1400 },
];

export const TESLA_STATS = [
  { label: "FSD v14 best",                 value: "1,454",  sublabel: "Miles / critical disengagement", source: SOURCES.teslaTracker },
  { label: "Improvement",                  value: "8×",     sublabel: "v12.5 to v14 in 14 months", source: SOURCES.teslaTracker },
  { label: "Robotaxi fleet (TX)",          value: "~42",    sublabel: "vs. Waymo's 577 — state filings", source: SOURCES.cnbcTexasFleet },
  { label: "Gap to unsupervised",          value: "~460×",  sublabel: "vs. Elluswamy 670K target", source: SOURCES.electrekMusk },
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

// The line under the table that explains the "*" cells.
export const CRASH_RATES_FOOTNOTE = {
  text: "* Waymo: zero fatalities in 220M+ driverless miles. Tesla robotaxi rate from an analysis of NHTSA filings (Feb 2026).",
  source: SOURCES.fortune,
};

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
// WAYMO_MILES_TIMELINE — cumulative driverless miles (in millions).
// date is "YYYY-MM" and places the point on the time axis; period is the label.
// ============================================================

export const WAYMO_MILES_TIMELINE = [
  { date: "2020-12", period: "2020",     miles: 6 },
  { date: "2021-12", period: "2021",     miles: 10 },
  { date: "2022-12", period: "2022",     miles: 20 },
  { date: "2023-12", period: "2023",     miles: 35 },
  { date: "2024-12", period: "2024",     miles: 60 },
  { date: "2025-09", period: "Sep 2025", miles: 127 },
  { date: "2026-03", period: "Mar 2026", miles: 221 },
];

// ============================================================
// WAYMO_INCIDENTS — known limitations and incidents.
//
// severity: "high" | "medium" | "info"  (drives the left border color)
// source: optional — null for "Ongoing" entries that don't have a single citation
// ============================================================

export const WAYMO_INCIDENTS = [
  { date: "Jun 2026", text: "Recall of ~4,000 vehicles after 13 instances of entering closed highway work zones", severity: "medium", source: SOURCES.tcWorkZone },
  { date: "May 2026", text: "Full-fleet recall (3,791 vehicles) after a San Antonio flooded-road incident — OTA fix", severity: "medium", source: SOURCES.electrekFlood },
  { date: "Jan 2026", text: "NHTSA probe: robotaxi struck a child near a Santa Monica school",   severity: "high",   source: SOURCES.foxSantaMonica },
  { date: "Dec 2025", text: "SF power outage caused some vehicles to freeze in intersections",   severity: "medium", source: SOURCES.slashdot },
  { date: "Oct 2025", text: "NHTSA investigation into ~20 school bus passing incidents in Austin; 3,067-vehicle recall followed", severity: "high", source: SOURCES.npr },
  { date: "Ongoing",  text: "Operates only in pre-mapped geofenced areas; no snow capability",    severity: "info",   source: null },
  { date: "Ongoing",  text: "Remote operators assist with edge cases — not fully independent",    severity: "info",   source: null },
];

// ============================================================
// TESLA_VERSION_PROGRESS — version-over-version trend on the Tesla page.
// Crowdsourced, biased optimistic — see note in dashboard.
// date is "YYYY-MM" (roughly when the version reached wide release) and
// sets the point's position on the time axis.
// ============================================================

export const TESLA_VERSION_PROGRESS = [
  { version: "v11",   date: "2023-03", milesPerIntervention: 5 },
  { version: "v12.3", date: "2024-04", milesPerIntervention: 80 },
  { version: "v12.5", date: "2024-08", milesPerIntervention: 183 },
  { version: "v13",   date: "2025-01", milesPerIntervention: 493 },
  { version: "v13.2", date: "2025-04", milesPerIntervention: 700 },
  { version: "v14",   date: "2025-11", milesPerIntervention: 1454 },
];

// Tesla's own bar for unsupervised driving: miles between critical
// interventions. Drawn as the target line on the version chart.
export const TESLA_TARGET = {
  miles: 670000,
  label: "Elluswamy's unsupervised target",
  source: SOURCES.electrekMusk,
};

// ============================================================
// TESLA_FSD_SUPERVISED / TESLA_ROBOTAXI — side-by-side fact lists.
//
// Each row is { label, value, source? }. source is optional — many Robotaxi
// rows are just facts derived from the same Fortune analysis (linked once at
// the bottom of the card in the dashboard).
// ============================================================

export const TESLA_FSD_SUPERVISED = [
  { label: "Wide release",             value: "v14.2 (59% of fleet)", source: { url: "https://www.notateslaapp.com/fsd-beta/", label: "NotATeslaApp", type: "press" } },
  { label: "Best crowdsourced rate",   value: "1,454 mi/int",    source: SOURCES.teslaTracker },
  { label: "Independent test (AMCI)",  value: "13 mi/int",       source: SOURCES.electrekAmci },
  { label: "Coast-to-coast record",    value: "2,732 mi, 0 int", source: SOURCES.teslarati },
  { label: "Longest streak",           value: "12,961 mi",       source: SOURCES.notATeslaApp },
  { label: "NHTSA investigation",      value: "2.88M vehicles",  source: SOURCES.openTools },
  { label: "Requires",                 value: "Human driver",    source: null },
];

export const TESLA_ROBOTAXI = [
  { label: "Launched",             value: "June 2025" },
  { label: "Unsupervised since",   value: "Jan 2026" },
  { label: "Cities",               value: "Austin · Dallas · Houston · Miami", source: SOURCES.engadgetMiami },
  { label: "Austin geofence",      value: "245 sq mi, ~20 cars",  source: SOURCES.techtimesAustin },
  { label: "Fleet in Texas",       value: "~42 vs Waymo 577",     source: SOURCES.cnbcTexasFleet },
  { label: "NHTSA incidents",      value: "17 (Jul 25–Mar 26)",   source: SOURCES.electrekUnredact },
  { label: "Crash rate (Feb 26)",  value: "1 per ~57K mi",        source: SOURCES.fortune },
  { label: "vs. human avg",        value: "~9x worse",            source: SOURCES.fortune },
];

// Independent (non-crowdsourced) tests, drawn as hollow markers on the
// version chart so readers can see how far they sit from the crowd numbers.
export const TESLA_INDEPENDENT_TESTS = [
  { label: "AMCI test, v12.5", date: "2024-09", miles: 13, source: SOURCES.electrekAmci },
];

// The version chart projects the trend forward from `fromVersion` to the
// latest version, at the same yearly growth rate, until it meets TESLA_TARGET.
// The chart computes the date itself; only the caveat is written here.
export const TESLA_PROJECTION = {
  fromVersion: "v12.5",
  caveat: "A straight-line guess, not a forecast. Improvement usually slows as reliability rises.",
};

// ============================================================
// MUSK_PREDICTIONS — track record of public claims vs. what shipped.
// Each entry is { said, due, done, claim, result, source }:
//   said — year the claim was made
//   due  — year it was promised for
//   done — year it actually happened, or null if it still hasn't
// The timeline chart draws said→due as the promise and due→done (or
// due→today) as the delay.
// ============================================================

export const MUSK_PREDICTIONS = [
  { said: 2015, due: 2018, done: null, claim: "Full autonomy by 2018",              result: "Not achieved",                     source: SOURCES.electrekMusk },
  { said: 2016, due: 2017, done: 2025, claim: "LA to NY autonomous by end of 2017", result: "Done Dec 2025 (supervised), 8 years late", source: SOURCES.teslarati },
  { said: 2019, due: 2020, done: null, claim: "1 million robotaxis by 2020",        result: "~42 in Texas as of May 2026",      source: SOURCES.cnbcTexasFleet },
  { said: 2022, due: 2024, done: 2026, claim: "Robotaxi production in 2024",        result: "First Cybercab built Feb 2026",    source: SOURCES.techCrunch },
  { said: 2025, due: 2025, done: null, claim: "Millions of robotaxis in H2 2025",   result: "~42 operating, mid-2026",          source: SOURCES.cnbcTexasFleet },
  { said: 2019, due: 2020, done: null, claim: "HW3 cars can do unsupervised FSD",   result: "Jan 2025: admitted upgrade needed", source: SOURCES.techCrunch },
];

// ============================================================
// TARGET_THRESHOLDS — Road to Steeringless reliability targets.
//
// miles = miles per crash the system must reach. 529K = human average.
// description is the rationale.
// ============================================================

export const TARGET_THRESHOLDS = [
  { miles:   529000, label: "Match human average",   description: "Break-even with the average human driver" },
  { miles:  3200000, label: "Regulatory confidence", description: "Likely bar for unsupervised permits at scale" },
  { miles: 10000000, label: "Remove steering wheel", description: "Plausible bar for mass-market cars with no wheel" },
  { miles: 32000000, label: "Child safety threshold", description: "Enough to trust a child riding alone" },
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
// tone is how likely/close it is: "good" (happening or ahead of schedule),
// "neutral" (consensus), "caution" (optimistic forecast), "far" (long-range
// or doubted). The theme picks the color for each tone.
// ============================================================

export const EXPERT_TIMELINES = [
  { year: "Now",        event: "L4 robotaxis in select cities (Waymo)",          status: "Happening",          tone: "good", source: SOURCES.axios },
  { year: "~2028",      event: "L4 robotaxis in 20+ cities globally",            status: "Ahead of schedule — ~40 cities live (US + China)", tone: "good", source: SOURCES.baiduIr },
  { year: "~2030",      event: "Large-scale L4 robotaxi rollout",                status: "Consensus",             tone: "neutral", source: SOURCES.mckinsey },
  { year: "~2032",      event: "L4 in privately owned vehicles (limited)",       status: "Optimistic",            tone: "caution", source: SOURCES.mckinsey },
  { year: "~2035",      event: "<6% of new vehicles sold have L4",               status: "Forecast",              tone: "caution", source: SOURCES.mckinsey },
  { year: "2035+",      event: "Consumer steeringless vehicles (mass market)",   status: "'Unlikely by 2035'",    tone: "far", source: SOURCES.spGlobal },
  { year: "2040s–60s",  event: "Most safety/mobility benefits materialize",      status: "Long-range",            tone: "far", source: SOURCES.wef },
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
// OTHERS_STATS / OTHER_PLAYERS — the Other Players page.
//
// OTHER_PLAYERS rows: { company, detail, scale, status, source }
// status: "driverless" | "supervised" | "testing" | "dead" (drives the chip color)
// scale is the headline number for the row (fleet, rides, miles — whatever
// that company discloses).
// ============================================================

export const OTHERS_STATS = [
  { label: "Apollo Go rides",      value: "22M+",   sublabel: "Cumulative, 27 cities worldwide", source: SOURCES.baiduIr },
  { label: "Pony.ai fleet",        value: "1,700+", sublabel: "Targeting 3,500+ by end of 2026", source: SOURCES.ponyIr },
  { label: "Aurora truck miles",   value: "250K+",  sublabel: "Driverless, zero at-fault collisions", source: SOURCES.auroraIr },
  { label: "Zoox cities",          value: "2",      sublabel: "Las Vegas & SF; Miami, Austin next", source: SOURCES.electrekZoox },
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
