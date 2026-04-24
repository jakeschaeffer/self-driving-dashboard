import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from "recharts";

import {
  SITE,
  PAGES as PAGES_CONFIG,
  NINES_SCALE_DATA,
  HOME_STATS,
  WAYMO_STATS,
  TESLA_STATS,
  CRASH_RATES,
  WAYMO_CRASH_REDUCTION,
  WAYMO_MILES_TIMELINE,
  WAYMO_INCIDENTS,
  TESLA_VERSION_PROGRESS,
  TESLA_FSD_SUPERVISED,
  TESLA_ROBOTAXI,
  TESLA_ROBOTAXI_SOURCE,
  TESLA_PROJECTION,
  MUSK_PREDICTIONS,
  TARGET_THRESHOLDS,
  REGULATORY_BARRIERS,
  EXPERT_TIMELINES,
  CHILD_SAFETY,
  FOOTER_SOURCES,
} from "./data.js";

// ============================================================
// UTILITIES
// ============================================================

const formatMiles = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
};

// Viewport-width hook. Pages use this to switch grid layouts below ~720px so multi-column
// blocks (tables, side-by-side cards) don't get starved of width on mobile.
function useNarrow(breakpoint) {
  breakpoint = breakpoint || 720;
  var _s = useState(typeof window !== "undefined" && window.innerWidth < breakpoint);
  var narrow = _s[0];
  var setNarrow = _s[1];
  useEffect(function() {
    var check = function() { setNarrow(window.innerWidth < breakpoint); };
    check();
    window.addEventListener("resize", check);
    return function() { window.removeEventListener("resize", check); };
  }, [breakpoint]);
  return narrow;
}

// Human-relative framing: "3.2× safer" / "360× worse" / "Match". The human baseline
// (5.7 nines = NHTSA all-crash rate) is the anchor the hero chart references.
function relToHuman(nines) {
  const human = 5.7;
  const diff = nines - human;
  if (Math.abs(diff) < 0.05) return { text: "Match", sign: 0 };
  const mul = Math.pow(10, Math.abs(diff));
  const fmt = mul >= 100 ? Math.round(mul) : mul >= 10 ? mul.toFixed(0) : mul.toFixed(1);
  return {
    text: fmt + "× " + (diff > 0 ? "safer" : "worse"),
    sign: diff > 0 ? 1 : -1,
  };
}

const yearsPerCrash = (miles, annual) => {
  annual = annual || 14000;
  const y = miles / annual;
  if (y >= 100) return Math.round(y) + " yrs";
  if (y >= 1) return y.toFixed(1) + " yrs";
  return (annual / miles).toFixed(1) + "x/yr";
};

// ============================================================
// SHARED COMPONENTS
// ============================================================

const FONTS = "'JetBrains Mono', 'Fira Code', monospace";
const BODY = "'Sora', 'Space Grotesk', -apple-system, sans-serif";

function Src({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      color: "#60a5fa", fontSize: "11px", textDecoration: "none",
      borderBottom: "1px dotted rgba(96,165,250,0.4)", fontFamily: FONTS,
      transition: "color 0.15s",
    }}
    onMouseEnter={e => { e.target.style.color = "#93c5fd"; }}
    onMouseLeave={e => { e.target.style.color = "#60a5fa"; }}
    >{children}</a>
  );
}

function Note({ children }) {
  return (
    <div style={{
      background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.12)",
      borderRadius: "6px", padding: "12px 16px", fontSize: "12px", color: "#94a3b8",
      lineHeight: 1.65, marginTop: "16px",
    }}>
      <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: "11px" }}>NOTE </span>{children}
    </div>
  );
}

