// Waymo — miles growth, crash reduction by severity, incidents.
import {
  WAYMO_STATS, WAYMO_CRASH_REDUCTION, WAYMO_MILES_TIMELINE,
  WAYMO_INCIDENTS, WAYMO_IIHS_STUDY, SOURCES,
} from "../../data.js";
import { MONO, CARD, Src, SourceLine, Note, StatCards, Section, ColumnChart, PairStatGrid } from "../ui.jsx";

// The IIHS study is the only independent per-mile crash comparison the site
// carries, so it gets its own block rather than sitting next to Waymo's own
// numbers as if the two were measuring the same thing.
function IihsStudy() {
  const s = WAYMO_IIHS_STUDY;
  return (
    <div style={{ ...CARD, padding: "18px 20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {s.headline.map((h, i) => (
          <div key={i} style={{ flex: "1 1 150px", minWidth: "140px" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#22c55e", fontFamily: MONO, lineHeight: 1.1 }}>
              {"↓"} {h.reduction}%
            </div>
            <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>{h.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "10px",
      }}>
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#3b82f6", fontFamily: MONO }}>{s.rate.waymo}</span>
        <span style={{ fontSize: "11px", color: "#4b5563" }}>Waymo</span>
        <span style={{ fontSize: "12px", color: "#374151" }}>vs</span>
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#6b7280", fontFamily: MONO }}>{s.rate.human}</span>
        <span style={{ fontSize: "11px", color: "#4b5563" }}>human — {s.rate.unit}</span>
      </div>

      <div style={{ marginTop: "16px" }}>
        <div style={{
          fontSize: "9px", color: "#4b5563", fontFamily: MONO, letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: "8px",
        }}>By city</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {s.byCity.map((c, i) => {
            const better = c.change < 0;
            return (
              <div key={i} style={{
                flex: "1 1 120px", minWidth: "110px", padding: "8px 10px", borderRadius: "6px",
                background: better ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                border: "1px solid " + (better ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.22)"),
              }}>
                <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: MONO, color: better ? "#22c55e" : "#ef4444" }}>
                  {better ? "↓" + Math.abs(c.change) : "+" + c.change}%
                </div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                  {c.city}{c.note && <span style={{ color: "#ef4444" }}> · {c.note}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.6, marginTop: "14px" }}>{s.basis}</div>
    </div>
  );
}

export default function Waymo() {
  return (
    <div>
      <StatCards stats={WAYMO_STATS} />
      {/* Sits in the gap the stat cards leave; pulled up so it reads as their
          footnote rather than as a stray line above the next section. */}
      <div style={{ marginTop: "-22px", marginBottom: "30px", lineHeight: 1.6 }}>
        <SourceLine>
        11 metros with commercial service across 1,400+ sq mi
        (<Src href={SOURCES.waymoUpdates.url}>{SOURCES.waymoUpdates.label}</Src>{" · "}
        <Src href={SOURCES.electrekWaymo1400.url}>{SOURCES.electrekWaymo1400.label}</Src>),
        plus Las Vegas, Denver, San Diego and Tampa driverless but not yet open to the public
        (<Src href={SOURCES.waymoNewRoCities.url}>{SOURCES.waymoNewRoCities.label}</Src>).
        Alphabet cited “past 500,000” weekly rides at both its
        {" "}<Src href={SOURCES.alphabetQ1.url}>Q1</Src> and
        {" "}<Src href={SOURCES.alphabetQ2.url}>Q2</Src> 2026 calls — the run rate has not moved.
        </SourceLine>
      </div>

      <Section title="Cumulative driverless miles" subtitle="Rider-only miles, no safety driver. In millions.">
        <ColumnChart data={WAYMO_MILES_TIMELINE.map((d) => ({ label: d.period, value: d.miles, display: d.miles + "M" }))} />
        <SourceLine>Source: <Src href={SOURCES.waymoSafety.url}>Waymo Safety Impact</Src></SourceLine>
      </Section>

      <Section
        title="Independent verification — IIHS, July 2026"
        subtitle="The strongest non-company evidence on the site: an outside per-mile crash comparison, not Waymo's own analysis."
      >
        <IihsStudy />
        <SourceLine>
          Source: <Src href={WAYMO_IIHS_STUDY.source.url}>{WAYMO_IIHS_STUDY.source.label}</Src>
          {" — Eric Teoh, “Rise of the machines: crash experiences of highly automated vehicles and human drivers”"}
        </SourceLine>
        <Note>
          {WAYMO_IIHS_STUDY.caveats}{" "}
          (<Src href={WAYMO_IIHS_STUDY.caveatSource.url}>{WAYMO_IIHS_STUDY.caveatSource.label}</Src>)
        </Note>
      </Section>

      <Section title="Crash rates by severity" subtitle="Waymo's own figures — incidents per million miles vs. its human benchmark, over 220.6M rider-only miles through Mar 2026.">
        <PairStatGrid items={WAYMO_CRASH_REDUCTION} />
        <SourceLine>
          Sources: <Src href={SOURCES.waymoSafetyJun26.url}>Waymo, Jun 2026</Src>{" · "}
          <Src href={SOURCES.swissRe.url}>Swiss Re Dec 2024</Src>{" · "}
          <Src href={SOURCES.kusano2025.url}>Kusano et al. 2025</Src>
        </SourceLine>
        <Note>
          These are company self-reported figures: Waymo picks the human benchmark (same road types and geographies,
          surface streets, freeways excluded) and the reduction it reports for serious injuries has moved from 90% in
          Feb 2026 to 94% in Jun 2026. The serious-injury rate is published as 0.01 per million miles against a 0.23
          benchmark — one significant figure, which is too coarse to pin down a precise miles-between-events number,
          so the site keeps its earlier <strong>50M miles per serious injury crash</strong> and dates it to early 2026
          rather than restating it. Swiss Re compared Waymo against newer vehicles (2018–2021) with ADAS — the fairest
          human benchmark available. Human crash data underreports minor incidents by ~60%
          (<Src href={SOURCES.nhtsa.url}>{SOURCES.nhtsa.label}</Src>), while AVs report virtually every contact event.
        </Note>
      </Section>

      <Section title="Limitations & incidents" subtitle="Newest first.">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {WAYMO_INCIDENTS.map((item, i) => (
            <div key={i} style={{
              ...CARD, borderRadius: "6px",
              display: "flex", gap: "12px", padding: "10px 14px",
              borderLeft: "3px solid " + (item.severity === "high" ? "#ef4444" : item.severity === "medium" ? "#f59e0b" : "#3b82f6"),
            }}>
              <div style={{ fontSize: "10px", color: "#4b5563", minWidth: "65px", fontFamily: MONO }}>{item.date}</div>
              <div style={{ flex: 1, fontSize: "12px", color: "#b0b8c4" }}>
                {item.text}
                {item.source && <span style={{ marginLeft: "6px" }}><Src href={item.source.url}>{item.source.label}</Src></span>}
              </div>
            </div>
          ))}
        </div>
        <Note>
          The Dallas fatality is counted here because a Waymo made contact, not because Waymo caused it: the pedestrian
          had already been struck by an SUV and thrown into the Waymo's lane, and the Waymo had slowed to ~5 mph before
          contact. Brad Templeton's independent reconstruction reaches the same conclusion as the police preliminary
          findings (<Src href={SOURCES.templetonDallas.url}>{SOURCES.templetonDallas.label}</Src>).
          Recalls and open investigations are listed whether or not fault has been established — federal investigations
          routinely close without a finding.
        </Note>
      </Section>
    </div>
  );
}
