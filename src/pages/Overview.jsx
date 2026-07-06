// Overview — the hero ladder plus the AV-vs-human crash-rate table.
import { useState, useEffect } from "react";
import { NINES_SCALE_DATA, HOME_STATS, CRASH_RATES } from "../../data.js";
import { MONO, CARD, formatMiles, useNarrow, Src, SourceLine, Note, StatCards, Section } from "../ui.jsx";

const HUMAN_NINES = 5.7; // NHTSA all-crash rate — the anchor the ladder references.
const SCALE_MAX = 8.5;

// Human-relative framing: "3.2× safer" / "360× worse" / "Match".
function relToHuman(nines) {
  const diff = nines - HUMAN_NINES;
  if (Math.abs(diff) < 0.05) return { text: "Match", sign: 0 };
  const mul = Math.pow(10, Math.abs(diff));
  const fmt = mul >= 10 ? Math.round(mul).toString() : mul.toFixed(1);
  return { text: fmt + "× " + (diff > 0 ? "safer" : "worse"), sign: diff > 0 ? 1 : -1 };
}

function Ladder() {
  const [anim, setAnim] = useState(false);
  const narrow = useNarrow();
  useEffect(() => {
    const t = setTimeout(() => setAnim(true), 80);
    return () => clearTimeout(t);
  }, []);

  const rows = NINES_SCALE_DATA.slice().sort((a, b) => b.nines - a.nines);
  const cols = narrow ? "1fr 72px" : "220px 1fr 88px";

  return (
    <div style={{ ...CARD, borderRadius: "10px", padding: "20px 24px 16px" }}>
      {/* Header — on narrow the axis ruler is dropped and this collapses to System | vs Human. */}
      <div style={{
        display: "grid", gridTemplateColumns: cols, gap: "14px", padding: "0 0 12px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontSize: "9px", color: "#4b5563", fontFamily: MONO,
        letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, alignItems: "end",
      }}>
        <div>System</div>
        {!narrow && (
          <div style={{ position: "relative", height: "28px" }}>
            <div style={{
              position: "absolute", left: (HUMAN_NINES / SCALE_MAX) * 100 + "%",
              transform: "translateX(-50%)", top: 0,
              fontSize: "8px", color: "oklch(0.82 0.02 260)", fontWeight: 700, letterSpacing: "0.14em",
            }}>HUMAN</div>
            <div style={{
              position: "absolute", left: (HUMAN_NINES / SCALE_MAX) * 100 + "%",
              transform: "translateX(-50%)", top: "10px", width: "1px", height: "6px",
              background: "oklch(0.65 0.02 260 / 0.55)",
            }} />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} style={{
                position: "absolute", left: (n / SCALE_MAX) * 100 + "%", bottom: 0,
                transform: "translateX(-50%)", fontSize: "8px", color: "#374151",
              }}>{formatMiles(Math.pow(10, n))} mi</div>
            ))}
          </div>
        )}
        <div style={{ textAlign: "right" }}>vs Human</div>
      </div>

      {rows.map((d, i) => {
        const barPct = (d.nines / SCALE_MAX) * 100;
        // Human Fatal uses a different denominator than the all-crash baseline,
        // so don't label it "safer" relative to Human Average.
        const rel = d.category === "human" && d.event === "fatal crash"
          ? { text: "Fatal rate", sign: 0 }
          : relToHuman(d.nines);
        const signColor = rel.sign > 0 ? "oklch(0.75 0.15 155)" : rel.sign < 0 ? "oklch(0.72 0.16 30)" : "#cbd5e1";
        // Flip the inline mi/event label left of the dot once the bar is long enough
        // that a right-side label would crash into the vs-Human column.
        const labelOnLeft = barPct >= 55;
        const relCell = (
          <div style={{ textAlign: "right", fontFamily: MONO, fontSize: "12px", fontWeight: 700, color: signColor }}>{rel.text}</div>
        );
        const inlineLabel = (
          <>
            {formatMiles(d.miles)} mi <span style={{ color: "#64748b", fontWeight: 500 }}>/ {d.event}</span>
          </>
        );
        return (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: cols,
            gridTemplateRows: narrow ? "auto auto" : "auto",
            columnGap: "14px", rowGap: narrow ? "8px" : 0,
            alignItems: "center", padding: "11px 0",
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            background: d.category === "human" ? "rgba(255,255,255,0.02)" : "transparent",
            opacity: anim ? 1 : 0,
            transform: anim ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.4s ease " + i * 50 + "ms, transform 0.4s ease " + i * 50 + "ms",
          }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: d.color, lineHeight: 1.2 }}>{d.label}</div>
              <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px", lineHeight: 1.35 }}>
                {d.sublabel} <span style={{ color: "#374151" }}>(<Src href={d.source.url}>{d.source.label}</Src>)</span>
              </div>
            </div>

            {/* On narrow, vs-Human sits next to the label (row 1); the bar takes row 2 full-width. */}
            {narrow && relCell}

            <div style={{ gridColumn: narrow ? "1 / -1" : "auto" }}>
              <div style={{ position: "relative", height: "22px" }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "10px", height: "2px",
                  background: "rgba(255,255,255,0.04)", borderRadius: "1px",
                }} />
                <div style={{
                  position: "absolute", left: (HUMAN_NINES / SCALE_MAX) * 100 + "%",
                  top: "2px", bottom: "2px", width: "1px",
                  background: "oklch(0.65 0.02 260 / 0.45)",
                }} />
                <div style={{
                  position: "absolute", left: 0, top: "9px",
                  width: (anim ? barPct : 0) + "%", height: "4px", borderRadius: "2px",
                  background: "linear-gradient(90deg, " + d.color + "20, " + d.color + ")",
                  transition: "width 0.7s ease " + (i * 50 + 150) + "ms",
                }} />
                <div style={{
                  position: "absolute", left: "calc(" + (anim ? barPct : 0) + "% - 6px)", top: "5px",
                  width: "12px", height: "12px", borderRadius: "6px",
                  background: d.color, boxShadow: "0 0 0 3px " + d.color + "22",
                  transition: "left 0.7s ease " + (i * 50 + 150) + "ms",
                }} />
                {/* Inline label gets an opaque background so the human rule never
                    paints through the text. */}
                {!narrow && (
                  <div style={{
                    position: "absolute", top: "1px", padding: "2px 6px",
                    ...(labelOnLeft
                      ? { right: "calc(" + (100 - barPct) + "% + 18px)", textAlign: "right" }
                      : { left: "calc(" + barPct + "% + 12px)" }),
                    background: "#121223", borderRadius: "3px",
                    fontSize: "11px", fontWeight: 700, color: d.color,
                    fontFamily: MONO, whiteSpace: "nowrap",
                    opacity: anim ? 1 : 0,
                    transition: "opacity 0.4s ease " + (i * 50 + 300) + "ms",
                  }}>{inlineLabel}</div>
                )}
              </div>
              {narrow && (
                <div style={{
                  marginTop: "4px", fontSize: "11px", fontWeight: 700, color: d.color,
                  fontFamily: MONO, textAlign: "center",
                  opacity: anim ? 1 : 0,
                  transition: "opacity 0.4s ease " + (i * 50 + 300) + "ms",
                }}>{inlineLabel}</div>
              )}
            </div>

            {!narrow && relCell}
          </div>
        );
      })}
    </div>
  );
}

