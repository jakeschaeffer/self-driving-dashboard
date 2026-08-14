// Shared design tokens and UI primitives. Every page builds from these —
// if a visual pattern appears on more than one page, it lives here.
import { useState, useEffect } from "react";

export const MONO = "'JetBrains Mono', 'Fira Code', monospace";
export const BODY = "'Sora', 'Space Grotesk', -apple-system, sans-serif";

// The one card surface used across the site.
export const CARD = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
};

export const formatMiles = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
};

// Viewport-width hook. Pages switch grid layouts below ~720px so multi-column
// blocks don't get starved of width on mobile.
export function useNarrow(breakpoint = 720) {
  const [narrow, setNarrow] = useState(
    typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return narrow;
}

export function Src({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#60a5fa", fontSize: "11px", textDecoration: "none",
        borderBottom: "1px dotted rgba(96,165,250,0.4)", fontFamily: MONO,
      }}
    >{children}</a>
  );
}

// Small "Source: …" line under a chart or table.
export function SourceLine({ children }) {
  return (
    <div style={{ fontSize: "10px", color: "#374151", marginTop: "6px" }}>{children}</div>
  );
}

export function Note({ children }) {
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

export function StatCard({ label, value, sublabel, accent = "#60a5fa", source }) {
  return (
    <div style={{ ...CARD, padding: "18px 20px", flex: "1 1 180px", minWidth: "170px" }}>
      <div style={{
        fontSize: "10px", color: "#64748b", textTransform: "uppercase",
        letterSpacing: "0.08em", fontFamily: MONO, marginBottom: "6px",
      }}>{label}</div>
      <div style={{
        fontSize: "26px", fontWeight: 700, color: accent,
        fontFamily: MONO, lineHeight: 1.1,
      }}>{value}</div>
      {sublabel && <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "5px" }}>{sublabel}</div>}
      {source && <div style={{ marginTop: "6px" }}><Src href={source.url}>{source.label}</Src></div>}
    </div>
  );
}

// The row of headline stat cards at the top of each page.
export function StatCards({ stats }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
      {stats.map((s, i) => <StatCard key={i} {...s} />)}
    </div>
  );
}

export function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: "44px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0", margin: "0 0 4px", fontFamily: BODY }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

// ============================================================
// CHARTS — small, dependency-free replacements for Recharts.
// ============================================================

// Horizontal bar list: label | bar | value. Works down to 320px.
// rows: { label, sub, display, pct, color }
export function HBarList({ rows }) {
  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: "10px", padding: "16px 20px" }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "78px 1fr 88px",
          gap: "12px", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "12px", color: "#cbd5e1", fontFamily: MONO, fontWeight: 600, lineHeight: 1.2 }}>{r.label}</div>
            {r.sub && <div style={{ fontSize: "9px", color: "#4b5563", fontFamily: MONO, marginTop: "2px" }}>{r.sub}</div>}
          </div>
          <div style={{ position: "relative", height: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: r.pct + "%", background: r.color, borderRadius: "6px",
            }} />
          </div>
          <div style={{ textAlign: "right", fontFamily: MONO, fontSize: "12px", fontWeight: 700, color: r.color, whiteSpace: "nowrap" }}>
            {r.display} <span style={{ color: "#4b5563", fontWeight: 500, fontSize: "10px" }}>mi</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Column chart: one column per period, value label on top.
// data: { label, value, display }
export function ColumnChart({ data, accent = "#2563eb" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ ...CARD, padding: "20px 20px 14px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "3%", height: "190px" }}>
        {data.map((d, i) => {
          const last = i === data.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <div style={{
                fontSize: "11px", fontWeight: 700, fontFamily: MONO,
                color: last ? "#93c5fd" : "#64748b", marginBottom: "6px", whiteSpace: "nowrap",
              }}>{d.display}</div>
              <div style={{
                width: "100%", maxWidth: "52px",
                height: Math.max((d.value / max) * 150, 3) + "px",
                background: last ? accent : accent + "50",
                borderRadius: "4px 4px 0 0",
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "3%", marginTop: "8px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "10px", color: "#64748b", fontFamily: MONO, whiteSpace: "nowrap" }}>{d.label}</div>
        ))}
      </div>
    </div>
  );
}

// Grid of A-vs-B pair cards with a reduction badge.
// items: { category, waymo, human, reduction, source? }
// waymo/human may be null — the publisher gave a reduction but no underlying
// rate. The card then leads with the reduction instead of showing empty numbers.
export function PairStatGrid({ items, aName = "Waymo", bName = "Human", unit }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
      {items.map((d, i) => {
        const hasRates = d.waymo != null && d.human != null;
        return (
          <div key={i} style={{ ...CARD, padding: "14px 16px" }}>
            <div style={{
              fontSize: "10px", color: "#64748b", marginBottom: "10px", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{d.category}</div>
            {hasRates ? (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#3b82f6", fontFamily: MONO }}>{d.waymo}</div>
                    <div style={{ fontSize: "8px", color: "#4b5563", textTransform: "uppercase" }}>{aName}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#374151" }}>vs</div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#6b7280", fontFamily: MONO }}>{d.human}</div>
                    <div style={{ fontSize: "8px", color: "#4b5563", textTransform: "uppercase" }}>{bName}</div>
                  </div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", fontFamily: MONO }}>{"↓"} {d.reduction}%</div>
              </>
            ) : (
              <div style={{ marginBottom: "6px" }}>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#22c55e", fontFamily: MONO }}>{"↓"} {d.reduction}%</div>
                <div style={{ fontSize: "8px", color: "#4b5563", textTransform: "uppercase" }}>rate not published</div>
              </div>
            )}
            {d.source && <div style={{ marginTop: "8px" }}><Src href={d.source.url}>{d.source.label}</Src></div>}
          </div>
        );
      })}
      {unit && (
        <div style={{ gridColumn: "1 / -1", fontSize: "10px", color: "#374151" }}>{unit}</div>
      )}
    </div>
  );
}
