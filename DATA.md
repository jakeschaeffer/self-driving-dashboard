# DATA.md

The data this site shows lives in **`data.js`**. The dashboard imports from there and renders it. If you want to change a number, add a row, or swap a citation, that's the only file you need to touch — no JSX edits required for routine updates.

The UI lives in `src/` (no charting library; every chart is hand-built):

```
src/
  main.jsx            entry point: loads global CSS, mounts <App/>
  App.jsx             shell: header, current page, footer (hash routing: #waymo, #tesla…)
  styles/tokens.css   design tokens: every color and font, light + dark themes
  styles/base.css     plain-HTML defaults (body, headings, focus ring)
  lib/                plain helpers: number formatting, comparisons, React hooks
  components/         building blocks shared by several pages (Section, StatStrip,
                      SourceTag, Note, Pill, FactSheet, header/footer, tables)
  pages/<page>/       one folder per tab: the page plus the charts only it uses
```

Every component has a sibling `*.module.css` file (a **CSS Module**: Vite scopes its class names to that one component, so styles can't leak between pages). Components never write raw colors; they use the tokens in `styles/tokens.css`, which is how light/dark mode works.

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

`type` is rendered as a small trust-tier tag next to every source link (GOV, PEER, SELF, CROWD, PRESS; see `src/components/SourceTag.jsx`), and the footer explains the tags. Give every source a `type`, inline ones included. See [Source-quality conventions](#source-quality-conventions).

### `SITE`
- `lastUpdated`: shown in the header and footer. Bump whenever data changes.
- `asOf`: the same date as `"YYYY-MM"`. Charts use it as "today" (the Now line on the Tesla chart, the Today marker on the promises timeline).

### `PAGES`
The five top-level tabs (Overview, Waymo, Tesla FSD, Others, Road to Steeringless). Each entry has `{ id, nav, title, sub, eyebrow? }`. `nav` is the short label in the tab bar; `title` is the page heading; `sub` is the paragraph under the heading. Tabs are hash-routed (`#waymo`, `#tesla`, …) so they can be deep-linked.

### `SAFETY_POINTS` — the road chart
The main visualization on the Overview page: a log-scale "road" with one lane per `category`. Distance along the road is miles between events.

Shape:
```js
{
  id: "tesla-v14",               // unique and stable
  miles: 1454,                   // the only number the chart needs
  label: "Tesla FSD v14",        // full name (tooltip readout, table)
  short: "v14",                  // compact name drawn next to the marker
  sublabel: "Crowdsourced average",
  event: "disengagement",        // a key of EVENT_TYPES
  category: "tesla",             // tesla | waymo | human (picks the lane)
  source: SOURCES.teslaTracker,
}
```
Disengagements draw as hollow markers; crashes, injuries and fatalities draw filled. Colors come from the theme, so there is nothing color-related to set.

### `EVENT_TYPES` / `HUMAN_BENCHMARKS`
`EVENT_TYPES` lists the kinds of event a row can count, and which human rate each is compared against (injury crashes vs. the human injury-crash rate, and so on). Disengagements have no human equivalent, so they are compared with the human crash rate and flagged as approximate. `HUMAN_BENCHMARKS` is built automatically from the `category: "human"` rows of `SAFETY_POINTS`, so each human number lives in one place.

### Stat cards (per page)
- `HOME_STATS` — the four cards above the ladder
- `WAYMO_STATS` — Waymo deep dive
- `TESLA_STATS` — Tesla FSD deep dive

Shape: `{ label, value, sublabel, series?, source }`. `value` is a string (we keep formatting like `"50M mi"` or `"~460×"`). `series` (`"tesla" | "waymo" | "human"`) adds a small color key so a tile matches the charts.

### `CRASH_RATES`
The "Like for like" table on the Overview page. `CRASH_RATES_FOOTNOTE` is the line under it that explains the `*` cells. Every value is a string of miles between events; `waymoGood`/`teslaGood` flag whether each system outperforms the human average (`true` = ▲ green, `false` = ▼ red, `null` = no comparable data, renders as em-dash). On phones the table stacks into one block per row.

### `WAYMO_CRASH_REDUCTION`
By-severity comparison on the Waymo page. Numbers are incidents per million miles.

### `WAYMO_MILES_TIMELINE`
Cumulative driverless miles (in millions), `{ date: "YYYY-MM", period, miles }`. `date` places the point on a true time axis in the Waymo "odometer" chart; `period` is its label.

### `WAYMO_INCIDENTS`
Known limitations and incidents. `severity` is `"high" | "medium" | "info"`. `source` is optional — the two "Ongoing" entries don't cite a single article.

### `TESLA_VERSION_PROGRESS`
Version-over-version improvement, `{ version, date: "YYYY-MM", milesPerIntervention }`. Drives the log-scale trend chart on the Tesla page (`src/pages/tesla/VersionTrend.jsx`).

### `TESLA_TARGET` / `TESLA_INDEPENDENT_TESTS` / `TESLA_PROJECTION`
`TESLA_TARGET` is the dashed target line (Tesla's own unsupervised bar). `TESLA_INDEPENDENT_TESTS` are non-crowdsourced results drawn as hollow markers. `TESLA_PROJECTION.fromVersion` picks where the trend's yearly growth rate is measured from; the chart extends that rate to the target and computes the date itself, so there is no projection text to keep in sync.

### `TESLA_FSD_SUPERVISED` / `TESLA_ROBOTAXI`
Side-by-side fact lists. Each row is `{ label, value, source? }` — sources render inline next to the label.

### `MUSK_PREDICTIONS`
Track record of public claims vs. what shipped: `{ said, due, done, claim, result, source }`. `said`/`due`/`done` are years; `done` is `null` if it still hasn't happened. The Tesla page draws each as a timeline: promise window, then the overdue stretch.

### `TARGET_THRESHOLDS`
The "How safe is safe enough?" exit signs on the Road to Steeringless page. `{ miles, label, description }`. The "× the human rate" and "a crash once every N years" lines are computed from `miles`.

### `REGULATORY_BARRIERS`
Non-technical blockers. `status` is `"achieved" | "partial" | "blocked"` and drives the chip color.

### `EXPERT_TIMELINES`
Consensus dates from McKinsey/S&P/WEF/BCG. `year` is a string so it can be `"Now"`, `"~2028"`, `"2040s–60s"`, etc. `tone` is `"good" | "neutral" | "caution" | "far"`; the theme picks its color.

### `OTHERS_STATS` / `OTHER_PLAYERS`
The Others page. `OTHER_PLAYERS` rows are `{ company, status, scale, detail, source }` where `status` is `"driverless" | "supervised" | "testing" | "dead"` (the page groups companies by it) and `scale` is whatever headline number that company discloses — rides, fleet size, or miles. They are intentionally NOT comparable across companies; the Note on the page says so.

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
1. Find the row in `data.js`. For the Overview road, that's `SAFETY_POINTS`. For the Tesla page version chart, `TESLA_VERSION_PROGRESS`. For stat cards, the corresponding `*_STATS` array.
2. Change `miles` (and `label`/`short`/`sublabel` if the version changed). Everything else is computed from `miles`.
3. Bump `SITE.lastUpdated`.
4. Visually verify all five tabs at desktop and 390px mobile, in light and dark mode.

### Adding a brand-new row to the road
For a data point we haven't tracked before (e.g. a Cruise number, or a new Waymo metric):

1. Pick the `category` (`tesla` | `waymo` | `human`) and an `event` from `EVENT_TYPES`. Give it a unique `id` and a `short` label (a few words; it sits next to the marker).
2. Add the source to `SOURCES` if it isn't already there. Use a key that describes the source (`waymoSafety`, not `waymoLink`).
3. Add the row to `SAFETY_POINTS`. Order doesn't matter; the chart places and de-collides labels itself.
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
- Always pair with an independent comparison if one exists. The site's pattern: show the crowdsourced number in `SAFETY_POINTS`, then add the independent number as a separate row at the same `category` (the v12.5 AMCI vs. v12.5 Crowdsourced pair is the model), and add it to `TESLA_INDEPENDENT_TESTS` if it's Tesla.

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
If a new release looks like a "system + miles per event + source" (which most safety data is), add it to `SAFETY_POINTS`. If it's "metric + Waymo number + Human number," add it to `CRASH_RATES` or `WAYMO_CRASH_REDUCTION`. **Reach for an existing shape before inventing a new one.**

### Option B — needs a new shape
If you have data that genuinely doesn't fit (e.g. a per-state regulatory map, a video-evidence table, a public-trust survey time series):

1. Add a new export to `data.js` with a clear name and shape comment.
2. Add a new `<Section>` to the relevant page in `src/pages/<page>/`.
3. Render it. Keep the shape simple — `{ label, value, source }` is fine for most lists.
4. Add the new shape to "What's in `data.js`" above so the next person knows it exists.

The dashboard does NOT enforce any particular shape; the structured data file is a **convention, not a schema**. If a shape is the wrong fit for a new piece of data, change it. The road chart is the only data set with a fixed contract (the chart math depends on `miles`, `category`, `event`).

### When NOT to add data
- **Numbers without a source.** Always include a citation, even if it's a press article that summarizes the underlying study.
- **Numbers that need a long explanation to be honest.** Either include the explanation as a `Note` block, or don't add the number.
- **Cross-system claims of "X is N× safer than Y" where the metrics aren't comparable.** This is the whole reason `event` is on every row of `SAFETY_POINTS`: disengagements aren't crashes aren't fatalities. `compareToHuman()` in `src/lib/compare.js` compares each row with the human rate for the same event, and marks disengagement comparisons as approximate.

---

## Things that are still inline (intentionally)

Some content lives in the JSX, not `data.js`, because it's prose-shaped rather than data-shaped:

- **The Note blocks** under each section. They explain methodology and caveats; they're tied to specific UI placement.
- **The verdict sentence** on the Overview page is computed from `SAFETY_POINTS`, so it updates itself.
- **Section titles and subtitles** for the in-page `<Section>` blocks. Page-level titles are in `PAGES` in data.js; section-level subtitles are still inline in `src/pages/*.jsx`.

If you're updating a key Overview number (Tesla FSD best, human baseline, gap multiplier), also check `HOME_STATS` and `TESLA_STATS`, whose values are hand-written strings.
