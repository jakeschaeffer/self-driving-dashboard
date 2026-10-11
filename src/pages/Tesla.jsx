// Tesla FSD — one visual per question, each with its caveats underneath:
// disengagement trend (crowdsourced vs. independent vs. target), crash rate
// (Tesla's headline vs. like-for-like comparisons), robotaxi tiles, and the
// prediction track record.
import { Fragment } from "react";
import {
  TESLA_VERSION_PROGRESS, TESLA_INDEPENDENT_TESTS, TESLA_UNSUPERVISED_TARGET,
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
          { text: "Tesla collects this metric but doesn't publish it. No data yet for v14.3 or v15.", source: SOURCES.electrekFeedback },
          { text: "Tesla's “25,000 miles without touching the wheel” is one owner's streak, not a fleet rate.", source: SOURCES.streak25k },
          { text: "Target: Tesla AI chief's stated bar for unsupervised.", source: TESLA_UNSUPERVISED_TARGET.source },
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
            { text: "Fleet counts are crowdsourced sightings; Tesla publishes none.", source: SOURCES.robotaxiTracker },
            { text: "Crash rate uses data through Jan 2026, mostly with safety monitors aboard; no newer rate has been published.", source: SOURCES.fortune },
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
