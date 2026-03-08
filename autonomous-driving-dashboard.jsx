import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend, ReferenceLine } from "recharts";

// ============================================================
// DATA
// ============================================================

const NINES_SCALE_DATA = [
  { nines: 1.1, miles: 13, label: "Tesla FSD v12.5", sublabel: "AMCI independent test", color: "#ef4444", category: "tesla", source: "https://electrek.co/2024/09/26/tesla-full-self-driving-third-party-testing-13-miles-between-interventions/", sourceLabel: "Electrek / AMCI" },
  { nines: 2.3, miles: 183, label: "Tesla FSD v12.5", sublabel: "Crowdsourced average", color: "#f87171", category: "tesla", source: "https://www.teslafsdtracker.com/", sourceLabel: "teslafsdtracker.com" },
  { nines: 2.7, miles: 493, label: "Tesla FSD v13", sublabel: "Crowdsourced average", color: "#fb923c", category: "tesla", source: "https://www.teslafsdtracker.com/", sourceLabel: "teslafsdtracker.com" },
  { nines: 3.2, miles: 1454, label: "Tesla FSD v14", sublabel: "Crowdsourced average", color: "#fbbf24", category: "tesla", source: "https://www.teslafsdtracker.com/", sourceLabel: "teslafsdtracker.com" },
  { nines: 4.5, miles: 29000, label: "Waymo (testing)", sublabel: "CA DMV disengagements", color: "#60a5fa", category: "waymo", source: "https://thelastdriverlicenseholder.com/2025/02/03/2024-disengagement-reports-from-california/", sourceLabel: "CA DMV via LDLH" },
  { nines: 4.8, miles: 57000, label: "Tesla Robotaxi", sublabel: "Austin crash rate", color: "#f59e0b", category: "tesla", source: "https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/", sourceLabel: "Fortune" },
  { nines: 5.7, miles: 529000, label: "Human Average", sublabel: "All police-reported crashes", color: "#a3a3a3", category: "human", isBaseline: true, source: "https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762", sourceLabel: "NHTSA" },
  { nines: 6.1, miles: 1350000, label: "Waymo", sublabel: "Injury crash rate", color: "#3b82f6", category: "waymo", source: "https://www.tandfonline.com/doi/full/10.1080/15389588.2024.2380786", sourceLabel: "Kusano et al. 2025" },
  { nines: 7.7, miles: 50000000, label: "Waymo", sublabel: "Serious injury crash rate", color: "#2563eb", category: "waymo", source: "https://waymo.com/safety/impact", sourceLabel: "Waymo Safety" },
  { nines: 7.9, miles: 86000000, label: "Human Fatal", sublabel: "Fatal crash rate only", color: "#737373", category: "human", isBaseline: true, source: "https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762", sourceLabel: "NHTSA" },
];

const TARGET_THRESHOLDS = [
  { nines: 5.7, label: "Match human average", description: "System matches avg human crash rate", color: "#fbbf24" },
  { nines: 6.5, label: "Regulatory confidence", description: "~5x better than humans — likely threshold for unsupervised permits", color: "#22c55e" },
  { nines: 7.0, label: "Remove steering wheel", description: "~20x better than humans — plausible threshold for steeringless mass-market", color: "#3b82f6" },
  { nines: 7.5, label: "Child safety threshold", description: "~50x better than humans — trust a child alone in the vehicle", color: "#a855f7" },
];

const TESLA_VERSION_PROGRESS = [
  { version: "v11", date: "2023 Q1", milesPerIntervention: 5, nines: 0.7 },
  { version: "v12.3", date: "2024 Q2", milesPerIntervention: 80, nines: 1.9 },
  { version: "v12.5", date: "2024 Q3", milesPerIntervention: 183, nines: 2.3 },
  { version: "v13", date: "2025 Q1", milesPerIntervention: 493, nines: 2.7 },
  { version: "v13.2", date: "2025 Q2", milesPerIntervention: 700, nines: 2.8 },
  { version: "v14", date: "2025 Q4", milesPerIntervention: 1454, nines: 3.2 },
];

const WAYMO_CRASH_COMPARISON = [
  { category: "Serious injury+", waymo: 0.02, human: 0.23, reduction: 90 },
  { category: "All injury", waymo: 0.74, human: 3.97, reduction: 81 },
  { category: "Airbag deploy", waymo: 0.26, human: 1.44, reduction: 82 },
  { category: "Pedestrian injury", waymo: 0.05, human: 0.59, reduction: 92 },
  { category: "Cyclist injury", waymo: 0.03, human: 0.18, reduction: 83 },
  { category: "Property dmg (Swiss Re)", waymo: 0.36, human: 3.08, reduction: 88 },
];

// ============================================================
// UTILITIES
// ============================================================

const formatMiles = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
};

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

const NAV_ITEMS = [
  { id: "home", label: "The Nines Scale" },
  { id: "comparison", label: "AV vs Humans" },
  { id: "waymo", label: "Waymo" },
  { id: "tesla", label: "Tesla FSD" },
  { id: "targets", label: "Road to Steeringless" },
];

