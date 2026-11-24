// Shared design tokens and UI primitives. Every page builds from these —
// if a visual pattern appears on more than one page, it lives here.
// Charts live in src/charts/.
import { useState, useEffect } from "react";

// One typeface everywhere (IBM Plex Sans, loaded in index.html). Numbers that
// line up in columns opt into tabular figures with NUM; nothing uses a mono font.
export const FONT = "'IBM Plex Sans', system-ui, -apple-system, sans-serif";
export const NUM = { fontVariantNumeric: "tabular-nums" };

// Chart tokens. accent/compare were run through the dataviz palette validator
// against the card surface (#121223): colorblind-safe pair, ≥3:1 contrast.
// accent = the headline/Tesla-reported number; compare = independent checks.
// Text never uses accent/compare — labels use text/secondary/muted.
// Series are also told apart by marker SHAPE (see Marker in charts/parts.jsx),
// so color is never the only cue.
export const VIZ = {
  accent: "#d97706",
  compare: "#7c8798",
  waymo: "#3b82f6",
  human: "#94a3b8",
  better: "#4ade80",
  worse: "#fb923c",
  page: "#0d0d1f",
  surface: "#121223",
  border: "#1f2033",
  grid: "rgba(255,255,255,0.06)",
  axis: "rgba(255,255,255,0.16)",
  text: "#e2e8f0",
  secondary: "#94a3b8",
  muted: "#8b95a7",
  link: "#60a5fa",
};

// The one card surface used across the site.
export const CARD = {
  background: VIZ.surface,
  border: `1px solid ${VIZ.border}`,
  borderRadius: "8px",
};

// Small uppercase label (card titles, table headers). 11px is the site's
// minimum text size.
export const LABEL = {
  fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em",
  textTransform: "uppercase", color: VIZ.muted,
};

export const formatMiles = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace(".0", "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
};

// Viewport-width hook. Pages switch to their phone layouts below 720px so
// multi-column blocks don't get starved of width.
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
        color: VIZ.link, fontSize: "11px", textDecoration: "none",
        borderBottom: "1px dotted rgba(96,165,250,0.4)",
      }}
    >{children}</a>
  );
}

// Small muted line under a chart or table: footnotes and "Sources: …".
export function SourceLine({ children }) {
  return (
    <p style={{ fontSize: "11px", color: VIZ.muted, lineHeight: 1.6, margin: "10px 0 0" }}>{children}</p>
  );
}

export function Note({ children }) {
  return (
    <div style={{
      ...CARD, padding: "12px 16px", fontSize: "12px", color: VIZ.secondary,
      lineHeight: 1.65, marginTop: "16px",
    }}>
      <span style={{ ...LABEL, marginRight: "6px" }}>Note</span>{children}
    </div>
  );
}

// Short, sourced caveat lines under a chart. Lighter than a Note: one line
// per caveat, muted ink. items: [{ text, source? }]
export function Caveats({ items }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "12px", fontSize: "11px", lineHeight: 1.6, color: VIZ.muted }}>
      <div style={{ ...LABEL, paddingTop: "1px" }}>Caveats</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((c, i) => (
          <li key={i}>{c.text} {c.source && <Src href={c.source.url}>{c.source.label}</Src>}</li>
        ))}
      </ul>
    </div>
  );
}

// Headline number tile. Values are always white: the label says what the
// number is, so color isn't needed to tell tiles apart.
export function StatCard({ label, value, sublabel, source }) {
  const narrow = useNarrow();
  return (
    <div style={{
      ...CARD, padding: narrow ? "14px 16px" : "18px 20px", flex: "1 1 180px", minWidth: "170px",
      display: "flex", flexDirection: "column", gap: narrow ? "4px" : "6px",
    }}>
      <div style={LABEL}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: 600, color: VIZ.text, lineHeight: 1.1 }}>{value}</div>
      {sublabel && <div style={{ fontSize: "11px", color: VIZ.muted }}>{sublabel}</div>}
      {source && <div><Src href={source.url}>{source.label}</Src></div>}
    </div>
  );
}

// The row of headline stat cards at the top of a page or section.
export function StatCards({ stats }) {
  const narrow = useNarrow();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: narrow ? "8px" : "10px", marginBottom: "28px" }}>
      {stats.map((s, i) => <StatCard key={i} {...s} />)}
    </div>
  );
}

export function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: "44px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: VIZ.text, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "13px", color: VIZ.secondary, margin: "4px 0 0", lineHeight: 1.5 }}>{subtitle}</p>}
      <div style={{ marginTop: "16px" }}>{children}</div>
    </section>
  );
}
