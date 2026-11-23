// Tesla FSD — one visual per question, each with its caveats underneath:
// disengagement trend (crowdsourced vs. independent vs. target), crash rate
// (Tesla's headline vs. like-for-like comparisons), robotaxi tiles, and the
// prediction track record.
import { Fragment } from "react";
import {
  TESLA_VERSION_PROGRESS, TESLA_INDEPENDENT_TESTS, TESLA_UNSUPERVISED_TARGET, TESLA_V15_CLAIM,
  TESLA_FSD_COLLISIONS, TESLA_SAFETY_RATIOS, TESLA_ROBOTAXI_STATS,
  MUSK_PREDICTIONS, SOURCES,
} from "../../data.js";
import { MONO, CARD, VIZ, Src, Caveats, StatCards, Section } from "../ui.jsx";
import { Legend, DataTable } from "../charts/parts.jsx";
import LogTrendChart from "../charts/LogTrendChart.jsx";
import RatioBars from "../charts/RatioBars.jsx";

// "2024 Q3" → 2024.625: the middle of the quarter as a decimal year.
const quarterMid = (date) => {
  const [year, q] = date.split(" Q").map(Number);
  return year + (q - 0.5) / 4;
};
const miles = (n) => n.toLocaleString() + " mi";

const latest = TESLA_VERSION_PROGRESS[TESLA_VERSION_PROGRESS.length - 1];

const TREND_SERIES = [
  {
    id: "crowd", name: "Owner-reported", color: VIZ.accent, line: true,
    points: TESLA_VERSION_PROGRESS.map((d) => ({
      x: quarterMid(d.date), y: d.milesPerIntervention,
      value: miles(d.milesPerIntervention), label: `${d.version} · ${d.date} · owner-reported`,
      direct: d === latest ? { text: `${d.version} · ${d.milesPerIntervention.toLocaleString()}`, side: "left" } : null,
    })),
  },
  {
    id: "independent", name: "Independent test", color: VIZ.compare, line: false,
    points: TESLA_INDEPENDENT_TESTS.map((d) => ({
      x: quarterMid(d.date), y: d.milesPerIntervention,
      value: miles(d.milesPerIntervention), label: `${d.version} · ${d.date} · ${d.tester} test`,
      direct: { text: `${d.tester} · ${d.milesPerIntervention}`, side: "right" },
    })),
  },
];

const TREND_TABLE = [
  ...TESLA_VERSION_PROGRESS.map((d) => ({ who: "Owners", version: d.version, date: d.date, miles: d.milesPerIntervention.toLocaleString() })),
  ...TESLA_INDEPENDENT_TESTS.map((d) => ({ who: d.tester, version: d.version, date: d.date, miles: d.milesPerIntervention.toLocaleString() })),
  { who: "Target", version: "—", date: "—", miles: TESLA_UNSUPERVISED_TARGET.miles.toLocaleString() },
];

// Improvement per major version: first reading of each major version vs. the
// previous one, plus v15's claimed multiplier (drawn dashed — unverified).
const major = (v) => v.split(".")[0];
const FIRSTS = TESLA_VERSION_PROGRESS.filter((d, i, a) => i === 0 || major(d.version) !== major(a[i - 1].version));
const times = (r) => `${Number(r.toPrecision(2))}×`;
const JUMP_ROWS = [
  ...FIRSTS.slice(1).map((d, i) => {
    const prev = FIRSTS[i];
    const ratio = d.milesPerIntervention / prev.milesPerIntervention;
    return {
      label: `${prev.version} → ${d.version}`, sub: `${prev.date} – ${d.date}, owner-reported`,
      ratio, display: times(ratio), color: VIZ.accent,
      detail: `${prev.milesPerIntervention.toLocaleString()} → ${d.milesPerIntervention.toLocaleString()} mi per critical takeover`,
    };
  }),
  {
    label: `${latest.version} → ${TESLA_V15_CLAIM.version}`, sub: "Tesla's claim, no baseline published",
    ratio: TESLA_V15_CLAIM.multiplier, display: `${TESLA_V15_CLAIM.multiplier}×`, color: VIZ.accent, claim: true,
    detail: "Release notes: critical intervention rate improved 25×",
  },
];
const v15IfTrue = latest.milesPerIntervention * TESLA_V15_CLAIM.multiplier;
const JUMP_TABLE = JUMP_ROWS.map((r) => ({ jump: r.label, ratio: r.display, basis: r.detail }));

const RATIO_ROWS = TESLA_SAFETY_RATIOS.map((r) => ({
  ...r,
  display: r.approx ? `~${Math.round(r.ratio)}×` : `${r.ratio.toFixed(1)}×`,
  color: r.headline ? VIZ.accent : VIZ.compare,
}));

const C = TESLA_FSD_COLLISIONS;
const COLLISION_TABLE = [
  { mode: "FSD (Supervised)",          miles: C.fsd },
  { mode: "Manual, active safety on",  miles: C.manualActiveSafety },
  { mode: "Manual, active safety off", miles: C.manualNoActiveSafety },
  { mode: "US average",                miles: C.usAverage },
].map((r) => ({ ...r, miles: r.miles.toLocaleString() }));