function StatCard({ label, value, sublabel, accent, sourceHref, sourceText }) {
  accent = accent || "#60a5fa";
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "8px", padding: "18px 20px", flex: "1 1 180px", minWidth: "170px",
    }}>
      <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase",
        letterSpacing: "0.08em", fontFamily: FONTS, marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: 700, color: accent,
        fontFamily: FONTS, lineHeight: 1.1 }}>{value}</div>
      {sublabel && <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "5px" }}>{sublabel}</div>}
      {sourceHref && <div style={{ marginTop: "6px" }}><Src href={sourceHref}>{sourceText || "Source"}</Src></div>}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: "44px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0", margin: "0 0 4px", fontFamily: BODY }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function Nav({ active, onChange }) {
  return (
    <nav style={{
      display: "flex", gap: "2px", background: "#13132b",
      borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px",
      overflowX: "auto", WebkitOverflowScrolling: "touch",
    }}>
      {PAGES_CONFIG.map(function(p) {
        return (
          <button key={p.id} onClick={function() { onChange(p.id); }} style={{
            padding: "13px 16px", background: active === p.id ? "rgba(255,255,255,0.05)" : "transparent",
            border: "none", borderBottom: active === p.id ? "2px solid #60a5fa" : "2px solid transparent",
            color: active === p.id ? "#e2e8f0" : "#64748b", cursor: "pointer",
            fontFamily: FONTS, fontSize: "11px", letterSpacing: "0.06em",
            textTransform: "uppercase", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>{p.nav}</button>
        );
      })}
    </nav>
  );
}

// ============================================================
// NINES SCALE — clean vertical layout
// ============================================================

function NinesScale() {
  const [anim, setAnim] = useState(false);
  const narrow = useNarrow();
  useEffect(function() { var t = setTimeout(function() { setAnim(true); }, 80); return function() { clearTimeout(t); }; }, []);

  var scaleMax = 8.5;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
        {HOME_STATS.map(function(s, i) {
          return <StatCard key={i} label={s.label} value={s.value} sublabel={s.sublabel} accent={s.accent} sourceHref={s.source.url} sourceText={s.source.label} />;
        })}
      </div>

      <Section
        title="Progress toward autonomous driving"
        subtitle="Ranked safest-first. Each step right on the scale is 10× safer than the one before. Events aren't all the same — disengagements, crashes, injuries, or fatalities — so the event type is shown on every row."
      >
      {/* Ranked ladder — safest first. Bar length encodes log miles; each row shows an explicit
          ×-vs-human delta. Labels flip left of the dot for high-pct rows to avoid overlap with
          the vs-Human column on the right. */}
      {(function() {
        var human = 5.7;
        var ladderSorted = NINES_SCALE_DATA.slice().sort(function(a, b) { return b.nines - a.nines; });
        return (
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px", padding: "20px 24px 16px", position: "relative",
          }}>
            {/* Column header — at narrow widths the axis ruler is dropped (bars move to their
                own row beneath each entry), and header collapses to "System | vs Human". */}
            <div style={{
              display: "grid",
              gridTemplateColumns: narrow ? "1fr 72px" : "220px 1fr 88px",
              gap: "14px", padding: "0 0 12px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontSize: "9px", color: "#4b5563", fontFamily: FONTS,
              letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
              alignItems: "end",
            }}>
              <div>System</div>
              {!narrow && (
                <div style={{ position: "relative", height: "28px" }}>
                  <div style={{
                    position: "absolute", left: (human / scaleMax) * 100 + "%",
                    transform: "translateX(-50%)", top: "0px",
                    fontSize: "8px", color: "oklch(0.82 0.02 260)", fontWeight: 700,
                    letterSpacing: "0.14em",
                  }}>HUMAN</div>
                  <div style={{
                    position: "absolute", left: (human / scaleMax) * 100 + "%",
                    transform: "translateX(-50%)", top: "10px",
                    width: "1px", height: "6px",
                    background: "oklch(0.65 0.02 260 / 0.55)",
                  }} />
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(function(n) {
                    return (
                      <div key={n} style={{
                        position: "absolute", left: (n / scaleMax) * 100 + "%",
                        bottom: "0px",
                        transform: "translateX(-50%)", fontSize: "8px", color: "#374151",
                      }}>{formatMiles(Math.pow(10, n))} mi</div>
                    );
                  })}
                </div>
              )}
              <div style={{ textAlign: "right" }}>vs Human</div>
            </div>

            {/* Rows */}
            <div style={{ position: "relative" }}>
              {ladderSorted.map(function(d, i) {
                var barPct = (d.nines / scaleMax) * 100;
                var rel = relToHuman(d.nines);
                var signColor = rel.sign > 0 ? "oklch(0.75 0.15 155)" : rel.sign < 0 ? "oklch(0.72 0.16 30)" : "#cbd5e1";
                var isHuman = d.category === "human";
                // Flip inline mi/event label to the LEFT of the dot once the bar is long enough that
                // a right-side label would crash into the 88px "vs Human" column. 55% is the safe cutoff.
                var labelOnLeft = barPct >= 55;
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: narrow ? "1fr 72px" : "220px 1fr 88px",
                      gridTemplateRows: narrow ? "auto auto" : "auto",
                      columnGap: "14px",
                      rowGap: narrow ? "8px" : "0",
                      alignItems: "center",
                      padding: "11px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: isHuman ? "rgba(255,255,255,0.02)" : "transparent",
                      opacity: anim ? 1 : 0,
                      transform: anim ? "translateX(0)" : "translateX(-8px)",
                      transition: "opacity 0.4s ease " + (i * 50) + "ms, transform 0.4s ease " + (i * 50) + "ms",
                    }}
                  >
                    {/* Label column — system, sublabel, and source link in parens. */}
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: d.color, lineHeight: 1.2 }}>{d.label}</div>
                      <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px", lineHeight: 1.35 }}>
                        {d.sublabel} <span style={{ color: "#374151" }}>(<Src href={d.source.url}>{d.source.label}</Src>)</span>
                      </div>
                    </div>

                    {/* vs Human delta — rendered second in DOM so it sits in col 2 row 1 of the
                        narrow grid (next to the label); on wide screens it stays col 3. */}
                    {narrow && (
                      <div style={{
                        textAlign: "right", fontFamily: FONTS,
                        fontSize: "12px", fontWeight: 700, color: signColor,
                      }}>{rel.text}</div>
                    )}

                    {/* Bar cell — full width on narrow (spans both columns on row 2), middle column on wide.
                        At narrow widths the inline mile/event label moves to its own line BELOW the bar so
                        no row pct can squeeze it into overflow on either side. */}
                    <div style={{
                      gridColumn: narrow ? "1 / -1" : "auto",
                    }}>
                      <div style={{ position: "relative", height: "22px" }}>
                        {/* Baseline track */}
                        <div style={{
                          position: "absolute", left: 0, right: 0, top: "10px", height: "2px",
                          background: "rgba(255,255,255,0.04)", borderRadius: "1px",
                        }} />
                        {/* Human rule */}
                        <div style={{
                          position: "absolute", left: (human / scaleMax) * 100 + "%",
                          top: "2px", bottom: "2px", width: "1px",
                          background: "oklch(0.65 0.02 260 / 0.45)",
                        }} />
                        {/* Bar fill */}
                        <div style={{
                          position: "absolute", left: 0, top: "9px",
                          width: (anim ? barPct : 0) + "%", height: "4px", borderRadius: "2px",
                          background: "linear-gradient(90deg, " + d.color + "20, " + d.color + ")",
                          transition: "width 0.7s ease " + (i * 50 + 150) + "ms",
                        }} />
                        {/* Dot at end of bar */}
                        <div style={{
                          position: "absolute",
                          left: "calc(" + (anim ? barPct : 0) + "% - 6px)", top: "5px",
                          width: "12px", height: "12px", borderRadius: "6px",
                          background: d.color,
                          boxShadow: "0 0 0 3px " + d.color + "22",
                          transition: "left 0.7s ease " + (i * 50 + 150) + "ms",
                        }} />
                        {/* Wide-only inline label: right of dot for short bars, left for long bars.
                            Label gets an opaque background matching the section card so the 67%
                            human rule never paints through the middle of the text. */}
                        {!narrow && (labelOnLeft ? (
                          <div style={{
                            position: "absolute",
                            right: "calc(" + (100 - barPct) + "% + 18px)", top: "1px",
                            padding: "2px 6px",
                            background: "#121223",
                            borderRadius: "3px",
                            fontSize: "11px", fontWeight: 700, color: d.color,
                            fontFamily: FONTS, whiteSpace: "nowrap",
                            textAlign: "right",
                            opacity: anim ? 1 : 0,
                            transition: "opacity 0.4s ease " + (i * 50 + 300) + "ms",
                          }}>
                            {formatMiles(d.miles)} mi <span style={{ color: "#64748b", fontWeight: 500 }}>/ {d.event}</span>
                          </div>
                        ) : (
                          <div style={{
                            position: "absolute",
                            left: "calc(" + barPct + "% + 12px)", top: "1px",
                            padding: "2px 6px",
                            background: "#121223",
                            borderRadius: "3px",
                            fontSize: "11px", fontWeight: 700, color: d.color,
                            fontFamily: FONTS, whiteSpace: "nowrap",
                            opacity: anim ? 1 : 0,
                            transition: "opacity 0.4s ease " + (i * 50 + 300) + "ms",
                          }}>
                            {formatMiles(d.miles)} mi <span style={{ color: "#64748b", fontWeight: 500 }}>/ {d.event}</span>
                          </div>
                        ))}
                      </div>
                      {/* Narrow-only label below the bar — full row, no overflow risk. */}
                      {narrow && (
                        <div style={{
                          marginTop: "4px",
                          fontSize: "11px", fontWeight: 700, color: d.color,
                          fontFamily: FONTS,
                          textAlign: "center",
                          opacity: anim ? 1 : 0,
                          transition: "opacity 0.4s ease " + (i * 50 + 300) + "ms",
                        }}>
                          {formatMiles(d.miles)} mi <span style={{ color: "#64748b", fontWeight: 500 }}>/ {d.event}</span>
                        </div>
                      )}
                    </div>

                    {/* vs Human delta — only on wide (narrow renders it above, next to the label) */}
                    {!narrow && (
                      <div style={{
                        textAlign: "right", fontFamily: FONTS,
                        fontSize: "12px", fontWeight: 700, color: signColor,
                      }}>{rel.text}</div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        );
      })()}
      </Section>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginTop: "12px", justifyContent: "center" }}>
        {[
          { color: "oklch(0.72 0.16 55)", label: "Tesla" },
          { color: "oklch(0.62 0.16 245)", label: "Waymo" },
          { color: "oklch(0.65 0.02 260)", label: "Human baseline" },
        ].map(function(l, i) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "5px", background: l.color }} />
              <span style={{ fontSize: "11px", color: "#8b94a5", fontFamily: FONTS, letterSpacing: "0.02em" }}>{l.label}</span>
            </div>
          );
        })}
      </div>

      <Note>
        Disengagements and crashes are different metrics — Tesla's "miles per intervention" and Waymo's "miles per crash" are not directly comparable.
        Each row above uses each system's best available metric; see source links for methodology.
        Human crash data underreports minor incidents by ~60% (<Src href="https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762">NHTSA</Src>),
        while AVs report virtually every contact event.
      </Note>

      <div style={{
        marginTop: "20px", padding: "18px 22px",
        background: "linear-gradient(135deg, rgba(96,165,250,0.07), rgba(168,85,247,0.05))",
        border: "1px solid rgba(96,165,250,0.12)", borderRadius: "8px",
      }}>
        <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: 1.7 }}>
          <strong style={{ color: "#60a5fa" }}>The key insight:</strong> every step on this chart is a 10× jump in safety.
          Tesla FSD v14 at <strong>1,454 miles between disengagements</strong> would have to improve <strong>~360×</strong> — more than two full steps up the scale — to match the average human driver at <strong>529,000 miles between crashes</strong>.
          Waymo has crossed the human baseline on crash metrics, but only within carefully mapped operational domains.
          RAND researchers <Src href="https://www.rand.org/pubs/research_reports/RR1478.html">calculated</Src> that proving an AV is 20% safer than humans would require ~8.8 billion test miles.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AV vs HUMANS
