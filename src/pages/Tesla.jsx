// Tesla FSD — version progress, supervised vs. robotaxi, prediction track record.
import {
  TESLA_STATS, TESLA_VERSION_PROGRESS, TESLA_FSD_SUPERVISED,
  TESLA_ROBOTAXI, TESLA_PROJECTION, MUSK_PREDICTIONS, SOURCES,
} from "../../data.js";
import { MONO, CARD, useNarrow, Src, SourceLine, Note, StatCards, Section, HBarList } from "../ui.jsx";

export default function Tesla() {
  const narrow = useNarrow();
  const max = TESLA_VERSION_PROGRESS.reduce((m, d) => Math.max(m, d.milesPerIntervention), 0);
  const versionRows = TESLA_VERSION_PROGRESS.map((d, i) => ({
    label: d.version,
    sub: d.date,
    display: d.milesPerIntervention.toLocaleString(),
    pct: (d.milesPerIntervention / max) * 100,
    color: "hsl(" + (35 + i * 8) + ", 90%, " + (50 + i * 4) + "%)",
  }));

  return (
    <div>
      <StatCards stats={TESLA_STATS} />

      <Section title="Version-over-version improvement" subtitle="Miles between critical disengagements, crowdsourced.">
        <HBarList rows={versionRows} />
        <SourceLine>Source: <Src href={SOURCES.teslaTracker.url}>teslafsdtracker.com</Src> (crowdsourced)</SourceLine>
        <Note>
          Crowdsourced data skews optimistic — enthusiast drivers in favorable conditions.
          Independent testing by <Src href={SOURCES.electrekAmci.url}>AMCI</Src> on
          standardized routes found just 13 miles between interventions on v12.5.
        </Note>
        <div style={{ marginTop: "16px", padding: "16px 20px", background: "rgba(251,191,35,0.05)", border: "1px solid rgba(251,191,35,0.12)", borderRadius: "8px" }}>
          <div style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: 1.7 }}>
            <strong style={{ color: "#fbbf24" }}>If Tesla maintains {TESLA_PROJECTION.multiplier} improvement per version:</strong>
            <br />{TESLA_PROJECTION.projections}
            <br /><span style={{ color: "#64748b" }}>{TESLA_PROJECTION.caveat}</span>
          </div>
        </div>
      </Section>

      <Section title="Supervised FSD vs. Robotaxi" subtitle="Two different products with different safety records.">
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: "14px" }}>
          <div style={{ ...CARD, padding: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "12px" }}>FSD Supervised (consumer)</div>
            {TESLA_FSD_SUPERVISED.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                <span style={{ color: "#64748b" }}>{row.label} {row.source && <Src href={row.source.url}>{row.source.label}</Src>}</span>
                <span style={{ color: "#cbd5e1", fontFamily: MONO }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ ...CARD, border: "1px solid rgba(239,68,68,0.12)", padding: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", marginBottom: "12px" }}>Robotaxi (unsupervised)</div>
            {TESLA_ROBOTAXI.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                <span style={{ color: "#64748b", whiteSpace: "nowrap" }}>{row.label} {row.source && <Src href={row.source.url}>{row.source.label}</Src>}</span>
                <span style={{ color: "#fca5a5", fontFamily: MONO, textAlign: "right" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <Note>
          Tesla fully redacted robotaxi crash details from NHTSA filings until <Src href={SOURCES.electrekUnredact.url}>May 2026</Src>; narratives are now public.
          Tesla's quarterly <Src href={SOURCES.teslaSafety.url}>Vehicle Safety Reports</Src> count only high-severity events, predominantly on highways.
          The <Src href={SOURCES.iihs.url}>IIHS</Src>: little evidence that partial automation has safety benefits.
        </Note>
      </Section>

      <Section title="Musk timeline predictions" subtitle="Claims vs. reality.">
        <div>
          {MUSK_PREDICTIONS.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", padding: "10px 0 10px 14px", borderLeft: "2px solid rgba(239,68,68,0.25)" }}>
              <div style={{ fontSize: "11px", color: "#f59e0b", fontFamily: MONO, minWidth: "42px", fontWeight: 600 }}>{item.year}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#cbd5e1" }}>{item.claim}</div>
                <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px" }}>
                  {"❌"} {item.result} <Src href={item.source.url}>{item.source.label}</Src>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
