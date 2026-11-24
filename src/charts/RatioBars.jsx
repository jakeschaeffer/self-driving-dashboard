// Horizontal bars for "N× farther between events" under different
// comparisons. Plain HTML rather than SVG so labels reflow down to 320px.
// Bars only ever show improvements (every ratio is ≥1×), so there's no
// "1× = no change" reference line.
//
// Desktop: label line, then the bar with its value at the tip.
// Phone (<720px): label and value share a line, the bar goes underneath at
// full width (a value at the tip would crowd the longest bar).
//
// rows: [{ label, sub, ratio, display, color, detail, claim? }]
//   claim: true draws a dashed outline and a muted value instead of a solid
//   bar: an unverified number, not a measurement.
// valueSpace: px kept free right of the longest bar for its value (desktop).
import { VIZ, NUM, useNarrow } from "../ui.jsx";
import { useWidth, useTooltip, Tooltip } from "./parts.jsx";

const CLAIM_BORDER = "1px dashed rgba(217,119,6,0.6)";

export default function RatioBars({ rows, valueSpace = 48 }) {
  const narrow = useNarrow();
  const [ref, width] = useWidth();
  const { tip, bind } = useTooltip(ref);
  const max = Math.max(...rows.map((r) => r.ratio));
  const pct = (v) => (v / max) * 100 + "%";
  const value = (r) => ({
    fontSize: "13px", whiteSpace: "nowrap", ...NUM,
    fontWeight: r.claim ? 500 : 600, color: r.claim ? VIZ.muted : VIZ.text,
  });
  const bar = (r, height) => (
    <div {...bind({ id: r.label, value: r.display, label: r.detail })} style={{
      height, width: pct(r.ratio), boxSizing: "border-box", borderRadius: "0 4px 4px 0", outline: "none",
      background: r.claim ? "transparent" : r.color, border: r.claim ? CLAIM_BORDER : "none",
    }} />
  );

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px", marginRight: narrow ? 0 : valueSpace }}>
      {rows.map((r) => narrow ? (
        <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span style={{ fontSize: "13px", color: VIZ.text }}>{r.label}</span>
              <span style={{ fontSize: "11px", color: VIZ.muted }}>{r.sub}</span>
            </div>
            <span style={value(r)}>{r.display}</span>
          </div>
          {bar(r, "16px")}
        </div>
      ) : (
        <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "12px", color: VIZ.text }}>
            {r.label} <span style={{ fontSize: "11px", color: VIZ.muted }}>{r.sub}</span>
          </span>
          <div style={{ position: "relative", height: "20px" }}>
            {bar(r, "20px")}
            <span style={{ ...value(r), position: "absolute", top: 0, left: `calc(${pct(r.ratio)} + 8px)`, lineHeight: "20px" }}>
              {r.display}
            </span>
          </div>
        </div>
      ))}
      <Tooltip tip={tip} width={width} />
    </div>
  );
}