function CrashTable() {
  const narrow = useNarrow();
  const headers = [
    { label: "Event type", sub: null, align: "left" },
    { label: "Human avg", sub: "mi / event", align: "right" },
    { label: "Waymo", sub: "mi / event", align: "right" },
    { label: "Tesla Robotaxi", sub: "mi / event", align: "right" },
    { label: "Source", sub: null, align: "left" },
  ];
  const cell = (value, color) => {
    // "—" stays plain; "0 fatalities*" has its footnote; plain numbers get a "mi" unit.
    const hasMiUnit = value !== "—" && !/[a-z]/.test(value);
    return (
      <td style={{ padding: "12px 14px", textAlign: "right", fontSize: "13px", fontFamily: MONO, fontWeight: 600, color, whiteSpace: "nowrap" }}>
        {value}{hasMiUnit && <span style={{ fontSize: "10px", color: "#4b5563", fontWeight: 500, marginLeft: "3px" }}>mi</span>}
      </td>
    );
  };
  const goodColor = (flag, badColor) => (flag === true ? "#22c55e" : flag === false ? badColor : "#4b5563");
  return (
    <>
      <div style={{ ...CARD, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: narrow ? "520px" : "auto", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {headers.map((h, i) => (
                  <th key={i} style={{
                    padding: "11px 14px", textAlign: h.align, fontSize: "10px", color: "#4b5563",
                    textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: MONO,
                    fontWeight: 600, verticalAlign: "bottom",
                  }}>
                    <div>{h.label}</div>
                    {h.sub && <div style={{ fontSize: "8px", color: "#2a3141", fontWeight: 500, textTransform: "none", letterSpacing: "0.04em", marginTop: "2px" }}>{h.sub}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRASH_RATES.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "#cbd5e1" }}>{r.metric}</td>
                  {cell(r.human, "#a3a3a3")}
                  {cell(r.waymo, goodColor(r.waymoGood, "#fbbf24"))}
                  {cell(r.tesla, goodColor(r.teslaGood, "#ef4444"))}
                  <td style={{ padding: "12px 14px" }}><Src href={r.source.url}>{r.source.label}</Src></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {narrow && <div style={{ fontSize: "9px", color: "#27273f", marginTop: "4px", fontFamily: MONO, textAlign: "right" }}>↔ Scroll sideways for all columns</div>}
    </>
  );
}

export default function Overview() {
  return (
    <div>
      <StatCards stats={HOME_STATS} />

      <Section
        title="Progress toward autonomous driving"
        subtitle="Ranked safest-first. Event types differ by row — disengagements, crashes, injuries, and fatalities are not the same thing."
      >
        <Ladder />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginTop: "14px", justifyContent: "center" }}>
          {[
            { color: "oklch(0.72 0.16 55)", label: "Tesla" },
            { color: "oklch(0.62 0.16 245)", label: "Waymo" },
            { color: "oklch(0.65 0.02 260)", label: "Human baseline" },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "5px", background: l.color }} />
              <span style={{ fontSize: "11px", color: "#8b94a5", fontFamily: MONO, letterSpacing: "0.02em" }}>{l.label}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: "20px", padding: "18px 22px",
          background: "linear-gradient(135deg, rgba(96,165,250,0.07), rgba(168,85,247,0.05))",
          border: "1px solid rgba(96,165,250,0.12)", borderRadius: "8px",
        }}>
          <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: 1.7 }}>
            <strong style={{ color: "#60a5fa" }}>The key insight:</strong> every step on this chart is a 10× jump.
            Waymo has crossed the human baseline on crash metrics — within carefully mapped domains.
            Tesla FSD would need to improve <strong>~360×</strong> to match the average human driver.
          </div>
        </div>
      </Section>

      <Section title="Crash rates vs. human drivers" subtitle="Miles between events — higher is safer. Green = better than the human average.">
        <CrashTable />
        <SourceLine>
          * Waymo: zero fatalities in 220M+ driverless miles. Tesla robotaxi data from <Src href="https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/">Fortune analysis</Src> (Feb 2026).
        </SourceLine>
        <Note>
          Disengagements and crashes are different metrics — Tesla's "miles per intervention" and Waymo's "miles per crash" are not directly comparable.
          Human crash data underreports minor incidents by ~60% (<Src href="https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762">NHTSA</Src>),
          while AVs report virtually every contact event.
        </Note>
      </Section>
    </div>
  );
}