function Nav({ active, onChange }) {
  return (
    <nav style={{
      display: "flex", gap: "2px", background: "#13132b",
      borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px",
      overflowX: "auto", WebkitOverflowScrolling: "touch",
    }}>
      {NAV_ITEMS.map(function(item) {
        return (
          <button key={item.id} onClick={function() { onChange(item.id); }} style={{
            padding: "13px 16px", background: active === item.id ? "rgba(255,255,255,0.05)" : "transparent",
            border: "none", borderBottom: active === item.id ? "2px solid #60a5fa" : "2px solid transparent",
            color: active === item.id ? "#e2e8f0" : "#64748b", cursor: "pointer",
            fontFamily: FONTS, fontSize: "11px", letterSpacing: "0.06em",
            textTransform: "uppercase", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>{item.label}</button>
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
  useEffect(function() { var t = setTimeout(function() { setAnim(true); }, 80); return function() { clearTimeout(t); }; }, []);

  var scaleMax = 8.5;
  var pct = function(n) { return Math.min(100, Math.max(0, (n / scaleMax) * 100)); };
  var sorted = NINES_SCALE_DATA.slice().sort(function(a, b) { return a.nines - b.nines; });

  var zoneColor = function(n) {
    if (n < 3.5) return "#ef4444";
    if (n < 5.0) return "#f59e0b";
    if (n < 5.7) return "#eab308";
    return "#22c55e";
  };

  var zoneLabel = function(n) {
    if (n < 3.5) return "DANGEROUS";
    if (n < 5.0) return "SUPERVISED ONLY";
    if (n < 5.7) return "APPROACHING HUMAN";
    return "SUPERHUMAN";
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
        <StatCard label="Waymo best" value="7.7" sublabel="nines — serious injury rate" accent="#3b82f6" sourceHref="https://waymo.com/safety/impact" sourceText="Waymo Safety" />
        <StatCard label="Tesla FSD v14" value="3.2" sublabel="nines — critical disengagement" accent="#f59e0b" sourceHref="https://www.teslafsdtracker.com/" sourceText="teslafsdtracker" />
        <StatCard label="Human baseline" value="5.7" sublabel="nines — police-reported crashes" accent="#a3a3a3" sourceHref="https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762" sourceText="NHTSA" />
        <StatCard label="Gap: Tesla to unsupervised" value="~460x" sublabel="vs. Elluswamy 670K mi target" accent="#ef4444" sourceHref="https://electrek.co/2025/01/13/elon-musk-misrepresents-data-that-shows-tesla-is-still-years-away-from-unsupervised-self-driving/" sourceText="Electrek" />
      </div>

      {/* Progress chart — dot plot */}
      <Section title="Progress toward autonomous driving" subtitle="Each system plotted on the nines scale — dashed lines mark key thresholds.">
        {(function() {
          var chartW = 960; // fixed inner width in px
          var dotY = 36;
          var labelW = 100; // label column width for overlap calc
          var numRows = 4;

          // Assign stagger rows: track last used x per row, pick first non-overlapping row
          var points = sorted.map(function(d) {
            return { nines: d.nines, miles: d.miles, label: d.label, sublabel: d.sublabel, color: d.color, row: 0 };
          });
          var lastXByRow = [];
          for (var r = 0; r < numRows; r++) lastXByRow.push(-Infinity);
          for (var i = 0; i < points.length; i++) {
            var xPx = (points[i].nines / scaleMax) * chartW;
            var placed = false;
            for (var row = 0; row < numRows; row++) {
              if (xPx - lastXByRow[row] >= labelW) {
                points[i].row = row;
                lastXByRow[row] = xPx;
                placed = true;
                break;
              }
            }
            if (!placed) {
              // fallback: pick row with largest gap
              var bestRow = 0; var bestGap = -Infinity;
              for (var row = 0; row < numRows; row++) {
                var gap = xPx - lastXByRow[row];
                if (gap > bestGap) { bestGap = gap; bestRow = row; }
              }
              points[i].row = bestRow;
              lastXByRow[bestRow] = xPx;
            }
          }

          var labelOffsets = [24, 72, 120, 168]; // px below dot per stagger row
          var maxOffset = labelOffsets[numRows - 1];
          var chartHeight = dotY + maxOffset + 52; // dot area + deepest label + text height

          return (
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px", padding: "20px 0 16px", overflowX: "auto", WebkitOverflowScrolling: "touch",
            }}>
              <div style={{ position: "relative", height: chartHeight + "px", minWidth: chartW + "px", margin: "0 28px" }}>
                {/* Axis line */}
                <div style={{
                  position: "absolute", top: dotY + "px", left: 0, right: 0, height: "1px",
                  background: "rgba(255,255,255,0.1)",
                }} />

                {/* Axis ticks — show miles at each nines integer */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(n) {
                  var milesAtTick = n === 0 ? "1" : formatMiles(Math.pow(10, n));
                  return (
                    <div key={n} style={{ position: "absolute", left: pct(n) + "%", top: dotY - 14 + "px" }}>
                      <div style={{
                        position: "absolute", left: "-1px", top: "14px", width: "1px", height: "6px",
                        background: "rgba(255,255,255,0.12)",
                      }} />
                      <div style={{
                        position: "absolute", left: "0", transform: "translateX(-50%)",
                        fontSize: "9px", color: "#4b5563", fontFamily: FONTS, whiteSpace: "nowrap",
                      }}>{milesAtTick}</div>
                    </div>
                  );
                })}

                {/* Axis label */}
                <div style={{
                  position: "absolute", top: dotY - 28 + "px", left: "50%", transform: "translateX(-50%)",
                  fontSize: "9px", color: "#374151", fontFamily: FONTS, letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}>MILES PER EVENT (log scale)</div>

                {/* Target threshold lines */}
                {TARGET_THRESHOLDS.map(function(t, ti) {
                  return (
                    <div key={t.nines} style={{
                      position: "absolute", left: pct(t.nines) + "%", top: dotY - 6 + "px",
                      width: "0px", height: chartHeight - dotY + "px",
                      borderLeft: "1px dashed " + t.color, opacity: 0.3,
                    }}>
                      <div style={{
                        position: "absolute", bottom: "2px",
                        left: "6px", whiteSpace: "nowrap",
                        fontSize: "8px", color: t.color, fontFamily: FONTS, opacity: 0.8,
                        letterSpacing: "0.02em",
                      }}>{formatMiles(Math.pow(10, t.nines))} mi — {t.label}</div>
                    </div>
                  );
                })}

                {/* Data points */}
                {points.map(function(d, i) {
                  var x = pct(d.nines);
                  var labelTop = dotY + labelOffsets[d.row];
                  return (
                    <div key={i}>
                      {/* Connecting line from dot to label */}
                      <div style={{
                        position: "absolute", left: x + "%", top: dotY + 6 + "px",
                        width: "0px", height: labelOffsets[d.row] - 8 + "px",
                        borderLeft: "1px solid " + d.color, opacity: 0.2,
                      }} />
                      {/* Dot */}
                      <div style={{
                        position: "absolute", left: "calc(" + x + "% - 5px)", top: dotY - 5 + "px",
                        width: "10px", height: "10px", borderRadius: "50%",
                        background: d.color, boxShadow: "0 0 8px " + d.color + "50",
                        opacity: anim ? 1 : 0, transform: anim ? "scale(1)" : "scale(0)",
                        transition: "all 0.4s ease " + (i * 60) + "ms",
                        zIndex: 2,
                      }} />
                      {/* Label */}
                      <div style={{
                        position: "absolute", left: x + "%", top: labelTop + "px",
                        transform: "translateX(-50%)", textAlign: "center",
                        opacity: anim ? 1 : 0, transition: "opacity 0.4s ease " + (i * 60 + 200) + "ms",
                        zIndex: 1, width: labelW - 6 + "px",
                      }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: d.color, fontFamily: FONTS, lineHeight: 1.1 }}>
                          {formatMiles(d.miles)} mi
                        </div>
                        <div style={{ fontSize: "10px", fontWeight: 600, color: "#cbd5e1", lineHeight: 1.2, marginTop: "2px" }}>
                          {d.label}
                        </div>
                        <div style={{ fontSize: "9px", color: "#4b5563", lineHeight: 1.2 }}>
                          {d.sublabel}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </Section>

      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px", padding: "16px 0", overflow: "hidden",
      }}>
        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: "minmax(150px, 180px) 54px 1fr 80px 80px",
          gap: "8px", padding: "0 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          alignItems: "end",
        }}>
          {["System", "Nines", "Reliability scale", "Per event", "Per driver"].map(function(h, i) {
            return (
              <div key={i} style={{
                fontSize: "9px", color: "#4b5563", textTransform: "uppercase",
                letterSpacing: "0.1em", fontFamily: FONTS, fontWeight: 600,
                textAlign: i >= 3 ? "right" : "left",
              }}>{h}</div>
            );
          })}
        </div>

        {/* Data rows */}
        {sorted.map(function(d, i) {
          var barWidth = pct(d.nines);
          var isHuman = d.category === "human";
          var prevZone = i > 0 ? zoneLabel(sorted[i - 1].nines) : null;
          var currentZone = zoneLabel(d.nines);
          var showZone = i === 0 || currentZone !== prevZone;

          return (
            <div key={i}>
              {showZone && (
                <div style={{
                  padding: "8px 20px 2px", fontSize: "9px", color: zoneColor(d.nines),
                  textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: FONTS,
                  fontWeight: 700, opacity: 0.6,
                }}>{currentZone}</div>
              )}
              <div style={{
                display: "grid", gridTemplateColumns: "minmax(150px, 180px) 54px 1fr 80px 80px",
                gap: "8px", padding: "9px 20px", alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.025)",
                background: isHuman ? "rgba(255,255,255,0.02)" : "transparent",
                opacity: anim ? 1 : 0, transform: anim ? "translateX(0)" : "translateX(-8px)",
                transition: "all 0.4s ease " + (i * 50) + "ms",
              }}>
                {/* Label column */}
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: d.color, lineHeight: 1.25 }}>{d.label}</div>
                  <div style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.3, marginTop: "1px" }}>{d.sublabel}</div>
                  <Src href={d.source}>{d.sourceLabel}</Src>
                </div>

                {/* Nines number */}
                <div style={{ fontSize: "16px", fontWeight: 700, color: d.color, fontFamily: FONTS }}>{d.nines}</div>

                {/* Bar */}
                <div style={{ position: "relative", height: "20px" }}>
                  <div style={{
                    position: "absolute", top: "8px", left: 0, right: 0, height: "4px",
                    background: "rgba(255,255,255,0.03)", borderRadius: "2px",
                  }} />
                  <div style={{
                    position: "absolute", top: "3px", left: pct(5.7) + "%", width: "1px",
                    height: "14px", background: "rgba(163,163,163,0.25)",
                  }} />
                  <div style={{
                    position: "absolute", top: "8px", left: 0,
                    width: anim ? barWidth + "%" : "0%", height: "4px",
                    background: "linear-gradient(90deg, " + d.color + "30, " + d.color + ")",
                    borderRadius: "2px", transition: "width 0.7s ease " + (i * 50 + 150) + "ms",
                  }} />
                  <div style={{
                    position: "absolute", top: "5px",
                    left: anim ? "calc(" + barWidth + "% - 5px)" : "-5px",
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: d.color, boxShadow: "0 0 6px " + d.color + "40",
                    transition: "left 0.7s ease " + (i * 50 + 150) + "ms",
                  }} />
                </div>

                {/* Miles */}
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", fontFamily: FONTS, textAlign: "right" }}>
                  {formatMiles(d.miles)} mi
                </div>

                {/* Years */}
                <div style={{ fontSize: "11px", color: "#4b5563", fontFamily: FONTS, textAlign: "right" }}>
                  {yearsPerCrash(d.miles)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Target thresholds */}
        <div style={{ padding: "14px 20px 6px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "9px", color: "#374151", textTransform: "uppercase",
            letterSpacing: "0.1em", fontFamily: FONTS, marginBottom: "6px", fontWeight: 600 }}>
            Estimated target thresholds
          </div>
          {TARGET_THRESHOLDS.map(function(t, i) {
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "minmax(150px, 180px) 54px 1fr 80px 80px",
                gap: "8px", padding: "5px 0", alignItems: "center", opacity: 0.7,
              }}>
                <div style={{ fontSize: "11px", color: t.color, fontWeight: 500 }}>{t.label}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: t.color, fontFamily: FONTS }}>{t.nines}</div>
                <div style={{ position: "relative", height: "12px" }}>
                  <div style={{
                    position: "absolute", top: "4px", left: pct(t.nines) + "%",
                    width: "10px", height: "4px", background: t.color, borderRadius: "2px",
                    opacity: 0.5, transform: "translateX(-5px)",
                  }} />
                </div>
                <div style={{ fontSize: "10px", color: "#4b5563", fontFamily: FONTS, textAlign: "right" }}>
                  {formatMiles(Math.pow(10, t.nines))} mi
                </div>
                <div style={{ fontSize: "10px", color: "#374151", fontFamily: FONTS, textAlign: "right" }}>
                  {yearsPerCrash(Math.pow(10, t.nines))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px", justifyContent: "center" }}>
        {[
          { color: "#ef4444", label: "Tesla (independent)" },
          { color: "#fbbf24", label: "Tesla (crowdsourced)" },
          { color: "#f59e0b", label: "Tesla Robotaxi" },
          { color: "#3b82f6", label: "Waymo" },
          { color: "#a3a3a3", label: "Human baseline" },
        ].map(function(l, i) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: "10px", color: "#64748b" }}>{l.label}</span>
            </div>
          );
        })}
      </div>

      <Note>
        Disengagements and crashes are different metrics. Tesla "miles per intervention" and Waymo "miles per crash" are not directly comparable.
        The nines shown use each system's best available metric — see source links for methodology.
        Human crash data underreports minor incidents by ~60% (<Src href="https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762">NHTSA</Src>),
        while AVs report virtually every contact event.
      </Note>

      <div style={{
        marginTop: "20px", padding: "18px 22px",
        background: "linear-gradient(135deg, rgba(96,165,250,0.07), rgba(168,85,247,0.05))",
        border: "1px solid rgba(96,165,250,0.12)", borderRadius: "8px",
      }}>
        <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: 1.7 }}>
          <strong style={{ color: "#60a5fa" }}>The key insight:</strong> Each additional "nine" requires a 10x improvement.
          Tesla FSD v14 at 3.2 nines needs to improve <strong>~360x</strong> to match the average human driver at 5.7 nines.
          Waymo has crossed the human baseline on crash metrics — but only within carefully mapped operational domains.
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
  var compData = [
    { metric: "Police-reported crash rate", human: "529K", waymo: "~476K", tesla: "~57K", waymoGood: false, teslaGood: false, src: "https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762", srcLabel: "NHTSA" },
    { metric: "Injury crash rate", human: "252K", waymo: "1.35M", tesla: "\u2014", waymoGood: true, teslaGood: null, src: "https://www.tandfonline.com/doi/full/10.1080/15389588.2024.2380786", srcLabel: "Kusano et al." },
    { metric: "Serious injury crash rate", human: "~5M", waymo: "50M", tesla: "\u2014", waymoGood: true, teslaGood: null, src: "https://waymo.com/safety/impact", srcLabel: "Waymo Safety" },
    { metric: "Fatal crash rate", human: "86M", waymo: "0 fatalities*", tesla: "\u2014", waymoGood: true, teslaGood: null, src: "https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813762", srcLabel: "NHTSA" },
  ];

  return (
    <div>
      <Section title="Crash rates: AV systems vs. human drivers" subtitle="Higher miles-per-crash = safer. Green = outperforming human average. All rates in miles per crash.">
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Metric", "Human avg", "Waymo", "Tesla Robotaxi", "Source"].map(function(h, i) {
                  return (<th key={i} style={{ padding: "11px 14px", textAlign: i === 0 || i === 4 ? "left" : "right", fontSize: "10px", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONTS, fontWeight: 600 }}>{h}</th>);
                })}
              </tr>
            </thead>
            <tbody>
              {compData.map(function(r, i) {
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "12px 14px", fontSize: "12px", color: "#cbd5e1" }}>{r.metric}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontSize: "13px", fontFamily: FONTS, color: "#a3a3a3", fontWeight: 600 }}>{r.human}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontSize: "13px", fontFamily: FONTS, fontWeight: 600, color: r.waymoGood === true ? "#22c55e" : r.waymoGood === false ? "#fbbf24" : "#4b5563" }}>{r.waymo}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontSize: "13px", fontFamily: FONTS, fontWeight: 600, color: r.teslaGood === true ? "#22c55e" : r.teslaGood === false ? "#ef4444" : "#4b5563" }}>{r.tesla}</td>
                    <td style={{ padding: "12px 14px" }}><Src href={r.src}>{r.srcLabel}</Src></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: "10px", color: "#374151", marginTop: "6px" }}>
          * Waymo: zero fatalities in 127M+ driverless miles. Tesla robotaxi data from <Src href="https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/">Fortune analysis</Src>.
        </div>
      </Section>

      <Section title="Waymo crash reduction by severity" subtitle="Incidents per million miles. Peer-reviewed data at 56.7M miles and Swiss Re insurance data at 25.3M miles.">
        <div style={{ height: "320px" }}>
          <ResponsiveContainer>
            <BarChart data={WAYMO_CRASH_COMPARISON} layout="vertical" margin={{ left: 140, right: 40, top: 5, bottom: 5 }}>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
          {WAYMO_CRASH_COMPARISON.map(function(d, i) {
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
  var milesData = [
    { period: "2020", miles: 6 }, { period: "2021", miles: 10 },
    { period: "2022", miles: 20 }, { period: "2023", miles: 35 },
    { period: "2024", miles: 60 }, { period: "Sep 2025", miles: 127 },
  ];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
        <StatCard label="Driverless miles" value="127M+" sublabel="Through Sep 2025" accent="#3b82f6" sourceHref="https://waymo.com/safety/impact" sourceText="Waymo Safety" />
        <StatCard label="Weekly rides" value="450K+" sublabel="Across 10 cities" accent="#60a5fa" sourceHref="https://www.cnbc.com/2025/12/08/waymo-paid-rides-robotaxi-tesla.html" sourceText="CNBC" />
        <StatCard label="Safety vs humans" value={"↓90%"} sublabel="Fewer serious injuries" accent="#22c55e" sourceHref="https://www.tandfonline.com/doi/full/10.1080/15389588.2024.2380786" sourceText="Kusano et al." />
        <StatCard label="Cities" value="10" sublabel="Feb 2026" accent="#8b5cf6" sourceHref="https://www.axios.com/2026/02/24/waymo-robotaxis-now-available-in-10-cities" sourceText="Axios" />
      </div>

      <Section title="Cumulative driverless miles" subtitle="Rider-only miles (no safety driver). Waymo now drives ~2M autonomous miles per week.">
        <div style={{ height: "260px" }}>
          <ResponsiveContainer>
            <BarChart data={milesData} margin={{ left: 10, right: 10, top: 15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#4b5563", fontSize: 10, fontFamily: FONTS }} label={{ value: "Million miles", angle: -90, position: "insideLeft", fill: "#374151", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1a1a30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }} formatter={function(v) { return [v + "M miles", "Driverless"]; }} />
              <Bar dataKey="miles" radius={[4, 4, 0, 0]} barSize={36}>
                {milesData.map(function(_, i) { return <Cell key={i} fill={i === milesData.length - 1 ? "#2563eb" : "#3b82f660"} />; })}
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
          {WAYMO_CRASH_COMPARISON.map(function(d, i) {
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
          {[
            { date: "Oct 2025", text: "NHTSA investigation: 19\u201320 school bus passing incidents in Austin", severity: "high", src: "https://www.npr.org/2025/12/06/nx-s1-5635614/waymo-school-buses-recall", srcLabel: "NPR" },
            { date: "Dec 2025", text: "Voluntary recall of 3,067 vehicles for school bus detection fix", severity: "medium", src: "https://www.npr.org/2025/12/06/nx-s1-5635614/waymo-school-buses-recall", srcLabel: "NPR" },
            { date: "Dec 2025", text: "SF power outage caused some vehicles to freeze in intersections", severity: "medium", src: "https://tech.slashdot.org/story/25/12/27/0645206/waymo-updates-vehicles-to-better-handle-power-outages---but-still-faces-criticism", srcLabel: "Slashdot" },
            { date: "Ongoing", text: "Operates only in pre-mapped geofenced areas; no snow capability", severity: "info", src: null, srcLabel: null },
            { date: "Ongoing", text: "Remote operators assist with edge cases \u2014 not fully independent", severity: "info", src: null, srcLabel: null },
          ].map(function(item, i) {
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
                  {item.src && <span style={{ marginLeft: "6px" }}><Src href={item.src}>{item.srcLabel}</Src></span>}
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
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
        <StatCard label="FSD v14 best" value="1,454" sublabel="Miles / critical disengagement" accent="#fbbf24" sourceHref="https://www.teslafsdtracker.com/" sourceText="teslafsdtracker" />
        <StatCard label="Improvement" value={"8\u00D7"} sublabel="v12.5 to v14 in 14 months" accent="#f59e0b" sourceHref="https://www.teslafsdtracker.com/" sourceText="teslafsdtracker" />
        <StatCard label="Robotaxi crash rate" value="1/57K" sublabel="Miles per crash (Austin)" accent="#ef4444" sourceHref="https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/" sourceText="Fortune" />
        <StatCard label="Gap to unsupervised" value={"~460\u00D7"} sublabel="vs. Elluswamy 670K target" accent="#dc2626" sourceHref="https://electrek.co/2025/01/13/elon-musk-misrepresents-data-that-shows-tesla-is-still-years-away-from-unsupervised-self-driving/" sourceText="Electrek" />
      </div>

      <Section title="FSD version-over-version improvement" subtitle="Miles between critical disengagements by version. Crowdsourced from teslafsdtracker.com.">
        <div style={{ height: "280px" }}>
          <ResponsiveContainer>
            <BarChart data={TESLA_VERSION_PROGRESS} margin={{ left: 10, right: 30, top: 15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="version" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#4b5563", fontSize: 10, fontFamily: FONTS }} label={{ value: "Miles / intervention", angle: -90, position: "insideLeft", fill: "#374151", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1a1a30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }} formatter={function(v) { return [v.toLocaleString() + " miles", "Miles/intervention"]; }} />
              <Bar dataKey="milesPerIntervention" radius={[4, 4, 0, 0]} barSize={36}>
                {TESLA_VERSION_PROGRESS.map(function(_, i) { return <Cell key={i} fill={"hsl(" + (35 + i * 8) + ", 90%, " + (50 + i * 4) + "%)"} />; })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontSize: "10px", color: "#374151", marginTop: "4px" }}>
          Source: <Src href="https://www.teslafsdtracker.com/">teslafsdtracker.com</Src> (crowdsourced)
        </div>
        <Note>
          Crowdsourced data skews optimistic \u2014 enthusiast drivers in favorable conditions.
          Independent testing by <Src href="https://electrek.co/2024/09/26/tesla-full-self-driving-third-party-testing-13-miles-between-interventions/">AMCI</Src> on
          standardized routes found just 13 miles between interventions on v12.5.
        </Note>
        <div style={{ marginTop: "16px", padding: "16px 20px", background: "rgba(251,191,35,0.05)", border: "1px solid rgba(251,191,35,0.12)", borderRadius: "8px" }}>
          <div style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: 1.7 }}>
            <strong style={{ color: "#fbbf24" }}>If Tesla maintains ~2.7x improvement per version:</strong>
            <br />v15 \u2192 ~3,900 mi \u00B7 v16 \u2192 ~10,500 mi \u00B7 v17 \u2192 ~28,400 mi \u00B7 v18 \u2192 ~76,700 mi \u00B7 v19 \u2192 ~207,000 mi \u00B7 v20 \u2192 ~560,000 mi
            <br /><span style={{ color: "#64748b" }}>~6 more versions (~3 years) to reach the unsupervised threshold \u2014 if the rate holds. Historically, improvement rates slow at higher reliability.</span>
          </div>
        </div>
      </Section>

      <Section title="Supervised FSD vs. Austin Robotaxi" subtitle="Two very different products with very different safety records.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "12px" }}>FSD Supervised (consumer)</div>
            {[
              ["Best crowdsourced rate", "1,454 mi/int", "https://www.teslafsdtracker.com/", "tracker"],
              ["Independent test (AMCI)", "13 mi/int", "https://electrek.co/2024/09/26/tesla-full-self-driving-third-party-testing-13-miles-between-interventions/", "Electrek"],
              ["Coast-to-coast record", "2,732 mi, 0 int", "https://www.teslarati.com/tesla-fsd-successfully-completes-full-coast-to-coast-drive-with-zero-interventions/", "Teslarati"],
              ["Longest streak", "12,961 mi", "https://www.notateslaapp.com/news/3514/tesla-owner-reaches-almost-13000-miles-of-intervention-free-fsd-driving", "NotATeslaApp"],
              ["NHTSA investigation", "2.88M vehicles", "https://opentools.ai/news/nhtsa-investigates-teslas-fsd-mode-for-traffic-safety-violations-what-it-means-for-the-future-of-autonomous-driving", "OpenTools"],
              ["Requires", "Human driver", null, null],
            ].map(function(row, i) {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                  <span style={{ color: "#64748b" }}>{row[0]} {row[2] && <Src href={row[2]}>{row[3]}</Src>}</span>
                  <span style={{ color: "#cbd5e1", fontFamily: FONTS }}>{row[1]}</span>
                </div>
              );
            })}
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "8px", padding: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", marginBottom: "12px" }}>Robotaxi (Austin, unsupervised)</div>
            {[
              ["Launched", "June 2025"], ["Unsupervised since", "Jan 2026"],
              ["Fleet size", "~31 vehicles"], ["Miles driven", "~800,000"],
              ["Crashes", "14"], ["Crash rate", "1 per ~57K mi"],
              ["vs. human avg", "~9x worse"], ["vs. Tesla w/o AP", "~4x worse"],
            ].map(function(row, i) {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.025)", fontSize: "11px" }}>
                  <span style={{ color: "#64748b" }}>{row[0]}</span>
                  <span style={{ color: "#fca5a5", fontFamily: FONTS }}>{row[1]}</span>
                </div>
              );
            })}
            <div style={{ marginTop: "8px" }}><Src href="https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/">Fortune analysis of Tesla NHTSA disclosure</Src></div>
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
          {[
            { year: "2015", claim: "Full autonomy by 2018", result: "Not achieved", src: "https://electrek.co/2025/01/13/elon-musk-misrepresents-data-that-shows-tesla-is-still-years-away-from-unsupervised-self-driving/", srcLabel: "Electrek" },
            { year: "2016", claim: "LA to NY autonomous by end of 2017", result: "Achieved Dec 2025 \u2014 8 years late", src: "https://www.teslarati.com/tesla-fsd-successfully-completes-full-coast-to-coast-drive-with-zero-interventions/", srcLabel: "Teslarati" },
            { year: "2019", claim: "1 million robotaxis by 2020", result: "31 in Austin as of Feb 2026", src: "https://fortune.com/2026/02/26/tesla-robotaxis-4x-8x-worse-than-humans-at-driving-safety-record-crashes/", srcLabel: "Fortune" },
            { year: "2022", claim: "Robotaxi production in 2024", result: "Delayed to 2025-2026", src: "https://techcrunch.com/2025/01/30/elon-musk-reveals-elon-musk-was-wrong-about-full-self-driving/", srcLabel: "TechCrunch" },
            { year: "2025", claim: "Millions of robotaxis in H2 2025", result: "~31 operating", src: "https://electrek.co/2025/04/22/here-are-all-crazy-claims-elon-musk-made-tesla-self-driving-today/", srcLabel: "Electrek" },
            { year: "2025", claim: "HW3 cars can do unsupervised FSD", result: "Admitted upgrade needed", src: "https://techcrunch.com/2025/01/30/elon-musk-reveals-elon-musk-was-wrong-about-full-self-driving/", srcLabel: "TechCrunch" },
          ].map(function(item, i) {
            return (
              <div key={i} style={{ display: "flex", gap: "14px", padding: "10px 0 10px 14px", borderLeft: "2px solid rgba(239,68,68,0.25)" }}>
                <div style={{ fontSize: "11px", color: "#f59e0b", fontFamily: FONTS, minWidth: "42px", fontWeight: 600 }}>{item.year}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#cbd5e1" }}>{item.claim}</div>
                  <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px" }}>
                    {"\u274C"} {item.result} <Src href={item.src}>{item.srcLabel}</Src>
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
      <Section title="Target thresholds: what nines do we need?" subtitle="No regulator has published specific thresholds. These are inferred from expert commentary and human benchmarks.">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TARGET_THRESHOLDS.map(function(t, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid " + t.color + "20", borderRadius: "8px", borderLeft: "4px solid " + t.color, padding: "14px 18px" }}>
                <div style={{ minWidth: "70px" }}>
                  <div style={{ fontSize: "26px", fontWeight: 700, color: t.color, fontFamily: FONTS, lineHeight: 1 }}>{t.nines}</div>
                  <div style={{ fontSize: "9px", color: "#4b5563", marginTop: "2px" }}>nines</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{t.label}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{t.description}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: "100px" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontFamily: FONTS }}>{formatMiles(Math.pow(10, t.nines))} mi</div>
                  <div style={{ fontSize: "10px", color: "#4b5563" }}>{yearsPerCrash(Math.pow(10, t.nines))} per driver</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Regulatory barriers" subtitle="The gap is not just technical \u2014 it is legal.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
          {[
            { title: "Federal exemption cap", detail: "Max 2,500 non-compliant vehicles/year. No new legislation in a decade.", status: "blocked", src: "https://www.foley.com/insights/publications/2025/11/driving-into-2026-the-state-of-nhtsa-and-the-future-of-vehicle-safety-regulation/", srcLabel: "Foley & Lardner" },
            { title: "FMVSS updates", detail: "Crashworthiness updated (2022). Transmission, windshield, lighting still in progress.", status: "partial", src: "https://www.federalregister.gov/documents/2022/03/30/2022-05426/occupant-protection-for-vehicles-with-automated-driving-systems", srcLabel: "Federal Register" },
            { title: "AV STEP program", detail: "Voluntary safety-case framework proposed Jan 2025. No numeric thresholds. Not finalized.", status: "partial", src: "https://www.cov.com/-/media/files/corporate/publications/2025/02/what-nhtsas-autonomous-vehicle-proposal-means-for-cos.pdf", srcLabel: "Covington" },
            { title: "SELF DRIVE Act", detail: "Would raise/eliminate 2,500 cap. Failed for ~10 years. New draft late 2025.", status: "blocked", src: "https://www.theavindustry.org/press-release/avia-statement-on-the-introduction-of-self-drive-act", srcLabel: "AVIA" },
            { title: "Zoox exemption", detail: "First NHTSA exemption for steeringless American AV (Aug 2025). Only 64 demo vehicles.", status: "achieved", src: "https://www.nhtsa.gov/press-releases/nhtsa-issues-first-ever-demonstration-exemption-american-built-automated-vehicles", srcLabel: "NHTSA" },
            { title: "NHTSA staffing", detail: "Agency cut ~25% (780 to 575 employees). Reduced rulemaking capacity.", status: "blocked", src: "https://www.foley.com/insights/publications/2025/11/driving-into-2026-the-state-of-nhtsa-and-the-future-of-vehicle-safety-regulation/", srcLabel: "Foley & Lardner" },
          ].map(function(item, i) {
            var statusColors = { achieved: { bg: "rgba(34,197,94,0.12)", fg: "#22c55e" }, partial: { bg: "rgba(251,191,35,0.12)", fg: "#fbbf24" }, blocked: { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" } };
            var sc = statusColors[item.status];
            return (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#e2e8f0" }}>{item.title}</div>
                  <div style={{ fontSize: "8px", padding: "2px 7px", borderRadius: "10px", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", background: sc.bg, color: sc.fg }}>{item.status}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.5, marginBottom: "6px" }}>{item.detail}</div>
                <Src href={item.src}>{item.srcLabel}</Src>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Expert consensus on timelines" subtitle="McKinsey (91 experts, Jan 2026), S&P Global, WEF, and BCG.">
        <div>
          {[
            { year: "Now", event: "L4 robotaxis in select cities (Waymo)", status: "\u2705 Happening", color: "#22c55e", src: "https://www.axios.com/2026/02/24/waymo-robotaxis-now-available-in-10-cities", srcLabel: "Axios" },
            { year: "~2028", event: "L4 robotaxis in 20+ cities globally", status: "On track", color: "#60a5fa", src: "https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/our-insights/future-of-autonomous-vehicles-industry", srcLabel: "McKinsey" },
            { year: "~2030", event: "Large-scale L4 robotaxi rollout", status: "Consensus", color: "#60a5fa", src: "https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/our-insights/future-of-autonomous-vehicles-industry", srcLabel: "McKinsey" },
            { year: "~2032", event: "L4 in privately owned vehicles (limited)", status: "Optimistic", color: "#fbbf24", src: "https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/our-insights/future-of-autonomous-vehicles-industry", srcLabel: "McKinsey" },
            { year: "~2035", event: "<6% of new vehicles sold have L4", status: "Forecast", color: "#fbbf24", src: "https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/our-insights/future-of-autonomous-vehicles-industry", srcLabel: "McKinsey" },
            { year: "2035+", event: "Consumer steeringless vehicles (mass market)", status: "'Unlikely by 2035'", color: "#ef4444", src: "https://www.spglobal.com/mobility/en/research-analysis/fuel-for-thought-waiting-for-autonomy.html", srcLabel: "S&P Global" },
            { year: "2040s\u201360s", event: "Most safety/mobility benefits materialize", status: "Long-range", color: "#ef4444", src: "https://www.weforum.org/stories/2025/05/autonomous-vehicles-technology-future/", srcLabel: "WEF" },
          ].map(function(item, i) {
            return (
              <div key={i} style={{ display: "flex", gap: "14px", padding: "10px 0 10px 14px", borderLeft: "2px solid " + item.color + "30" }}>
                <div style={{ minWidth: "70px", fontSize: "12px", fontWeight: 700, color: item.color, fontFamily: FONTS }}>{item.year}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#e2e8f0" }}>{item.event}</div>
                  <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                    {item.status}{" \u00B7 "}<Src href={item.src}>{item.srcLabel}</Src>
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
            Research from <Src href="https://injury.research.chop.edu/blog/posts/self-driving-vehicles-and-child-passenger-safety">Children's Hospital of Philadelphia</Src> found
            that while <strong style={{ color: "#a855f7" }}>63% of parents</strong> are comfortable driving with autonomous features,
            only <strong style={{ color: "#a855f7" }}>21% would allow their child to ride alone</strong>.
            <br /><br />
            The implied threshold requires crash-rate superiority (<strong>7+ nines</strong>, ~1 crash per 10M+ miles) plus an entire safety infrastructure
            that does not yet exist: remote monitoring, secure interiors, emergency communication, child-specific protocols,
            verified pickup/dropoff, behavioral monitoring, and medical emergency response.
            <br /><br />
            Waymo's serious-injury rate (~7.7 nines) approaches the crash threshold, but the non-crash safety systems for unaccompanied minors remain largely unbuilt.
          </div>
        </div>
      </Section>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

var PAGES = {
  home: { title: "The Nines Scale", sub: "Each additional 'nine' requires a 10x improvement. This is why the last mile to full autonomy is the hardest.", C: NinesScale },
  comparison: { title: "AV vs. Human Drivers", sub: "Side-by-side performance data using the most rigorous available metrics.", C: ComparisonPage },
  waymo: { title: "Waymo Deep Dive", sub: "127M driverless miles. Peer-reviewed safety data. The industry's clearest proof.", C: WaymoPage },
  tesla: { title: "Tesla FSD Deep Dive", sub: "Rapid version-over-version improvement, but a large gap remains to unsupervised operation.", C: TeslaPage },
  targets: { title: "Road to Steeringless", sub: "What reliability and regulatory milestones must be cleared to remove the steering wheel?", C: TargetsPage },
};

export default function App() {
  var _s = useState("home");
  var page = _s[0];
  var setPage = _s[1];
  var pg = PAGES[page];

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
          Last updated: Feb 2026
        </div>
      </header>

      <Nav active={page} onChange={setPage} />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px", fontFamily: BODY, letterSpacing: "-0.01em" }}>{pg.title}</h1>
        <p style={{ fontSize: "13px", color: "#4b5563", margin: "0 0 24px", lineHeight: 1.5, maxWidth: "680px" }}>{pg.sub}</p>
        <pg.C />
      </main>

      <footer style={{
        padding: "20px", borderTop: "1px solid rgba(255,255,255,0.03)",
        textAlign: "center", fontSize: "10px", color: "#27273f", fontFamily: FONTS, lineHeight: 1.6,
      }}>
        Data: NHTSA {"\u00B7"} CA DMV {"\u00B7"} Waymo Safety Impact {"\u00B7"} Swiss Re {"\u00B7"} Kusano et al. 2025 {"\u00B7"}
        teslafsdtracker.com {"\u00B7"} AMCI Testing {"\u00B7"} Fortune {"\u00B7"} Electrek {"\u00B7"} McKinsey {"\u00B7"} RAND {"\u00B7"} CHOP
        <br />Not investment advice. Metrics use different methodologies.
      </footer>
    </div>
  );
}