const panel = { ...CARD, padding: "18px 20px 14px" };

export default function Tesla() {
  return (
    <div>
      <Section title="Disengagements" subtitle="Miles between critical takeovers on supervised FSD. Log scale.">
        <div style={panel}>
          <Legend items={TREND_SERIES.map((s) => ({ label: s.name, color: s.color }))} />
          <LogTrendChart
            series={TREND_SERIES}
            target={{ y: TESLA_UNSUPERVISED_TARGET.miles, label: TESLA_UNSUPERVISED_TARGET.label }}
            xDomain={[2023, 2026]}
            xTicks={[2023, 2024, 2025].map((y) => ({ x: y + 0.5, label: String(y) }))}
            yDomain={[1, 1e6]}
            ariaLabel="Tesla FSD miles per critical disengagement by version, log scale, versus the unsupervised target"
          />
          <DataTable
            columns={[{ key: "who", label: "Source" }, { key: "version", label: "Version" }, { key: "date", label: "Quarter" }, { key: "miles", label: "Miles", right: true }]}
            rows={TREND_TABLE}
          />
        </div>
        <Caveats items={[
          { text: "Owner-reported; skews optimistic.", source: SOURCES.teslaTracker },
          { text: "Tesla collects this metric but doesn't publish it.", source: SOURCES.electrekFeedback },
          { text: "v15 (Nov 2026): Tesla claims 25× fewer critical takeovers than v14; no baseline or data published.", source: SOURCES.teslaV15Notes },
          { text: "Tesla's “25,000 miles without touching the wheel” is one owner's streak, not a fleet rate.", source: SOURCES.streak25k },
          { text: "Target: Tesla AI chief's stated bar for unsupervised.", source: TESLA_UNSUPERVISED_TARGET.source },
        ]} />
      </Section>

      <Section title="Improvement per version" subtitle="How many times farther each major version went between critical takeovers.">
        <div style={panel}>
          <RatioBars rows={JUMP_ROWS} refLabel="1× = no improvement" />
          <DataTable
            columns={[{ key: "jump", label: "Version" }, { key: "ratio", label: "Gain", right: true }, { key: "basis", label: "Basis" }]}
            rows={JUMP_TABLE}
          />
        </div>
        <Caveats items={[
          { text: "Measured gains use the first owner-reported reading of each major version; early readings are noisy.", source: SOURCES.teslaTracker },
          { text: `v15's 25× is a claim. Applied to v14's ${latest.milesPerIntervention.toLocaleString()} mi it would be ~${Math.round(v15IfTrue / 1000)}K mi, still ~${Math.round(TESLA_UNSUPERVISED_TARGET.miles / v15IfTrue)}× short of the target.`, source: TESLA_V15_CLAIM.source },
        ]} />
      </Section>

      <Section title="Crash rate" subtitle="How much safer FSD looks depends on the comparison.">
        <div style={panel}>
          <RatioBars rows={RATIO_ROWS} />
          <DataTable
            columns={[{ key: "mode", label: `Miles per major collision, 12 mo. to ${C.asOf}` }, { key: "miles", label: "Miles", right: true }]}
            rows={COLLISION_TABLE}
          />
        </div>
        <Caveats items={[
          { text: "Tesla-reported, not independently audited.", source: C.source },
          { text: "10 of 11 safety researchers who reviewed the method for Reuters called it misleading; Tesla's fleet is also newer than average.", source: SOURCES.reutersFsd },
        ]} />
      </Section>

      <Section title="Robotaxi" subtitle="Unsupervised service.">
        <StatCards stats={TESLA_ROBOTAXI_STATS.map((s) => ({ ...s, accent: VIZ.text }))} />
        <div style={{ marginTop: "-16px" }}>
          <Caveats items={[
            { text: "Tesla-reported. Injuries count only crashes the robotaxi started; the human estimate counts all.", source: SOURCES.teslaRobotaxiSafety },
            { text: "Slow, geofenced driving: median crash speed 1 mph, none on highways.", source: SOURCES.electrekSgoNov },
          ]} />
        </div>
      </Section>

      <Section title="Predictions vs. reality">
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "12px 14px", marginTop: "16px" }}>
          {MUSK_PREDICTIONS.map((p, i) => (
            <Fragment key={i}>
              <div style={{ fontFamily: MONO, fontSize: "11px", color: VIZ.muted, paddingTop: "1px" }}>{p.year}</div>
              <div>
                <div style={{ fontSize: "12px", color: VIZ.text }}>{p.claim}</div>
                <div style={{ fontSize: "11px", color: VIZ.secondary, marginTop: "2px" }}>{p.result} <Src href={p.source.url}>{p.source.label}</Src></div>
              </div>
            </Fragment>
          ))}
        </div>
      </Section>
    </div>
  );
}
