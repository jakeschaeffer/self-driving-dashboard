// Building blocks shared by the charts in this folder: container width,
// hover/focus tooltip, legend, and the collapsible data table that gives
// every chart a text equivalent (tooltips enhance; they never gate a value).
import { useState, useRef, useLayoutEffect } from "react";
import { MONO, VIZ } from "../ui.jsx";

// Measures the container so SVG text renders at true pixel size at any width
// (a scaled viewBox would shrink labels to unreadable sizes on phones).
export function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

// tip = { id, x, y, value, label } in container coordinates, or null.
// containerRef is the positioned element the Tooltip renders inside.
export function useTooltip(containerRef) {
  const [tip, setTip] = useState(null);
  // Spread onto any mark: hover and keyboard focus show the same tooltip.
  // SVG marks pass x/y; HTML marks omit them and anchor to their top-right.
  const bind = (content) => {
    const show = (e) => {
      if (content.x != null) return setTip(content);
      const r = e.currentTarget.getBoundingClientRect();
      const c = containerRef.current.getBoundingClientRect();
      setTip({ ...content, x: r.right - c.left, y: r.top - c.top });
    };
    return {
      tabIndex: 0,
      "aria-label": `${content.value}, ${content.label}`,
      onPointerEnter: show,
      onPointerLeave: () => setTip(null),
      onFocus: show,
      onBlur: () => setTip(null),
    };
  };
  return { tip, bind, isActive: (id) => tip?.id === id };
}

export function Tooltip({ tip, width }) {
  // Measure the box so it can be nudged fully inside the card, whatever its text.
  const ref = useRef(null);
  const [boxWidth, setBoxWidth] = useState(0);
  useLayoutEffect(() => {
    if (ref.current) setBoxWidth(ref.current.offsetWidth);
  }, [tip]);
  if (!tip) return null;
  const half = boxWidth / 2;
  const x = Math.min(Math.max(tip.x, half), width - half);
  return (
    <div ref={ref} role="status" style={{
      position: "absolute", left: x, top: tip.y, transform: "translate(-50%, calc(-100% - 12px))",
      background: "#1c1c33", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px",
      padding: "6px 10px", pointerEvents: "none", maxWidth: width, width: "max-content", zIndex: 2,
    }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: VIZ.text }}>{tip.value}</div>
      <div style={{ fontSize: "11px", color: VIZ.secondary }}>{tip.label}</div>
    </div>
  );
}

// items: [{ label, color }]. Mirrors the mark: a dot for point series.
export function Legend({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: VIZ.secondary, marginBottom: "10px" }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

// Collapsed by default to keep the page quiet. columns: [{ key, label, right? }]
export function DataTable({ columns, rows }) {
  const cell = (c) => ({ padding: "4px 12px 4px 0", textAlign: c.right ? "right" : "left" });
  return (
    <details style={{ marginTop: "10px" }}>
      <summary style={{ cursor: "pointer", fontSize: "10px", fontFamily: MONO, color: VIZ.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Data
      </summary>
      <table style={{ marginTop: "8px", borderCollapse: "collapse", fontSize: "11px", color: VIZ.secondary, fontVariantNumeric: "tabular-nums" }}>
        <thead>
          <tr>{columns.map((c) => <th key={c.key} style={{ ...cell(c), color: VIZ.muted, fontWeight: 500 }}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${VIZ.grid}` }}>
              {columns.map((c) => <td key={c.key} style={cell(c)}>{r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
