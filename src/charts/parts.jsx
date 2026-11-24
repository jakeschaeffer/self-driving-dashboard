// Building blocks shared by the charts in this folder: container width,
// hover/focus tooltip, legend, and the collapsible data table that gives
// every chart a text equivalent (tooltips enhance; they never gate a value).
import { useState, useRef, useLayoutEffect } from "react";
import { VIZ, LABEL, NUM } from "../ui.jsx";

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
      background: "#1c1c33", border: `1px solid ${VIZ.axis}`, borderRadius: "6px",
      padding: "6px 10px", pointerEvents: "none", maxWidth: width, width: "max-content", zIndex: 2,
    }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: VIZ.text }}>{tip.value}</div>
      <div style={{ fontSize: "11px", color: VIZ.secondary }}>{tip.label}</div>
    </div>
  );
}

// Series identity is carried by SHAPE as well as color (accessibility rule:
// never color alone). One shape per family, used on every chart and legend:
//   circle   — Tesla / owner-reported
//   square   — Waymo
//   diamond  — human drivers
//   triangle — independent test
// `ring` draws a surface-colored outline so a marker sitting on a bar or line
// stays legible.
export function Marker({ shape = "circle", color, size = 8, ring = false, style }) {
  const base = { display: "inline-block", flexShrink: 0, ...style };
  if (shape === "triangle") {
    return <span style={{
      ...base, width: 0, height: 0,
      borderLeft: `${size * 0.6}px solid transparent`, borderRight: `${size * 0.6}px solid transparent`,
      borderBottom: `${size * 1.1}px solid ${color}`,
    }} />;
  }
  const dims = { circle: size + 1, square: size, diamond: size - 1 }[shape];
  return <span style={{
    ...base, width: dims, height: dims, background: color,
    borderRadius: shape === "circle" ? "50%" : "1px",
    transform: [style?.transform, shape === "diamond" ? "rotate(45deg)" : ""].join(" ").trim() || undefined,
    boxShadow: ring ? `0 0 0 2px ${VIZ.surface}` : undefined,
  }} />;
}

// items: [{ label, color, shape }]. Mirrors the marks on the chart.
export function Legend({ items, style }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: VIZ.secondary, marginBottom: "10px", ...style }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Marker shape={it.shape} color={it.color} />
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
      <summary style={{ ...LABEL, cursor: "pointer" }}>
        Data
      </summary>
      <table style={{ marginTop: "8px", borderCollapse: "collapse", fontSize: "11px", color: VIZ.secondary, ...NUM }}>
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
