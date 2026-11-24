// Road to Steeringless — reliability thresholds, regulatory barriers, timelines.
import { TARGET_THRESHOLDS, REGULATORY_BARRIERS, EXPERT_TIMELINES, CHILD_SAFETY } from "../../data.js";
import { CARD, VIZ, NUM, formatMiles, useNarrow, Src, Section } from "../ui.jsx";

// How many years one average driver (14,000 mi/yr) would go between events.
const yearsPerDriver = (miles, annual = 14000) => Math.round(miles / annual).toLocaleString("en-US") + " yrs";

// One threshold: the number on the left (stacked on top on phones), then
// what it means and what backs it.
function Threshold({ t, narrow }) {
  const miles = formatMiles(t.miles) + " mi";
  const years = yearsPerDriver(t.miles);
  const source = (
    <span style={{ fontSize: "11px", color: VIZ.secondary }}>
      <span style={{ color: VIZ.muted }}>{t.source.kind}</span>{" "}
      <Src href={t.source.url}>{narrow && t.source.short ? t.source.short : t.source.label}</Src>
    </span>
  );
  const text = (
    <>
      <span style={{ fontSize: "13px", fontWeight: 600, color: VIZ.text }}>{t.label}</span>
      <span style={{ fontSize: "11px", color: VIZ.muted }}>{t.description}</span>
      {source}
    </>
  );
  if (narrow) {
    return (
      <div style={{ ...CARD, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px" }}>
          <span style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1, color: VIZ.text }}>{miles}</span>
          <span style={{ fontSize: "11px", color: VIZ.muted, whiteSpace: "nowrap" }}>{years} / driver</span>
        </div>
        {text}
      </div>
    );
  }
  return (
    <div style={{ ...CARD, padding: "14px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "160px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1, color: VIZ.text }}>{miles}</span>
        <span style={{ fontSize: "11px", color: VIZ.muted }}>per event · {years} / driver</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>{text}</div>
    </div>
  );
}

const STATUS_COLORS = {
  achieved: { bg: "rgba(34,197,94,0.12)", fg: "#22c55e" },
  partial: { bg: "rgba(251,191,35,0.12)", fg: "#fbbf24" },
  blocked: { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" },
};

export default function Steeringless() {
  const narrow = useNarrow();
  return (
    <div>
      <Section title="How safe is safe enough?" subtitle="No regulator sets a number: UK and UN rules only require “at least as safe as a careful, competent driver.” Miles between events.">
        <div style={{ display: "flex", flexDirection: "column", gap: narrow ? "8px" : "10px" }}>
          {TARGET_THRESHOLDS.map((t) => <Threshold key={t.label} t={t} narrow={narrow} />)}
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
                  <div style={{ fontSize: "11px", padding: "1px 7px", borderRadius: "10px", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", background: sc.bg, color: sc.fg }}>{item.status}</div>
                </div>
                <div style={{ fontSize: "11px", color: VIZ.muted, lineHeight: 1.5, marginBottom: "6px" }}>{item.detail}</div>
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
              <div style={{ minWidth: "70px", fontSize: "12px", fontWeight: 700, color: item.color, ...NUM }}>{item.year}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#e2e8f0" }}>{item.event}</div>
                <div style={{ fontSize: "11px", color: VIZ.muted, marginTop: "2px" }}>
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
