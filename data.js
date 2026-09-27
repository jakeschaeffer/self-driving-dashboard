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

  // 2026 updates (Sep 2026 research pass) — Tesla
  teslaQ2:         { url: "https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q2-2026-Update.pdf", label: "Tesla Q2 2026", type: "company" },
  teslaFsdSafety:  { url: "https://www.tesla.com/fsd/safety", label: "Tesla FSD safety report", type: "company" },
  electrek1MUnsup: { url: "https://electrek.co/2026/09/03/tesla-announces-1-million-unsupervised-miles-driven-by-robotaxi/", label: "Electrek", type: "press" },
  teslaOracleFleet:{ url: "https://www.teslaoracle.com/2026/09/26/tesla-robotaxi-and-cybercab-fleet-in-texas-surpasses-the-500-mark-420-126/", label: "Tesla Oracle", type: "press" },
  teslaOracleFsd:  { url: "https://www.teslaoracle.com/2026/09/12/tesla-rolls-out-fsd-v14-3-9-2026-27-6-with-automatic-collision-evasion-feature-details-and-official-release-notes/", label: "Tesla Oracle", type: "press" },
  electrekHouston: { url: "https://electrek.co/2026/07/20/tesla-robotaxi-remote-operator-crash-houston/", label: "Electrek", type: "press" },
  electrekCybercabNhtsa: { url: "https://electrek.co/2026/09/15/nhtsa-tesla-cybercab-special-order-fmvss-certification/", label: "Electrek", type: "press" },
  electrekCybercabProd:  { url: "https://electrek.co/2026/04/23/tesla-cybercab-production-starts-no-nhtsa-2500-vehicle-cap/", label: "Electrek", type: "press" },
  electrek10B:     { url: "https://electrek.co/2026/05/03/tesla-fsd-10-billion-miles-no-magical-milestone-autonomy/", label: "Electrek", type: "press" },
  electrekMuskWidespread: { url: "https://electrek.co/2026/05/18/musk-unsupervised-fsd-widespread-us-end-of-year-smart-mobility-summit/", label: "Electrek", type: "press" },
  cnbcMuskWidespread: { url: "https://www.cnbc.com/2026/01/22/musk-tesla-robotaxis-us-expansion.html", label: "CNBC", type: "press" },
  cnbcFsdProbe:    { url: "https://www.cnbc.com/2026/03/19/tesla-nhtsa-full-self-driving-fsd-reduced-visibility.html", label: "CNBC", type: "press" },
  evV14Tracker:    { url: "https://eletric-vehicles.com/tesla/tesla-fsd-v14-data-shows-major-improvement-in-miles-between-interventions/", label: "EV (tracker data)", type: "press" },
  piperSandler:    { url: "https://finance.yahoo.com/news/tesla-unsupervised-fsd-milestone-very-close-piper-sandler-says-185014902.html", label: "Yahoo Finance", type: "press" },
  benzingaGlj:     { url: "https://www.benzinga.com/markets/tech/26/03/51137537/teslas-fsd-safety-metrics-sharply-deteriorating-says-analyst", label: "Benzinga", type: "press" },

  // 2026 updates (Sep 2026 research pass) — Waymo
  waymoSep26:      { url: "https://waymo.com/blog/shorts/safetydata-september26/", label: "Waymo, Sep 2026", type: "company" },
  electrekWaymo271:{ url: "https://electrek.co/2026/09/24/waymo-says-it-has-stopped-841-injuries-in-271-million-autonomous-miles/", label: "Electrek", type: "press" },
  tcWaymo14:       { url: "https://techcrunch.com/2026/09/01/waymo-accelerates-robotaxi-expansion-with-launches-in-denver-san-diego-and-tampa/", label: "TechCrunch", type: "press" },
  cnbcAlphabetQ2:  { url: "https://www.cnbc.com/2026/07/22/google-earnings-q2-goog-live-updates.html", label: "CNBC", type: "press" },
  sfsFreeway:      { url: "https://sfstandard.com/2026/05/21/waymo-suspends-all-freeway-rides-safety-issues/", label: "SF Standard", type: "press" },
  nbcdfwDallas:    { url: "https://www.nbcdfw.com/news/local/pedestrian-killed-suv-crash-waymo-dallas/4060058/", label: "NBC DFW", type: "press" },
  forbesDallas:    { url: "https://www.forbes.com/sites/bradtempleton/2026/08/10/waymo-fatality-likely-not-at-fault-here-are-new-details-and-what-ifs/", label: "Forbes", type: "press" },

  // 2026 updates (Sep 2026 research pass) — others and regulation
  baiduQ2:         { url: "https://www.prnewswire.com/news-releases/baidu-announces-second-quarter-2026-results-302853860.html", label: "Baidu Q2 2026", type: "company" },
  ponyQ2:          { url: "https://www.sec.gov/Archives/edgar/data/0001969302/000110465926098113/tm2623382d1_ex99-1.htm", label: "Pony.ai Q2 2026", type: "company" },
  werideQ2:        { url: "https://ir.weride.ai/news-releases/news-release-details/accelerating-european-expansion-through-proven-asset-light-model", label: "WeRide Q2 2026", type: "company" },
  auroraQ2:        { url: "https://www.nasdaq.com/press-release/aurora-announces-second-quarter-2026-results-2026-07-29", label: "Aurora Q2 2026", type: "company" },
  tcZooxExempt:    { url: "https://techcrunch.com/2026/07/30/zoox-clears-final-federal-hurdle-to-launch-paid-robotaxi-service/", label: "TechCrunch", type: "press" },
  cnbcZooxPaid:    { url: "https://www.cnbc.com/2026/08/05/amazon-zoox-paid-robotaxi-rides-las-vegas.html", label: "CNBC", type: "press" },
  lucidQ2:         { url: "https://www.sec.gov/Archives/edgar/data/0001811210/000162828026052548/q2fy26ex991earnings.htm", label: "Lucid Q2 2026", type: "company" },
  uberMotional:    { url: "https://investor.uber.com/news-events/news/press-release-details/2026/Uber-and-Motional-Launch-Robotaxi-Service-in-Las-Vegas/default.aspx", label: "Uber", type: "company" },
  tcMoiaLA:        { url: "https://techcrunch.com/2026/04/08/volkswagen-moia-uber-los-angeles-testing-self-driving-microbuses-id-buzz/", label: "TechCrunch", type: "press" },
  fedRegAvFramework: { url: "https://www.federalregister.gov/documents/2026/07/31/2026-15483/av-framework-updates-and-request-for-comments-on-interim-guidance", label: "Federal Register", type: "regulator" },
  crowellAvStep:   { url: "https://www.crowell.com/en/insights/client-alerts/nhtsa-proposes-updates-to-federal-brake-standards-for-autonomous-vehicles-and-withdraws-av-step-program", label: "Crowell & Moring", type: "press" },
  foxSelfDrive:    { url: "https://www.foxnews.com/politics/congress-moves-set-national-rules-self-driving-cars-overriding-states", label: "Fox News", type: "press" },
};

