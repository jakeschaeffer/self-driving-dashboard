# DATA.md

The data this site shows lives in **`data.js`**. The dashboard imports from there and renders it. If you want to change a number, add a row, or swap a citation, that's the only file you need to touch — no JSX edits required for routine updates.

The UI lives in `src/`: `src/App.jsx` (shell + hash-routed tab nav), `src/ui.jsx` (shared primitives and the custom chart components — no charting library), and one file per tab in `src/pages/`.

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

### `CAT_COLORS`
Visual palette for the hero ladder. Three families (`tesla`, `waymo`, `human`), each an array of shades indexed by `intensity`. New rows in `NINES_SCALE_DATA` pick a color by `(category, intensity)`.

### `NINES_SCALE_DATA` — the hero ladder
The main visualization on the landing page. Every row is one safety data point on the log scale of miles between events.

Shape:
```js
{
  nines: 3.2,                    // log10(miles)
  miles: 1454,                   // canonical number
  label: "Tesla FSD v14",        // system name
  sublabel: "Crowdsourced average",
  event: "disengagement",        // disengagement | crash | injury crash | serious injury | fatal crash
  category: "tesla",             // tesla | waymo | human
  intensity: 3,                  // index into CAT_COLORS[category]
  isBaseline: true,              // optional — true for human rows
  source: SOURCES.teslaTracker,
}
```

### Stat cards (per page)
- `HOME_STATS` — the four cards above the ladder
- `WAYMO_STATS` — Waymo deep dive
- `TESLA_STATS` — Tesla FSD deep dive

Shape: `{ label, value, sublabel, accent, source }`. `value` is a string (we keep formatting like `"50M mi"` or `"~460×"`).

### `CRASH_RATES`
Table on the Overview page (below the ladder). Every value is a string of miles between events; `waymoGood`/`teslaGood` flag whether each system outperforms the human average (`true` = green, `false` = amber/red, `null` = no comparable data, renders as em-dash).

### `WAYMO_CRASH_REDUCTION`
By-severity comparison on the Waymo page. Numbers are incidents per million miles (IPMM), self-reported by Waymo except the Swiss Re property-damage row. `waymo`/`human` may be `null` where the publisher gives a reduction percentage but no underlying rate — `PairStatGrid` then shows the reduction alone instead of inventing a denominator. Each row carries its own `source`.

### `WAYMO_IIHS_STUDY`
The independent IIHS analysis (Eric Teoh, published 2026-07-23) — its own section on the Waymo page. Deliberately kept separate from `WAYMO_CRASH_REDUCTION`: different mileage base (~50M miles, 2021–2024), different period, different crash definition. `{ headline[], rate, byCity[], basis, caveats, source, caveatSource }`. `byCity[].change` is signed — Austin is `+4` (worse) and renders red. Keep it that way; dropping the one city where Waymo lost would make the block dishonest.

### `WAYMO_MILES_TIMELINE`
Cumulative driverless miles by year (in millions). Drives the bar chart on the Waymo page.

### `WAYMO_INCIDENTS`
Known limitations and incidents. `severity` is `"high" | "medium" | "info"`. `source` is optional — the two "Ongoing" entries don't cite a single article.

### `TESLA_VERSION_PROGRESS`
Version-over-version improvement. Drives the horizontal-bar list (`HBarList` in `src/ui.jsx`) on the Tesla page. The optional `metric` field marks rows the source describes as *city* miles per critical disengagement (v14.1, v14.2 — GLJ Research citing teslafsdtracker.com); those rows render with a `· city mi` qualifier. Do not merge them with the unqualified tracker averages, and do not read the series as monotonic: it peaks at 4,109 (v14.1, Oct 2025) and falls to 809 (v14.2, Mar 2026).

### `TESLA_FSD_SUPERVISED` / `TESLA_ROBOTAXI`
Side-by-side fact lists. Each row is `{ label, value, source? }` — sources render inline next to the label. Labels are `white-space: nowrap` in the Robotaxi card, so keep them short and let long text live in `value`, which wraps.

### `TESLA_SAFETY_TENSION`
The two-column "Two readings of the same system" block on the Tesla page: Tesla's self-reported collision rate against NHTSA's Standing General Order crash counts. Each column is `{ title, kind, accent, rows[], sources[], rebuttal, rebuttalSource }`. The `rebuttal` is not optional decoration — a self-reported number carries the independent critique (Koopman) and the regulator's raw count carries Tesla's normalization objection. Don't render one column without the other.

