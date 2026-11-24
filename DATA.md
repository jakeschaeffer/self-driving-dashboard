# DATA.md

The data this site shows lives in **`data.js`**. The dashboard imports from there and renders it. If you want to change a number, add a row, or swap a citation, that's the only file you need to touch — no JSX edits required for routine updates.

The UI lives in `src/`: `src/App.jsx` (shell + hash-routed tab nav), `src/ui.jsx` (design tokens and shared primitives — no charting library), `src/charts/` (one file per chart: the safety ladder, trend line, ratio bars, Waymo miles timeline and severity cards, plus shared parts like the shape `Marker`, `Legend`, tooltip and collapsible data table), and one file per tab in `src/pages/`.

This doc covers:
1. [What's in `data.js`](#whats-in-datajs) — every export and what it powers
2. [Source-quality conventions](#source-quality-conventions) — how to think about regulator vs. self-reported vs. crowdsourced data
3. [Update workflow](#update-workflow) — concrete recipes for the cases that come up most
4. [Adding shapes that don't exist yet](#adding-shapes-that-dont-exist-yet) — the project deliberately leaves room for new data forms

---

## What's in `data.js`

Each section below maps an exported constant to the place in the UI it shows up.

### `SOURCES` — the citation catalog
Every link the site cites is named here once. A row in any data array can either reference a catalog source (`source: SOURCES.nhtsa`) or use an inline object (`source: { url: "...", label: "..." }`) for one-offs.

Each entry has `{ url, label, type }`, where `type` is one of:
- `regulator` — NHTSA, CA DMV, Federal Register, etc.
- `academic` — peer-reviewed studies, university research
- `company` — self-reported by the AV company
- `crowdsource` — community trackers like teslafsdtracker.com
- `press` — journalism, analyst reports, industry forecasts

`type` isn't rendered today. It's there for source-quality auditing — see [Source-quality conventions](#source-quality-conventions).

### `SITE`
- `lastUpdated`: shown in the header. Bump whenever data changes.

### `PAGES`
The five top-level tabs (Overview, Waymo, Tesla FSD, Others, Road to Steeringless). Each entry has `{ id, nav, title, sub }`. `nav` is the short label in the tab bar; `title` is the page heading; `sub` is the paragraph under the heading. Tabs are hash-routed (`#waymo`, `#tesla`, …) so they can be deep-linked.

### `NINES_SCALE_DATA` — the hero ladder
The main visualization on the landing page. Every row is one safety data point on the log scale of miles between events.

Shape:
```js
{
  miles: 1454,                   // miles between events; the ladder plots log10(miles)
  label: "Tesla FSD v14",        // system name
  sublabel: "Crowdsourced average",
  event: "disengagement",        // disengagement | crash | injury crash | serious injury | fatal crash
  category: "tesla",             // tesla | waymo | human → marker shape + color
  source: SOURCES.teslaTracker,
}
```

### Stat cards (per page)
- `HOME_STATS` — the four cards above the ladder
- `WAYMO_STATS` — Waymo deep dive
- `TESLA_ROBOTAXI_STATS` — the robotaxi tiles on the Tesla page

Shape: `{ label, value, sublabel, source }`. Values render in white; the label says what the number is. `value` is a string (we keep formatting like `"50M mi"` or `"~460×"`).

### `CRASH_RATES`
Table on the Overview page (below the ladder). Every value is a string of miles between events, or a footnoted zero (`"0 fatalities*"`, `"0 in 3.1M mi†"`) where there's no event to divide by; the footnotes themselves are written in `src/pages/Overview.jsx`. There's no better/worse coloring — readers compare the numbers.

### `WAYMO_CRASH_REDUCTION`
By-severity comparison on the Waymo page. Numbers are incidents per million miles.

### `WAYMO_MILES_TIMELINE`
Cumulative driverless miles (in millions), `{ period, miles, t }`. `t` is the decimal year the total is as of (a year-end total sits at Jan 1 of the next year) and places the column on a true time axis, so uneven gaps between readings stay visible.

### `WAYMO_INCIDENTS`
Known limitations and incidents. `severity` is `"high" | "medium" | "info"`. `source` is optional — the two "Ongoing" entries don't cite a single article.

### Tesla page
The Tesla page is one chart (or tile row) per question, each followed by a `Caveats` list. Tesla-reported and crowdsourced numbers are drawn in the amber accent with circle markers; independent or like-for-like checks are drawn in gray (triangle markers on the trend chart).

- **`TESLA_VERSION_PROGRESS`** — crowdsourced miles per critical disengagement, `{ version, date: "YYYY Qn", milesPerIntervention }`. Plotted as the amber line in `LogTrendChart`. Add a row per new version; the chart, its "~N× gap" label and the data table all update.
- **`TESLA_INDEPENDENT_TESTS`** — third-party tests (AMCI today), same shape plus `{ tester, source }`. Plotted as gray points.
- **`TESLA_V15_CLAIM`** — v15's claimed multiplier vs. v14 (`{ version, date, multiplier, source }`). Drawn as a dashed bar in the "Improvement per version" chart, whose measured bars are computed from the first reading of each major version in `TESLA_VERSION_PROGRESS`.
- **`TESLA_UNSUPERVISED_TARGET`** — `{ miles, label, source }`. The horizontal target line.
- **`TESLA_FSD_COLLISIONS`** — Tesla's raw miles per major collision (FSD, manual with/without active safety, US average) plus `asOf`. Shown in the crash chart's data table.
- **`TESLA_SAFETY_RATIOS`** — the bars in `RatioBars`: `{ label, sub, ratio, headline?, approx?, detail, source }`. Ratios built from `TESLA_FSD_COLLISIONS` are computed, so updating the raw miles is enough. `headline: true` draws the bar in amber.
- **`TESLA_ROBOTAXI_STATS`** — robotaxi stat tiles, same shape as the other `*_STATS` arrays.

### `MUSK_PREDICTIONS`
Track record of public claims vs. what shipped. `{ year, claim, result, source }`.

### `TARGET_THRESHOLDS`
The "How safe is safe enough?" block on the Road to Steeringless page. `{ miles, label, description, source: { kind, label, short?, url } }`. No regulator publishes a number, so every row says what backs it: `kind` is `"Source:"` for a published figure, or an `"Illustrative…"` note followed by the closest context we can cite. `short` is an optional shorter link label for phones. Years-per-driver is computed at 14,000 mi/yr.

### `REGULATORY_BARRIERS`
Non-technical blockers. `status` is `"achieved" | "partial" | "blocked"` and drives the chip color.

### `EXPERT_TIMELINES`
Consensus dates from McKinsey/S&P/WEF/BCG. `year` is a string so it can be `"Now"`, `"~2028"`, `"2040s–60s"`, etc.

### `OTHERS_STATS` / `OTHER_PLAYERS`
The Others page. `OTHER_PLAYERS` rows are `{ company, status, scale, detail, source }` where `status` is `"driverless" | "supervised" | "testing" | "dead"` (drives the chip color) and `scale` is whatever headline number that company discloses — rides, fleet size, or miles. They are intentionally NOT comparable across companies; the Note on the page says so.

### `CHILD_SAFETY`
The single paragraph at the bottom of the Steeringless page. Mostly prose, but the canonical numbers (parent-attitude percentages, threshold miles) live here so they're easy to update.

### `FOOTER_SOURCES`
Short list of credits at the bottom of every page.

---

## Source-quality conventions

The site mixes data from places with very different bars for "true." Be explicit about which is which:

- **Regulator data** (NHTSA, CA DMV) — most authoritative. Use as the human baseline whenever possible. NHTSA's all-crash rate (529K mi/event) is *the* anchor for the hero chart.
- **Peer-reviewed academic** (Kusano et al. 2025, RAND, IIHS) — second most authoritative. Use when a regulator number doesn't exist for the metric.
- **Company self-reported** (Waymo Safety Impact, Tesla Vehicle Safety Reports) — the company controls the methodology and what's counted. Note this in the `Note` blocks. Tesla in particular redacts crash details in NHTSA filings — flag that.
- **Crowdsourced** (teslafsdtracker.com) — biased optimistic. Add a `Note` saying so. The Tesla page explicitly contrasts crowdsourced (~1,454 mi) with independent AMCI testing (13 mi) on the same FSD version.
- **Press / analyst** — useful for forecasts and event tracking, not for headline safety numbers.

When you're adding a row, ask: would I want my reader to see this number with the original source label visible? If the answer is "no, it needs context," prefer adding a `Note` block under the section in the dashboard alongside the data update.

---

## Update workflow

### Updating a single number (e.g. Tesla FSD v14 → v14.3 release)
1. Find the row in `data.js`. For the home/ladder, that's `NINES_SCALE_DATA`. For the Tesla page version chart, add a row to `TESLA_VERSION_PROGRESS`. For stat cards, the corresponding `*_STATS` array.
2. On the ladder, change `miles`, and `label`/`sublabel` if the version changed. (The Tesla chart computes its own log scale — just `milesPerIntervention`.)
3. Bump `SITE.lastUpdated`.
4. Visually verify all five tabs at desktop and 320px mobile.

### Adding a brand-new row to the ladder
For a data point we haven't tracked before (e.g. a Cruise number, or a new Waymo metric):

1. Pick the `category` (`tesla` | `waymo` | `human`). It sets the row's marker shape and color; a new family needs a new entry in `FAMILY` in `src/charts/SafetyLadder.jsx`, with its own shape.
2. Add the source to `SOURCES` if it isn't already there. Use a key that describes the source (`waymoSafety`, not `waymoLink`).
3. Add the row to `NINES_SCALE_DATA`. Sort order in the array doesn't matter — the ladder sorts safest-first at render time.
4. Decide if the row deserves a stat-card spot. If yes, also update `HOME_STATS` (or the relevant page's stats).
5. If the new metric is a different *kind* of event (new column on AV vs Humans, new severity bucket on Waymo), update `CRASH_RATES` or `WAYMO_CRASH_REDUCTION` too.

### Adding a row from a regulator report (e.g. NHTSA bulletin)
- Add to `SOURCES` with `type: "regulator"` if not already there.
- The `Note` block conventions on the Comparison and Waymo pages already explain that AV crash data is reported more completely than human data — re-use that framing rather than restating it on the new row.

### Adding a row from a self-reported company release
- Same as above but with `type: "company"`.
- If the methodology is unusual (e.g. only counts high-severity crashes, only highway miles), add a sentence to the relevant `Note` block in the dashboard.

### Adding a row from a crowdsourced tracker
- Same as above but with `type: "crowdsource"`.
- Always pair with an independent comparison if one exists. The site's pattern: show the crowdsourced number in `NINES_SCALE_DATA`, then add the independent number as a separate row at the same `category` (the v12.5 AMCI vs. v12.5 Crowdsourced pair is the model).

### Adding a regulator-blocker / regulatory milestone
- `REGULATORY_BARRIERS` for ongoing blockers (with `status: "achieved" | "partial" | "blocked"`).
- `EXPERT_TIMELINES` for forecast dates.
- `MUSK_PREDICTIONS` for individual claims-vs-reality tracking.

### Updating page copy (titles, subtitles)
Edit `PAGES` in `data.js`. Don't edit JSX strings on the home page or section subtitles.

---

## Adding shapes that don't exist yet

The data shapes in `data.js` cover what we track today, but we deliberately want to be nimble when something new comes out. Two paths:

### Option A — fits an existing shape
If a new release looks like a "system + miles per event + source" (which most safety data is), add it to `NINES_SCALE_DATA`. If it's "metric + Waymo number + Human number," add it to `CRASH_RATES` or `WAYMO_CRASH_REDUCTION`. **Reach for an existing shape before inventing a new one.**

### Option B — needs a new shape
If you have data that genuinely doesn't fit (e.g. a per-state regulatory map, a video-evidence table, a public-trust survey time series):

1. Add a new export to `data.js` with a clear name and shape comment.
2. Add a new `<Section>` to the relevant page in `src/pages/`.
3. Render it. Keep the shape simple — `{ label, value, source }` is fine for most lists.
4. Add the new shape to "What's in `data.js`" above so the next person knows it exists.

The dashboard does NOT enforce any particular shape; the structured data file is a **convention, not a schema**. If a shape is the wrong fit for a new piece of data, change it. The hero/ladder is the only data set with a fixed contract (the chart math depends on `miles`, `event` and `category`).

### When NOT to add data
- **Numbers without a source.** Always include a citation, even if it's a press article that summarizes the underlying study.
- **Numbers that need a long explanation to be honest.** Either include the explanation as a `Note` block, or don't add the number.
- **Cross-system claims of "X is N× safer than Y" where the metrics aren't comparable.** This is the whole reason `event` is on every row of `NINES_SCALE_DATA` — disengagements aren't crashes aren't fatalities. The `relToHuman()` helper that prints `360× safer` only does so against a fixed human-crash baseline.

---

## Things that are still inline (intentionally)

Some content lives in the JSX, not `data.js`, because it's prose-shaped rather than data-shaped:

- **The Note blocks** under each section. They explain methodology and caveats; they're tied to specific UI placement.
- **The `Caveats` lists** on the Tesla page — one short, sourced line each. Same reasoning as Note blocks; keep each caveat to one line.
- **The "key insight" callout** on the Overview page. It cites the ~360× gap multiplier — when that changes in data.js, also update the callout.
- **Section titles and subtitles** for the in-page `<Section>` blocks. Page-level titles are in `PAGES` in data.js; section-level subtitles are still inline in `src/pages/*.jsx`.

If you're updating a key Overview number (Tesla FSD best, human baseline, gap multiplier), search `src/pages/` for the value as well — the key-insight callout and the crash-table footnote use the same numbers.

---

## Design rules

These were settled on the design canvas and apply to every chart:

- **Shapes, not just colors, tell series apart** (accessibility). Tesla / owner-reported = circle, Waymo = square, human drivers = diamond, independent test = triangle. Use `Marker` and `Legend` from `src/charts/parts.jsx`; every multi-series chart gets a legend showing the shapes.
- **No good/bad coloring of values.** Numbers are white; readers judge better or worse. (The ladder's "N× safer/worse" column and Waymo's "↓ N% fewer" are the exceptions, and both spell it out in words.)
- **No reference lines that don't carry information** — e.g. no "1× = no change" tick when every bar is an improvement.
- **One typeface:** IBM Plex Sans, no mono fonts. Tabular figures (`NUM`) only where numbers line up in a column. Minimum text size 11px.
- **Takeovers = crashes.** A critical takeover counts as crash-equivalent, so disengagement rates are compared with the human crash rate. Multipliers are rounded to two significant figures.
- **Phones:** every chart has a layout for widths under 720px (`useNarrow`). Check 375px and 320px with no sideways scroll.
