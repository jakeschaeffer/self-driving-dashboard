// Tesla FSD — version progress, supervised vs. robotaxi, prediction track record.
import {
  TESLA_STATS, TESLA_VERSION_PROGRESS, TESLA_FSD_SUPERVISED, TESLA_ROBOTAXI,
  TESLA_PROJECTION, TESLA_SAFETY_TENSION, MUSK_PREDICTIONS, SOURCES,
} from "../../data.js";
import { MONO, CARD, useNarrow, Src, SourceLine, Note, StatCards, Section, HBarList } from "../ui.jsx";

export default function Tesla() {
  const narrow = useNarrow();
  const max = TESLA_VERSION_PROGRESS.reduce((m, d) => Math.max(m, d.milesPerIntervention), 0);
  const versionRows = TESLA_VERSION_PROGRESS.map((d, i) => ({
    label: d.version,
    // Rows measured in "city miles" are marked — they are not necessarily the
    // same measure as the earlier tracker averages.
    sub: d.metric ? d.date + " · city mi" : d.date,
    display: d.milesPerIntervention.toLocaleString(),
    pct: (d.milesPerIntervention / max) * 100,
    color: "hsl(" + (35 + i * 8) + ", 90%, " + (50 + i * 4) + "%)",
  }));

  return (
    <div>
      <StatCards stats={TESLA_STATS} />

      <Section title="Version-over-version improvement" subtitle="Miles between critical disengagements, crowdsourced. The last two rows are city miles and the trend has turned.">
        <HBarList rows={versionRows} />
        <SourceLine>
          Sources: <Src href={SOURCES.teslaTracker.url}>teslafsdtracker.com</Src> (crowdsourced){" · "}
          v14.1 and v14.2 via <Src href={SOURCES.gljTracker.url}>{SOURCES.gljTracker.label}</Src>
        </SourceLine>
        <Note>
          Crowdsourced data skews optimistic — enthusiast drivers in favorable conditions.
          Independent testing by <Src href={SOURCES.electrekAmci.url}>AMCI</Src> on
          standardized routes found just 13 miles between interventions on v12.5.
          <br /><br />
          <strong style={{ color: "#fbbf24" }}>The trend reversed.</strong> The same tracker, as read by GLJ Research,
          shows <strong>city</strong> miles per critical disengagement peaking at <strong>4,109</strong> on v14.1
          (Oct 2025) and falling to <strong>809</strong> on v14.2 (Mar 2026). Those two figures are explicitly city
          miles and may not be the same measure as the 1,454-mile v14 average above, so they are labelled separately
          rather than merged into the series. No v14.3 tracker figure has been published — the tracker's dashboard is
          not machine-readable and the most recent citable reading is March 2026.
        </Note>
        <div style={{ marginTop: "16px", padding: "16px 20px", background: "rgba(251,191,35,0.05)", border: "1px solid rgba(251,191,35,0.12)", borderRadius: "8px" }}>
          <div style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: 1.7 }}>
            <strong style={{ color: "#fbbf24" }}>What {TESLA_PROJECTION.multiplier} per version would have implied:</strong>
            <br />{TESLA_PROJECTION.projections}
            <br /><span style={{ color: "#64748b" }}>{TESLA_PROJECTION.caveat}</span>
          </div>
        </div>
      </Section>

      <Section
        title="Two readings of the same system"
        subtitle="Tesla's self-reported collision rate and the regulator's crash count tell opposite stories, on different denominators and different crash definitions."
      >
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: "14px" }}>
          {TESLA_SAFETY_TENSION.map((col, i) => (
            <div key={i} style={{ ...CARD, border: "1px solid " + col.accent + "20", padding: "18px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: col.accent }}>{col.title}</div>
              <div style={{
                fontSize: "9px", color: "#4b5563", fontFamily: MONO, letterSpacing: "0.08em",
                textTransform: "uppercase", marginTop: "3px", marginBottom: "12px",
              }}>{col.kind}</div>
              {col.rows.map((row, j) => (
                <div key={j} style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                  <span style={{ color: "#64748b" }}>{row.label}</span>
                  <span style={{ color: "#cbd5e1", fontFamily: MONO, textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ marginTop: "10px" }}>
                {col.sources.map((s, k) => (
                  <span key={k}>
                    {k > 0 && <span style={{ color: "#374151", fontSize: "11px" }}>{" · "}</span>}
                    <Src href={s.url}>{s.label}</Src>
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "11px", color: "#8b94a5", lineHeight: 1.6, marginTop: "12px" }}>
                {col.rebuttal}{" "}
                (<Src href={col.rebuttalSource.url}>{col.rebuttalSource.label}</Src>)
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Supervised FSD vs. Robotaxi" subtitle="Two different products with different safety records.">
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: "14px" }}>
          <div style={{ ...CARD, padding: "18px", minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "12px" }}>FSD Supervised (consumer)</div>
            {TESLA_FSD_SUPERVISED.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                <span style={{ color: "#64748b" }}>{row.label} {row.source && <Src href={row.source.url}>{row.source.label}</Src>}</span>
                <span style={{ color: "#cbd5e1", fontFamily: MONO }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ ...CARD, border: "1px solid rgba(239,68,68,0.12)", padding: "18px", minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", marginBottom: "12px" }}>Robotaxi (unsupervised)</div>
            {TESLA_ROBOTAXI.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                <span style={{ color: "#64748b", minWidth: 0 }}>{row.label} {row.source && <Src href={row.source.url}>{row.source.label}</Src>}</span>
                <span style={{ color: "#fca5a5", fontFamily: MONO, textAlign: "right", minWidth: 0 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <Note>
          Tesla fully redacted robotaxi crash details from NHTSA filings until <Src href={SOURCES.electrekUnredact.url}>May 2026</Src>; narratives are now public.
          <Src href={SOURCES.nhtsaEa26002.url}>EA26002</Src> was upgraded from a preliminary evaluation to an engineering
          analysis in Mar 2026 — the last step before a recall. No FSD recall has been issued.
          The SF Bay Area service is <strong>not driverless</strong>: a human safety driver is in the seat, Tesla holds only a
          CPUC limousine permit and has not applied for a driverless permit
          (<Src href={SOURCES.electrekCpuc.url}>{SOURCES.electrekCpuc.label}</Src>).
          Tesla's <Src href={SOURCES.teslaSafety.url}>Vehicle Safety Report</Src> is now an FSD report:
          the quarterly Autopilot miles-per-crash series was retired after Q3 2025
          (<Src href={SOURCES.teslaratiApQ3.url}>{SOURCES.teslaratiApQ3.label}</Src>), and Autopilot itself was dropped from
          new North American vehicles in Jan 2026 (<Src href={SOURCES.driveTeslaApEnd.url}>{SOURCES.driveTeslaApEnd.label}</Src>),
          so no current Autopilot figure exists.
          The 13.38B cumulative FSD miles come from Tesla's own live counter, which its footnote describes as incrementing
          at the fleet's average rate rather than measuring, and which excludes China
          (<Src href={SOURCES.teslaFsdSafety.url}>{SOURCES.teslaFsdSafety.label}</Src>).
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