### `TESLA_PROJECTION`
The extrapolation callout under the version chart. `{ multiplier, projections, caveat }` — three strings. As of Aug 2026 the ~2.7×-per-version trend has reversed, so the callout is framed as what the rate *would have* implied and the `caveat` carries the reversal.

### `MUSK_PREDICTIONS`
Track record of public claims vs. what shipped. `{ year, claim, result, source }`.

### `TARGET_THRESHOLDS`
The "How safe is safe enough?" block on the Road to Steeringless page. `{ nines, label, description, color }`. The miles-per-event value is computed as `10^nines` so updating `nines` is enough.

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
1. Find the row in `data.js`. For the home/ladder, that's `NINES_SCALE_DATA`. For the Tesla page version chart, `TESLA_VERSION_PROGRESS`. For stat cards, the corresponding `*_STATS` array.
2. Change `miles`, `nines` (= `Math.log10(miles)` rounded to one decimal), and `label`/`sublabel` if the version changed.
3. Bump `SITE.lastUpdated`.
4. Visually verify all five tabs at desktop and 320px mobile.

### Adding a brand-new row to the ladder
For a data point we haven't tracked before (e.g. a Cruise number, or a new Waymo metric):

1. Pick the `category` (`tesla` | `waymo` | `human`) and an `intensity` index. Intensity is just an index into `CAT_COLORS[category]` — if you add a row that needs a fresh shade, append a new color to that array. Existing rows pick their colors automatically.
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
2. Add a new `<Section>` to the relevant page file in `src/pages/` (`Overview.jsx`, `Waymo.jsx`, `Tesla.jsx`, `Others.jsx`, `Steeringless.jsx`).
3. Render it. Keep the shape simple — `{ label, value, source }` is fine for most lists.
4. Add the new shape to "What's in `data.js`" above so the next person knows it exists.

The dashboard does NOT enforce any particular shape; the structured data file is a **convention, not a schema**. If a shape is the wrong fit for a new piece of data, change it. The hero/ladder is the only data set with a fixed contract (the chart math depends on `nines`, `category`, `intensity`).

### When NOT to add data
- **Numbers without a source.** Always include a citation, even if it's a press article that summarizes the underlying study.
- **Numbers that need a long explanation to be honest.** Either include the explanation as a `Note` block, or don't add the number.
- **Cross-system claims of "X is N× safer than Y" where the metrics aren't comparable.** This is the whole reason `event` is on every row of `NINES_SCALE_DATA` — disengagements aren't crashes aren't fatalities. The `relToHuman()` helper that prints `360× safer` only does so against a fixed human-crash baseline.

---

## Things that are still inline (intentionally)

Some content lives in the JSX, not `data.js`, because it's prose-shaped rather than data-shaped:

- **The Note blocks** under each section. They explain methodology and caveats; they're tied to specific UI placement.
- **The "key insight" callout** on the Overview page. It cites *both* gap multipliers, with their denominators spelled out: `529K ÷ 1,454 ≈ 360×` (the human crash average, which is also what the ladder's vs-Human column uses — `relToHuman()` in `Overview.jsx` divides by `HUMAN_MILES`, read off the baseline row, rather than by the rounded `nines`) and `670K ÷ 1,454 ≈ 460×` (Elluswamy's unsupervised target, which is what the `HOME_STATS`/`TESLA_STATS` gap cards use). They are not in conflict, but they only read that way if both denominators stay visible. If the Tesla figure changes, recompute both.
- **The crash-table footnote** on the Overview page. It carries the circumstances of the single Waymo fatality; `CRASH_RATES` only has room for the string `"1 fatality*"`, and the number is meaningless without the footnote.
- **Section titles and subtitles** for the in-page `<Section>` blocks. Page-level titles are in `PAGES` in data.js; section-level subtitles are still inline in `src/pages/*.jsx`.

If you're updating a key Overview number (Tesla FSD best, human baseline, gap multiplier), search `src/pages/` for the value as well — the key-insight callout and the crash-table footnote use the same numbers.

### A note on rounding published figures
Waymo's Jun 2026 update gives its serious-injury rate as `0.01` crashes per million miles against a `0.23` benchmark. One significant figure spans 67M–200M miles per event, and the "47 fewer crashes" framing in the same release implies something closer to 60–75M — the published values are too coarse to support a precise miles-between-events number. The site therefore keeps its earlier **50M mi per serious injury crash** and dates it (`as of early 2026`) rather than restating it upward. Prefer this move — add the as-of date, keep the number — over deriving a precise figure from a rounded one.
