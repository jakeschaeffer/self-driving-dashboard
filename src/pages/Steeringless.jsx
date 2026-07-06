// Road to Steeringless — reliability thresholds, regulatory barriers, timelines.
import { TARGET_THRESHOLDS, REGULATORY_BARRIERS, EXPERT_TIMELINES, CHILD_SAFETY } from "../../data.js";
import { MONO, CARD, formatMiles, Src, Section } from "../ui.jsx";

const yearsPerCrash = (miles, annual = 14000) => {
  const y = miles / annual;
  if (y >= 100) return Math.round(y) + " yrs";
  if (y >= 1) return y.toFixed(1) + " yrs";
  return (annual / miles).toFixed(1) + "x/yr";
};

const STATUS_COLORS = {
  achieved: { bg: "rgba(34,197,94,0.12)", fg: "#22c55e" },
  partial: { bg: "rgba(251,191,35,0.12)", fg: "#fbbf24" },
  blocked: { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" },
};

export default function Steeringless() {
  return (
    <div>
      <Section title="How safe is safe enough?" subtitle="No regulator has published a threshold. These are inferred from expert commentary — each is miles between events.">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TARGET_THRESHOLDS.map((t, i) => (
            <div key={i} style={{
              ...CARD, border: "1px solid " + t.color + "20", borderLeft: "4px solid " + t.color,
              display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px",
            }}>
              <div style={{ minWidth: "96px" }}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: t.color, fontFamily: MONO, lineHeight: 1 }}>{formatMiles(Math.pow(10, t.nines))} mi</div>
                <div style={{ fontSize: "9px", color: "#4b5563", marginTop: "4px" }}>per event · {yearsPerCrash(Math.pow(10, t.nines))} / driver</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{t.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Regulatory barriers" subtitle="The gap is not just technical — it is legal.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
          {REGULATORY_BARRIERS.map((item, i) => {
            const sc = STATUS_COLORS[item.status];
            return (
              <div key={i} style={{ ...CARD, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#e2e8f0" }}>{item.title}</div>
                  <div style={{ fontSize: "8px", padding: "2px 7px", borderRadius: "10px", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", background: sc.bg, color: sc.fg }}>{item.status}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.5, marginBottom: "6px" }}>{item.detail}</div>
                <Src href={item.source.url}>{item.source.label}</Src>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Expert timelines" subtitle="McKinsey (91 experts, Jan 2026), S&P Global, WEF, and BCG.">
        <div>
          {EXPERT_TIMELINES.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", padding: "10px 0 10px 14px", borderLeft: "2px solid " + item.color + "30" }}>
              <div style={{ minWidth: "70px", fontSize: "12px", fontWeight: 700, color: item.color, fontFamily: MONO }}>{item.year}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#e2e8f0" }}>{item.event}</div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                  {item.status}{" · "}<Src href={item.source.url}>{item.source.label}</Src>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The child safety question" subtitle="When would you trust your child alone in a driverless car?">
        <div style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.06), rgba(96,165,250,0.04))", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "8px", padding: "20px 22px" }}>
          <div style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: 1.8 }}>
            <Src href={CHILD_SAFETY.source.url}>{CHILD_SAFETY.source.label}</Src> research:
            {" "}<strong style={{ color: "#a855f7" }}>{CHILD_SAFETY.parentsComfortableDriving} of parents</strong> are comfortable driving with autonomous features,
            but only <strong style={{ color: "#a855f7" }}>{CHILD_SAFETY.parentsLetChildRideAlone} would let their child ride alone</strong>.
            <br /><br />
            The implied threshold ({CHILD_SAFETY.impliedCrashThreshold}) also requires infrastructure that doesn't exist yet:
            remote monitoring, secure interiors, emergency communication, verified pickup/dropoff, and medical emergency response.
            Waymo's serious-injury rate — {CHILD_SAFETY.waymoSeriousInjuryRate} — approaches the crash threshold; the rest remains unbuilt.
          </div>
        </div>
      </Section>
    </div>
  );
}