// ============================================================

function ComparisonPage() {
  var narrow = useNarrow();
  return (
    <div>
      <Section title="Crash rates: AV systems vs. human drivers" subtitle="Every number is miles between events — higher is safer. Green = outperforming the human average; amber = worse than humans; em dash = no comparable data.">
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
          {/* Mobile: horizontal scroll so the 5-column table doesn't squeeze cells into illegibility. */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: narrow ? "520px" : "auto", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {[
                  { label: "Event type", sub: null, align: "left" },
                  { label: "Human avg", sub: "mi / event", align: "right" },
                  { label: "Waymo", sub: "mi / event", align: "right" },
                  { label: "Tesla Robotaxi", sub: "mi / event", align: "right" },
                  { label: "Source", sub: null, align: "left" },
                ].map(function(h, i) {
                  return (
                    <th key={i} style={{ padding: "11px 14px", textAlign: h.align, fontSize: "10px", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONTS, fontWeight: 600, verticalAlign: "bottom" }}>
                      <div>{h.label}</div>
                      {h.sub && <div style={{ fontSize: "8px", color: "#2a3141", fontWeight: 500, textTransform: "none", letterSpacing: "0.04em", marginTop: "2px" }}>{h.sub}</div>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {CRASH_RATES.map(function(r, i) {
                var renderCell = function(value, color) {
                  // "—" stays plain; "0 fatalities*" has footnote already; everything else gets a small "mi" unit.
                  var hasMiUnit = value !== "\u2014" && !/[a-z]/.test(value);
                  return (
                    <td style={{ padding: "12px 14px", textAlign: "right", fontSize: "13px", fontFamily: FONTS, fontWeight: 600, color: color, whiteSpace: "nowrap" }}>
                      {value}{hasMiUnit && <span style={{ fontSize: "10px", color: "#4b5563", fontWeight: 500, marginLeft: "3px" }}>mi</span>}
                    </td>
                  );
                };
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "12px 14px", fontSize: "12px", color: "#cbd5e1" }}>{r.metric}</td>
                    {renderCell(r.human, "#a3a3a3")}
                    {renderCell(r.waymo, r.waymoGood === true ? "#22c55e" : r.waymoGood === false ? "#fbbf24" : "#4b5563")}
                    {renderCell(r.tesla, r.teslaGood === true ? "#22c55e" : r.teslaGood === false ? "#ef4444" : "#4b5563")}
                    <td style={{ padding: "12px 14px" }}><Src href={r.source.url}>{r.source.label}</Src></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
        {narrow && <div style={{ fontSize: "9px", color: "#27273f", marginTop: "4px", fontFamily: FONTS, textAlign: "right" }}>↔ Scroll table sideways to see all columns</div>}
        <div style={{ fontSize: "10px", color: "#374151", marginTop: "6px" }}>
          * Waymo: zero fatalities in 127M+ driverless miles. Tesla robotaxi data from <Src href="https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/">Fortune analysis</Src>.
        </div>
      </Section>

      <Section title="Waymo crash reduction by severity" subtitle="Incidents per million miles. Peer-reviewed data at 56.7M miles and Swiss Re insurance data at 25.3M miles.">
        {narrow ? (
          /* Narrow: Recharts y-axis (130px) + left margin (140px) consumes the entire 320px viewport
             and the bars never get drawn. Show the same data as Waymo-vs-Human pair cards instead. */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "8px" }}>
            {WAYMO_CRASH_REDUCTION.map(function(d, i) {
              return (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{d.category}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#3b82f6", fontFamily: FONTS }}>{d.waymo}</div>
                      <div style={{ fontSize: "8px", color: "#4b5563", textTransform: "uppercase" }}>Waymo</div>
                    </div>
                    <div style={{ fontSize: "10px", color: "#374151" }}>vs</div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#6b7280", fontFamily: FONTS }}>{d.human}</div>
                      <div style={{ fontSize: "8px", color: "#4b5563", textTransform: "uppercase" }}>Human</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "10px", color: "#5a6376", marginTop: "4px" }}>incidents per million miles</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ height: "320px" }}>
            <ResponsiveContainer>
              <BarChart data={WAYMO_CRASH_REDUCTION} layout="vertical" margin={{ left: 140, right: 40, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis type="number" tick={{ fill: "#4b5563", fontSize: 10, fontFamily: FONTS }} label={{ value: "Incidents per million miles", position: "bottom", offset: -5, fill: "#374151", fontSize: 10 }} />
                <YAxis dataKey="category" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} width={130} />
                <Tooltip contentStyle={{ background: "#1a1a30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "11px" }} />
                <Bar dataKey="human" name="Human drivers" fill="#6b7280" radius={[0, 3, 3, 0]} barSize={14} />
                <Bar dataKey="waymo" name="Waymo" fill="#3b82f6" radius={[0, 3, 3, 0]} barSize={14} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
          {WAYMO_CRASH_REDUCTION.map(function(d, i) {
            return (
              <div key={i} style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "16px", padding: "4px 12px", fontSize: "11px" }}>
                <span style={{ color: "#22c55e", fontWeight: 700, fontFamily: FONTS }}>{"↓"}{d.reduction}%</span>
                <span style={{ color: "#64748b", marginLeft: "5px" }}>{d.category}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#374151" }}>
          Sources: <Src href="https://www.tandfonline.com/doi/full/10.1080/15389588.2024.2380786">Kusano et al. 2025</Src>{" \u00B7 "}
          <Src href="https://waymo.com/blog/2024/12/new-swiss-re-study-waymo">Swiss Re / Waymo Dec 2024</Src>
        </div>
        <Note>
          Swiss Re compared Waymo against newer vehicles (2018-2021) with ADAS — the fairest human benchmark available.
          Human crash data underreports minor incidents by ~60% (<Src href="https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762">NHTSA</Src>),
          while AVs report virtually every contact event.
        </Note>
      </Section>
    </div>
  );
}

// ============================================================
// WAYMO PAGE
// ============================================================

function WaymoPage() {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
        {WAYMO_STATS.map(function(s, i) {
          return <StatCard key={i} label={s.label} value={s.value} sublabel={s.sublabel} accent={s.accent} sourceHref={s.source.url} sourceText={s.source.label} />;
        })}
      </div>

      <Section title="Cumulative driverless miles" subtitle="Rider-only miles (no safety driver). Waymo now drives ~2M autonomous miles per week.">
        <div style={{ height: "260px" }}>
          <ResponsiveContainer>
            <BarChart data={WAYMO_MILES_TIMELINE} margin={{ left: 10, right: 10, top: 15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#4b5563", fontSize: 10, fontFamily: FONTS }} label={{ value: "Million miles", angle: -90, position: "insideLeft", fill: "#374151", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1a1a30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }} formatter={function(v) { return [v + "M miles", "Driverless"]; }} />
              <Bar dataKey="miles" radius={[4, 4, 0, 0]} barSize={36}>
                {WAYMO_MILES_TIMELINE.map(function(_, i) { return <Cell key={i} fill={i === WAYMO_MILES_TIMELINE.length - 1 ? "#2563eb" : "#3b82f660"} />; })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontSize: "10px", color: "#374151", marginTop: "4px" }}>
          Source: <Src href="https://waymo.com/safety/impact">Waymo Safety Impact</Src>
        </div>
      </Section>

      <Section title="Crash rates by severity vs. human benchmark" subtitle="Per million miles. Source: Kusano et al. 2025 — 56.7M rider-only miles.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "10px" }}>
          {WAYMO_CRASH_REDUCTION.map(function(d, i) {
            return (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{d.category}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#3b82f6", fontFamily: FONTS }}>{d.waymo}</div>
                    <div style={{ fontSize: "8px", color: "#4b5563", textTransform: "uppercase" }}>Waymo</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151" }}>vs</div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#6b7280", fontFamily: FONTS }}>{d.human}</div>
                    <div style={{ fontSize: "8px", color: "#4b5563", textTransform: "uppercase" }}>Human</div>
                  </div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", fontFamily: FONTS }}>{"↓"} {d.reduction}%</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: "10px", color: "#374151", marginTop: "8px" }}>
          Sources: <Src href="https://www.tandfonline.com/doi/full/10.1080/15389588.2024.2380786">Kusano et al. 2025</Src>{" \u00B7 "}
          <Src href="https://waymo.com/blog/2024/12/new-swiss-re-study-waymo">Swiss Re Dec 2024</Src>
        </div>
      </Section>

      <Section title="Known limitations & incidents" subtitle="Even the industry leader encounters edge cases.">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {WAYMO_INCIDENTS.map(function(item, i) {
            return (
              <div key={i} style={{
                display: "flex", gap: "12px", padding: "10px 14px",
                background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)",
                borderRadius: "6px",
                borderLeft: "3px solid " + (item.severity === "high" ? "#ef4444" : item.severity === "medium" ? "#f59e0b" : "#3b82f6"),
              }}>
                <div style={{ fontSize: "10px", color: "#4b5563", minWidth: "65px", fontFamily: FONTS }}>{item.date}</div>
                <div style={{ flex: 1, fontSize: "12px", color: "#b0b8c4" }}>
                  {item.text}
                  {item.source && <span style={{ marginLeft: "6px" }}><Src href={item.source.url}>{item.source.label}</Src></span>}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// ============================================================
// TESLA PAGE
// ============================================================

function TeslaPage() {
  var narrow = useNarrow();
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
        {TESLA_STATS.map(function(s, i) {
          return <StatCard key={i} label={s.label} value={s.value} sublabel={s.sublabel} accent={s.accent} sourceHref={s.source.url} sourceText={s.source.label} />;
        })}
      </div>

      <Section title="FSD version-over-version improvement" subtitle="Miles between critical disengagements by version. Crowdsourced from teslafsdtracker.com.">
        {/* Custom horizontal bar list (replaced Recharts BarChart, which silently rendered empty
            <g> elements at every viewport — Cell + barSize + radius interaction). Works at any
            width down to 320px because each row has its own simple grid. */}
        {(function() {
          var max = TESLA_VERSION_PROGRESS.reduce(function(m, d) { return Math.max(m, d.milesPerIntervention); }, 0);
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" }}>
              {TESLA_VERSION_PROGRESS.map(function(d, i) {
                var pct = (d.milesPerIntervention / max) * 100;
                var color = "hsl(" + (35 + i * 8) + ", 90%, " + (50 + i * 4) + "%)";
                return (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 88px",
                    gap: "12px",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#cbd5e1", fontFamily: FONTS, fontWeight: 600, lineHeight: 1.2 }}>{d.version}</div>
                      <div style={{ fontSize: "9px", color: "#4b5563", fontFamily: FONTS, marginTop: "2px" }}>{d.date}</div>
                    </div>
                    <div style={{ position: "relative", height: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", overflow: "hidden" }}>
                      <div style={{
                        position: "absolute", left: 0, top: 0, bottom: 0,
                        width: pct + "%",
                        background: color,
                        borderRadius: "6px",
                      }} />
                    </div>
                    <div style={{ textAlign: "right", fontFamily: FONTS, fontSize: "12px", fontWeight: 700, color: color, whiteSpace: "nowrap" }}>
                      {d.milesPerIntervention.toLocaleString()} <span style={{ color: "#4b5563", fontWeight: 500, fontSize: "10px" }}>mi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
        <div style={{ fontSize: "10px", color: "#374151", marginTop: "4px" }}>
          Source: <Src href="https://www.teslafsdtracker.com/">teslafsdtracker.com</Src> (crowdsourced)
        </div>
        <Note>
          Crowdsourced data skews optimistic — enthusiast drivers in favorable conditions.
          Independent testing by <Src href="https://electrek.co/2024/09/26/tesla-full-self-driving-third-party-testing-13-miles-between-interventions/">AMCI</Src> on
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

      <Section title="Supervised FSD vs. Austin Robotaxi" subtitle="Two very different products with very different safety records.">
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: "14px" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "12px" }}>FSD Supervised (consumer)</div>
            {TESLA_FSD_SUPERVISED.map(function(row, i) {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                  <span style={{ color: "#64748b" }}>{row.label} {row.source && <Src href={row.source.url}>{row.source.label}</Src>}</span>
                  <span style={{ color: "#cbd5e1", fontFamily: FONTS }}>{row.value}</span>
                </div>
              );
            })}
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "8px", padding: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", marginBottom: "12px" }}>Robotaxi (Austin, unsupervised)</div>
            {TESLA_ROBOTAXI.map(function(row, i) {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                  <span style={{ color: "#64748b" }}>{row.label}</span>
                  <span style={{ color: "#fca5a5", fontFamily: FONTS }}>{row.value}</span>
                </div>
              );
            })}
            <div style={{ marginTop: "8px" }}><Src href={TESLA_ROBOTAXI_SOURCE.url}>{TESLA_ROBOTAXI_SOURCE.label} analysis of Tesla NHTSA disclosure</Src></div>
          </div>
        </div>
        <Note>
          Tesla is the only AV company fully redacting crash details from <Src href="https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/">NHTSA reports</Src>.
          Tesla's quarterly <Src href="https://www.tesla.com/VehicleSafetyReport">Vehicle Safety Reports</Src> claim 1 crash per 5.94-7.63M miles with Autopilot,
          but count only high-severity events and Autopilot runs predominantly on highways.
          The <Src href="https://www.iihs.org/news/detail/first-partial-driving-automation-safeguard-ratings-show-industry-has-work-to-do">IIHS stated</Src>: there is little evidence that partial automation has safety benefits.
        </Note>
      </Section>

      <Section title="Musk self-driving timeline predictions" subtitle="A track record of claims vs. reality.">
        <div>
          {MUSK_PREDICTIONS.map(function(item, i) {
            return (
              <div key={i} style={{ display: "flex", gap: "14px", padding: "10px 0 10px 14px", borderLeft: "2px solid rgba(239,68,68,0.25)" }}>
                <div style={{ fontSize: "11px", color: "#f59e0b", fontFamily: FONTS, minWidth: "42px", fontWeight: 600 }}>{item.year}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#cbd5e1" }}>{item.claim}</div>
                  <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px" }}>
                    {"\u274C"} {item.result} <Src href={item.source.url}>{item.source.label}</Src>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// ============================================================
// ROAD TO STEERINGLESS
// ============================================================

function TargetsPage() {
  return (
    <div>
      <Section title="How safe is safe enough?" subtitle="No regulator has published a specific threshold. These are inferred from expert commentary and human benchmarks — each expressed as miles between events.">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TARGET_THRESHOLDS.map(function(t, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid " + t.color + "20", borderRadius: "8px", borderLeft: "4px solid " + t.color, padding: "14px 18px" }}>
                <div style={{ minWidth: "96px" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: t.color, fontFamily: FONTS, lineHeight: 1 }}>{formatMiles(Math.pow(10, t.nines))} mi</div>
                  <div style={{ fontSize: "9px", color: "#4b5563", marginTop: "4px" }}>per event · {yearsPerCrash(Math.pow(10, t.nines))} / driver</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{t.label}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{t.description}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: "60px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#4b5563", fontFamily: FONTS }}>{t.nines}</div>
                  <div style={{ fontSize: "9px", color: "#374151", marginTop: "2px" }}>nines</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Regulatory barriers" subtitle="The gap is not just technical \u2014 it is legal.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
          {REGULATORY_BARRIERS.map(function(item, i) {
            var statusColors = { achieved: { bg: "rgba(34,197,94,0.12)", fg: "#22c55e" }, partial: { bg: "rgba(251,191,35,0.12)", fg: "#fbbf24" }, blocked: { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" } };
            var sc = statusColors[item.status];
            return (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "14px 16px" }}>
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

      <Section title="Expert consensus on timelines" subtitle="McKinsey (91 experts, Jan 2026), S&P Global, WEF, and BCG.">
        <div>
          {EXPERT_TIMELINES.map(function(item, i) {
            return (
              <div key={i} style={{ display: "flex", gap: "14px", padding: "10px 0 10px 14px", borderLeft: "2px solid " + item.color + "30" }}>
                <div style={{ minWidth: "70px", fontSize: "12px", fontWeight: 700, color: item.color, fontFamily: FONTS }}>{item.year}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#e2e8f0" }}>{item.event}</div>
                  <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                    {item.status}{" \u00B7 "}<Src href={item.source.url}>{item.source.label}</Src>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="The child safety question" subtitle="When would you trust your child alone in a driverless car?">
        <div style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.06), rgba(96,165,250,0.04))", border: "1px solid rgba(168,85,247,0.12)", borderRadius: "8px", padding: "20px 22px" }}>
          <div style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: 1.8 }}>
            Research from <Src href={CHILD_SAFETY.source.url}>{CHILD_SAFETY.source.label}</Src> found
            that while <strong style={{ color: "#a855f7" }}>{CHILD_SAFETY.parentsComfortableDriving} of parents</strong> are comfortable driving with autonomous features,
            only <strong style={{ color: "#a855f7" }}>{CHILD_SAFETY.parentsLetChildRideAlone} would allow their child to ride alone</strong>.
            <br /><br />
            The implied threshold requires crash-rate superiority (<strong>{CHILD_SAFETY.impliedCrashThreshold}</strong>) plus an entire safety infrastructure
            that does not yet exist: remote monitoring, secure interiors, emergency communication, child-specific protocols,
            verified pickup/dropoff, behavioral monitoring, and medical emergency response.
            <br /><br />
            Waymo's serious-injury rate — {CHILD_SAFETY.waymoSeriousInjuryRate} — approaches the crash threshold, but the non-crash safety systems for unaccompanied minors remain largely unbuilt.
          </div>
        </div>
      </Section>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

// Page-id → component mapping. Titles + subs come from PAGES_CONFIG (data.js).
var PAGE_COMPONENTS = {
  home: NinesScale,
  comparison: ComparisonPage,
  waymo: WaymoPage,
  tesla: TeslaPage,
  targets: TargetsPage,
};

export default function App() {
  var _s = useState("home");
  var page = _s[0];
  var setPage = _s[1];
  var pg = PAGES_CONFIG.find(function(p) { return p.id === page; }) || PAGES_CONFIG[0];
  var PageComponent = PAGE_COMPONENTS[page];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1f", color: "#e2e8f0", fontFamily: BODY }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <header style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#e2e8f0", margin: 0, fontFamily: FONTS, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#60a5fa" }}>AV</span>Progress
          </h1>
          <span style={{ fontSize: "10px", color: "#374151", fontFamily: FONTS }}>Autonomous Driving by the Numbers</span>
        </div>
        <div style={{ fontSize: "9px", color: "#27273f", marginTop: "3px", fontFamily: FONTS }}>
          {"Last updated: "}{SITE.lastUpdated}
        </div>
      </header>

      <Nav active={page} onChange={setPage} />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px", fontFamily: BODY, letterSpacing: "-0.01em" }}>{pg.title}</h1>
        <p style={{ fontSize: "13px", color: "#4b5563", margin: "0 0 24px", lineHeight: 1.5, maxWidth: "680px" }}>{pg.sub}</p>
        <PageComponent />
      </main>

      <footer style={{
        padding: "20px", borderTop: "1px solid rgba(255,255,255,0.03)",
        textAlign: "center", fontSize: "10px", color: "#27273f", fontFamily: FONTS, lineHeight: 1.6,
      }}>
        {"Data: " + FOOTER_SOURCES.join(" \u00B7 ")}
        <br />Not investment advice. Metrics use different methodologies.
      </footer>
    </div>
  );
}
