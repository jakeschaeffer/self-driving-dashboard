// Waymo — miles growth, crash reduction by severity, incidents.
import { WAYMO_STATS, WAYMO_CRASH_REDUCTION, WAYMO_MILES_TIMELINE, WAYMO_INCIDENTS, SOURCES } from "../../data.js";
import { VIZ, CARD, Src, SourceLine, Note, StatCards, Section } from "../ui.jsx";
import MilesTimeline from "../charts/MilesTimeline.jsx";
import SeverityCards from "../charts/SeverityCards.jsx";

export default function Waymo() {
  return (
    <div>
      <StatCards stats={WAYMO_STATS} />

      <Section title="Cumulative driverless miles" subtitle="Rider-only miles, no safety driver.">
        <MilesTimeline data={WAYMO_MILES_TIMELINE} />
        <SourceLine>Source: <Src href={SOURCES.waymoSafety.url}>Waymo Safety Impact</Src></SourceLine>
      </Section>

      <Section title="Crash rates by severity" subtitle="Incidents per million miles vs. the human benchmark.">
        <SeverityCards items={WAYMO_CRASH_REDUCTION} />
        <SourceLine>
          Sources: <Src href={SOURCES.kusano2025.url}>Kusano et al. 2025</Src>{" · "}
          <Src href={SOURCES.swissRe.url}>Swiss Re Dec 2024</Src>
        </SourceLine>
        <Note>
          Swiss Re compared Waymo against newer vehicles (2018–2021) with ADAS — the fairest human benchmark available.
          Human crash data underreports minor incidents by ~60% (<Src href={SOURCES.nhtsa.url}>NHTSA</Src>),
          while AVs report virtually every contact event.
        </Note>
      </Section>

      <Section title="Limitations & incidents">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {WAYMO_INCIDENTS.map((item, i) => (
            <div key={i} style={{
              ...CARD, borderRadius: "6px",
              display: "flex", gap: "12px", padding: "10px 14px",
              borderLeft: "3px solid " + (item.severity === "high" ? "#ef4444" : item.severity === "medium" ? "#f59e0b" : "#3b82f6"),
            }}>
              <div style={{ fontSize: "11px", color: VIZ.muted, minWidth: "65px" }}>{item.date}</div>
              <div style={{ flex: 1, fontSize: "12px", color: "#b0b8c4" }}>
                {item.text}
                {item.source && <span style={{ marginLeft: "6px" }}><Src href={item.source.url}>{item.source.label}</Src></span>}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
