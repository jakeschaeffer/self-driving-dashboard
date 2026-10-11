// Horizontal bars for "N× farther between crashes" under different
// comparisons, with a tick at 1× (no difference) through every bar.
// Plain HTML rather than SVG so labels reflow naturally down to 320px.
//
// rows: [{ label, sub, ratio, display, color, detail }]
import { VIZ } from "../ui.jsx";
import { useWidth, useTooltip, Tooltip } from "./parts.jsx";

const VALUE_SPACE = 48; // px kept free right of the longest bar for its value

export default function RatioBars({ rows }) {
  const [ref, width] = useWidth();
  const { tip, bind } = useTooltip(ref);
  const max = Math.max(...rows.map((r) => r.ratio));
  const pct = (v) => (v / max) * 100 + "%";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ marginRight: VALUE_SPACE }}>
        {rows.map((r) => (
          <div key={r.label} style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "12px", color: VIZ.text, lineHeight: 1.4 }}>
              {r.label} <span style={{ fontSize: "11px", color: VIZ.muted }}>{r.sub}</span>
            </div>
            <div style={{ position: "relative", height: "20px", marginTop: "6px" }}>
              <div {...bind({ id: r.label, value: r.display, label: r.detail })} style={{
                position: "absolute", inset: "0 auto 0 0", width: pct(r.ratio),
                background: r.color, borderRadius: "0 4px 4px 0", outline: "none",
              }} />
              {/* 1× reference tick */}
              <div style={{ position: "absolute", left: pct(1), top: "-4px", bottom: "-4px", width: "1px", background: VIZ.text, opacity: 0.7, pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: `calc(${pct(r.ratio)} + 8px)`, lineHeight: "20px", fontSize: "13px", fontWeight: 600, color: VIZ.text, whiteSpace: "nowrap" }}>
                {r.display}
              </div>
            </div>
          </div>
        ))}
        <div style={{ position: "relative", height: "14px", marginTop: "-12px" }}>
          <span style={{ position: "absolute", left: pct(1), fontSize: "10px", color: VIZ.muted, whiteSpace: "nowrap" }}>
            1× = no safer
          </span>
        </div>
      </div>
      <Tooltip tip={tip} width={width} />
    </div>
  );
}