// ============================================================
// SITE — top-level metadata.
// ============================================================

export const SITE = {
  lastUpdated: "Sep 2026", // shown in the header. Update whenever data changes.
  asOf: "2026-09",         // same date as "YYYY-MM"; charts use it as "today"
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
    sub: "271M+ driverless miles across 14 US cities, with the most detailed safety data in the industry.",
  },
  {
    id: "tesla",
    nav: "Tesla FSD",
    title: "Tesla FSD",
    sub: "Fast version-over-version gains and a driverless robotaxi fleet in six metros, but customer cars still need a driver.",
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
  { id: "tesla-v13",       miles: 443,      label: "Tesla FSD v13.2",  short: "v13.2",          sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", source: SOURCES.evV14Tracker },
  { id: "tesla-v14",       miles: 1454,     label: "Tesla FSD v14",    short: "v14",            sublabel: "Crowdsourced average",        event: "disengagement",  category: "tesla", source: SOURCES.teslaTracker },
  { id: "tesla-robotaxi",  miles: 57000,    label: "Tesla Robotaxi",   short: "Robotaxi",       sublabel: "Crash rate with safety monitor, Jul 2025–Jan 2026", event: "crash",          category: "tesla", source: SOURCES.fortune },
  { id: "waymo-testing",   miles: 29000,    label: "Waymo (testing)",  short: "Testing",        sublabel: "CA DMV disengagements",       event: "disengagement",  category: "waymo", source: SOURCES.caDmv },
  { id: "waymo-injury",    miles: 1350000,  label: "Waymo",            short: "Injury",         sublabel: "Injury crash rate",           event: "injury crash",   category: "waymo", source: SOURCES.kusano2025 },
  { id: "waymo-serious",   miles: 100000000, label: "Waymo",           short: "Serious injury", sublabel: "Serious-injury crash rate, ~0.01 per million mi (2026)", event: "serious injury", category: "waymo", source: SOURCES.waymoSafety },
  { id: "human-injury",    miles: 252000,   label: "Human drivers",    short: "Injury",         sublabel: "Injury crash rate",           event: "injury crash",   category: "human", source: SOURCES.kusano2025 },
  { id: "human-crash",     miles: 529000,   label: "Human drivers",    short: "All crashes",    sublabel: "All police-reported crashes", event: "crash",          category: "human", source: SOURCES.nhtsa },
  { id: "human-serious",   miles: 4800000,  label: "Human drivers",    short: "Serious injury", sublabel: "Serious-injury crash rate, 0.21 per million mi (Waymo's benchmark)", event: "serious injury", category: "human", source: SOURCES.waymoSafety },
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
  { label: "Waymo best",                   value: "~100M mi", sublabel: "per serious-injury crash",       series: "waymo", source: SOURCES.waymoSafety },
  { label: "Tesla FSD v14",                value: "1,454 mi", sublabel: "per critical disengagement",     series: "tesla", source: SOURCES.teslaTracker },
  { label: "Human baseline",               value: "529K mi",  sublabel: "per police-reported crash",      series: "human", source: SOURCES.nhtsa },
  { label: "Gap: Tesla to unsupervised",   value: "~460×",    sublabel: "vs. Elluswamy 670K mi target", source: SOURCES.electrekMusk },
];

export const WAYMO_STATS = [
  { label: "Driverless miles",             value: "271M+",  sublabel: "Rider-only, through Jun 2026", source: SOURCES.waymoSep26 },
  { label: "Weekly rides",                 value: "500K+",  sublabel: "Flat in Q2; target 1M/week by end of 2026", source: SOURCES.cnbcAlphabetQ2 },
  { label: "Safety vs humans",             value: "↓95%",   sublabel: "Fewer serious-injury crashes", source: SOURCES.waymoSep26 },
  { label: "Cities",                       value: "14",     sublabel: "4,000+ vehicles; Denver, San Diego, Tampa added Sep 2026", source: SOURCES.tcWaymo14 },
];

export const TESLA_STATS = [
  { label: "FSD v14 (crowd)",              value: "1,454",  sublabel: "Miles per critical disengagement", source: SOURCES.teslaTracker },
  { label: "Unsupervised robotaxi miles",  value: "1M+",    sublabel: "Tesla figure, Sep 3; ~200 cars with no one aboard", source: SOURCES.electrek1MUnsup },
  { label: "Robotaxis registered (TX)",    value: "546",    sublabel: "420 Model Y + 126 Cybercab, Sep 26", source: SOURCES.teslaOracleFleet },
  { label: "Gap to unsupervised",          value: "~460×",  sublabel: "FSD v14 vs. Elluswamy 670K target", source: SOURCES.electrekMusk },
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
  text: "* No fatal crash has been caused by a Waymo in 271M+ driverless miles. In Aug 2026 an empty Waymo in Dallas was involved in a fatal crash after another driver threw a pedestrian into its lane; police found no one at fault. Tesla robotaxi rate covers Jul 2025–Jan 2026, with safety monitors aboard.",
  source: SOURCES.forbesDallas,
};

export const CRASH_RATES = [
  { metric: "Police-reported crash", human: "529K", waymo: "~476K",         tesla: "~57K",     waymoGood: false, teslaGood: false, source: SOURCES.nhtsa },
  { metric: "Injury crash",          human: "252K", waymo: "1.35M",         tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.kusano2025 },
  { metric: "Serious injury crash",  human: "~4.8M", waymo: "~100M",       tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.waymoSafety },
  { metric: "Fatal crash",           human: "86M",  waymo: "0 at fault*",   tesla: "—",        waymoGood: true,  teslaGood: null,  source: SOURCES.nhtsa },
];

// ============================================================
// WAYMO_CRASH_REDUCTION — by severity, for the Waymo page.
// reduction = % fewer crashes than the human benchmark (drives the bars).
// waymo / human = incidents per million miles, optional: shown when published.
// ============================================================

export const WAYMO_CRASH_REDUCTION = [
  { category: "Serious injury or worse", reduction: 95, waymo: 0.01, human: 0.21, source: SOURCES.waymoSep26 },
  { category: "Any injury",              reduction: 82, source: SOURCES.waymoSep26 },
  { category: "Airbag deployment",       reduction: 82, source: SOURCES.waymoSep26 },
  { category: "Pedestrian injury",       reduction: 93, source: SOURCES.waymoSep26 },
  { category: "Cyclist injury",          reduction: 86, source: SOURCES.waymoSep26 },
  { category: "Motorcyclist injury",     reduction: 82, source: SOURCES.waymoSep26 },
  { category: "Property damage claims",  reduction: 88, waymo: 0.36, human: 3.08, source: SOURCES.swissRe },
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
  { date: "2025-12", period: "Dec 2025", miles: 170 },
  { date: "2026-03", period: "Mar 2026", miles: 221 },
  { date: "2026-06", period: "Jun 2026", miles: 271 },
];

// ============================================================
// WAYMO_INCIDENTS — known limitations and incidents.
//
// severity: "high" | "medium" | "info"  (drives the left border color)
// source: optional — null for "Ongoing" entries that don't have a single citation
// ============================================================

export const WAYMO_INCIDENTS = [
  { date: "Aug 2026", text: "Empty Waymo involved in a fatal Dallas crash after an SUV threw a pedestrian into its lane; police found no one at fault", severity: "high", source: SOURCES.nbcdfwDallas },
  { date: "Jul 2026", text: "Freeway rides return after a fleet-wide pause that began in May over construction-zone errors", severity: "medium", source: SOURCES.sfsFreeway },
  { date: "Jun 2026", text: "Recall of ~4,000 vehicles after 13 instances of entering closed highway work zones", severity: "medium", source: SOURCES.tcWorkZone },
  { date: "May 2026", text: "Full-fleet recall (3,791 vehicles) after a San Antonio flooded-road incident, fixed over the air", severity: "medium", source: SOURCES.electrekFlood },
  { date: "Jan 2026", text: "NHTSA probe: robotaxi struck a child near a Santa Monica school",   severity: "high",   source: SOURCES.foxSantaMonica },
  { date: "Dec 2025", text: "SF power outage caused some vehicles to freeze in intersections",   severity: "medium", source: SOURCES.slashdot },
  { date: "Oct 2025", text: "NHTSA investigation into ~20 school bus passing incidents in Austin; 3,067-vehicle recall followed", severity: "high", source: SOURCES.npr },
  { date: "Ongoing",  text: "Operates only in pre-mapped service areas; snow driving is unproven at commercial scale", severity: "info",   source: null },
  { date: "Ongoing",  text: "Remote operators assist with edge cases, so it is not fully independent", severity: "info",   source: null },
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
  { version: "v13.2", date: "2025-01", milesPerIntervention: 443 },
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
// Each row is { label, value, source? }. source is optional.
// ============================================================

export const TESLA_FSD_SUPERVISED = [
  { label: "Latest release",           value: "v14.3.10 (Sep 2026)",   source: SOURCES.teslaOracleFsd },
  { label: "Older HW3 cars",           value: "v14.2 \"Lite\"",        source: SOURCES.teslaOracleFsd },
  { label: "Crowdsourced rate (v14)",  value: "1,454 mi/int",          source: SOURCES.teslaTracker },
  { label: "Independent test (AMCI)",  value: "13 mi/int (v12.5)",     source: SOURCES.electrekAmci },
  { label: "Tesla-reported, FSD on",   value: "5.7M mi / major crash", source: SOURCES.teslaFsdSafety },
  { label: "Cumulative FSD miles",     value: "10B+ (May 2026)",       source: SOURCES.electrek10B },
  { label: "NHTSA probe (visibility)", value: "3.2M vehicles",         source: SOURCES.cnbcFsdProbe },
  { label: "Requires",                 value: "Human driver",          source: null },
];

export const TESLA_ROBOTAXI = [
  { label: "Launched",                 value: "Jun 2025 (Austin)" },
  { label: "Unsupervised in",          value: "6 metros, TX + FL",     source: SOURCES.teslaQ2 },
  { label: "With safety driver",       value: "SF Bay Area",           source: SOURCES.teslaQ2 },
  { label: "Cars with no one aboard",  value: "~200 (Sep 2026)",       source: SOURCES.electrek1MUnsup },
  { label: "Unsupervised miles",       value: "1M+ (Sep 3)",           source: SOURCES.electrek1MUnsup },
  { label: "Registered in Texas",      value: "546 (126 Cybercabs)",   source: SOURCES.teslaOracleFleet },
  { label: "NHTSA crash reports",      value: "21+ (to Jul 2026)",     source: SOURCES.electrekHouston },
  { label: "Crash rate, with monitor", value: "1 per ~57K mi",         source: SOURCES.fortune },
  { label: "Cybercab",                 value: "Paid rides; NHTSA order", source: SOURCES.electrekCybercabNhtsa },
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
  { said: 2015, due: 2018, done: null, claim: "Full autonomy by 2018",              result: "Customer FSD still requires a driver", source: SOURCES.electrekMusk },
  { said: 2016, due: 2017, done: 2025, claim: "LA to NY autonomous by end of 2017", result: "Done Dec 2025 (supervised), 8 years late", source: SOURCES.teslarati },
  { said: 2019, due: 2020, done: null, claim: "1 million robotaxis by 2020",        result: "~200 driverless cars, Sep 2026",   source: SOURCES.electrek1MUnsup },
  { said: 2019, due: 2020, done: null, claim: "HW3 cars can do unsupervised FSD",   result: "Jan 2025: admitted upgrade needed; HW3 now gets a \"Lite\" build", source: SOURCES.techCrunch },
  { said: 2022, due: 2024, done: 2026, claim: "Robotaxi production in 2024",        result: "Cybercab production began Apr 2026; volume output cut from 2026 plan", source: SOURCES.electrekCybercabProd },
  { said: 2025, due: 2025, done: null, claim: "Millions of robotaxis in H2 2025",   result: "~200 driverless cars, Sep 2026",   source: SOURCES.electrek1MUnsup },
  { said: 2025, due: 2025, done: null, claim: "Robotaxi for half the US population by end of 2025", result: "6 metros in 2 states, Sep 2026", source: SOURCES.electrekMuskWidespread },
  { said: 2026, due: 2026, done: null, claim: "Robotaxis \"widespread\" in the US by end of 2026", result: "Deadline still open",  source: SOURCES.cnbcMuskWidespread },
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
  { title: "Federal exemption cap", detail: "Max 2,500 exempt vehicles per maker per year. Zoox's 2026 exemption hit exactly that cap.", status: "blocked",  source: SOURCES.tcZooxExempt },
  { title: "FMVSS updates",         detail: "Crashworthiness updated (2022). 2026 proposals cover shifting, defrost, wipers and brakes for cars without manual controls.", status: "partial",  source: SOURCES.fedRegAvFramework },
  { title: "AV Framework",          detail: "AV STEP was withdrawn in 2026. New interim guidance (Jul 2026) aims to speed up Part 555 exemptions; comments still open.", status: "partial",  source: SOURCES.crowellAvStep },
  { title: "SELF DRIVE Act",        detail: "Would raise the 2,500 cap. The 2026 bill (H.R. 7390) cleared a House committee by one vote; no floor vote yet.", status: "partial",  source: SOURCES.foxSelfDrive },
  { title: "Zoox exemption",        detail: "First commercial exemption for a robotaxi with no steering wheel (Jul 30, 2026). Paid rides began Aug 10 in Las Vegas.", status: "achieved", source: SOURCES.tcZooxExempt },
  { title: "Cybercab certification",detail: "Tesla self-certified its wheel-less Cybercab without an exemption. NHTSA opened an audit Sep 3 and a Special Order Sep 10.", status: "partial",  source: SOURCES.electrekCybercabNhtsa },
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
  { year: "Now",        event: "L4 robotaxis in select cities (Waymo, Apollo Go, Zoox, Tesla)", status: "Happening", tone: "good", source: SOURCES.tcWaymo14 },
  { year: "~2028",      event: "L4 robotaxis in 20+ cities globally",            status: "Already passed: Apollo Go runs in 28 cities, Waymo in 14", tone: "good", source: SOURCES.baiduQ2 },
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
  waymoSeriousInjuryRate: "about one per 100 million miles",
  waymoCrashRate: "about one per 476K miles",
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
  { label: "Apollo Go rides",      value: "23M+",   sublabel: "Cumulative, 28 cities (Jun 2026)",      source: SOURCES.baiduQ2 },
  { label: "Pony.ai fleet",        value: "1,975",  sublabel: "Q2 2026; 3,500+ targeted by year-end",  source: SOURCES.ponyQ2 },
  { label: "WeRide robotaxis",     value: "1,800+", sublabel: "Of ~3,400 L4 vehicles in 13 countries", source: SOURCES.werideQ2 },
  { label: "Aurora truck miles",   value: "440K",   sublabel: "Driverless, zero Aurora-caused collisions", source: SOURCES.auroraQ2 },
];

export const OTHER_PLAYERS = [
  { company: "Apollo Go (Baidu)", status: "driverless", scale: "23M+ rides",
    detail: "28 cities; 240M+ fully driverless km. Commercial service in Dubai (also on Uber); testing in Hong Kong, London and Switzerland.", source: SOURCES.baiduQ2 },
  { company: "Zoox (Amazon)",     status: "driverless", scale: "Paid in Las Vegas",
    detail: "First federal exemption for a robotaxi with no steering wheel. Paid rides since Aug 10; free rides in SF; Austin and Miami planned.", source: SOURCES.cnbcZooxPaid },
  { company: "Pony.ai",           status: "driverless", scale: "1,975 fleet",
    detail: "China robotaxis; 3,500+ targeted by end of 2026; Uber deal for 2,000+ cars in Europe.", source: SOURCES.ponyQ2 },
  { company: "WeRide",            status: "driverless", scale: "1,800+ robotaxis",
    detail: "China, the Middle East and Europe; ~3,400 L4 vehicles across 13 countries.", source: SOURCES.werideQ2 },
  { company: "Aurora",            status: "driverless", scale: "440K mi",
    detail: "Driverless Class-8 trucks in Texas; second-gen hardware launched; 200 trucks targeted by end of 2026.", source: SOURCES.auroraQ2 },
  { company: "Motional",          status: "supervised", scale: "Las Vegas (Uber)",
    detail: "IONIQ 5 robotaxis on Uber with an operator aboard; driverless targeted by end of 2026.", source: SOURCES.uberMotional },
  { company: "May Mobility",      status: "supervised", scale: "2 metros",
    detail: "Atlanta (Lyft) and Arlington TX (Uber), safety operators onboard.", source: SOURCES.tcMayMobility },
  { company: "Nuro (Lucid, Uber)",status: "testing",    scale: "Bay Area + Houston",
    detail: "Lucid Gravity robotaxis testing with a CA driverless permit; Uber launch planned for late 2026.", source: SOURCES.lucidQ2 },
  { company: "Wayve",             status: "testing",    scale: "Tokyo, late 2026",
    detail: "Uber pilot with Nissan, safety driver at first; 10+ cities planned including London.", source: SOURCES.tcWayve },
  { company: "VW MOIA / Mobileye",status: "testing",    scale: "LA, late 2026",
    detail: "ID. Buzz robotaxis testing in LA with safety drivers; Uber launch by late 2026.", source: SOURCES.tcMoiaLA },
  { company: "Cruise (GM)",       status: "dead",       scale: "—",
    detail: "Shut down Dec 2024 after $10B+ in losses.", source: SOURCES.scdCruise },
];

// ============================================================
// FOOTER_SOURCES — short list of credits at the bottom of every page.
// ============================================================

export const FOOTER_SOURCES = [
  "NHTSA", "CA DMV", "Waymo Safety Impact", "Swiss Re", "Kusano et al. 2025", "Tesla",
  "teslafsdtracker.com", "AMCI Testing", "Electrek", "TechCrunch", "CNBC", "Baidu IR", "Aurora", "McKinsey",
];
