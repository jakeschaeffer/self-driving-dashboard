// Trend over time on a log y-axis, with a horizontal target line and an
// "N× gap" bracket from the latest point of the first series to the target.
//
// Log scale because reliability improves by multiples: on a linear axis the
// early versions flatten to zero and the target would sit off the chart.
//
// Props:
//   series  [{ id, name, color, line, points: [{ x, y, value, label, direct? }] }]
//           x is a decimal year; direct = { text, side: "left" | "right" }
//           prints a label beside that point (use sparingly).
//   target  { y, label }       xDomain [x0, x1]   xTicks [{ x, label }]
//   yDomain [lo, hi] — powers of ten
import { MONO, BODY, VIZ, formatMiles } from "../ui.jsx";
import { useWidth, useTooltip, Tooltip } from "./parts.jsx";

const M = { top: 12, right: 14, bottom: 26, left: 40 };

export default function LogTrendChart({ series, target, xDomain, xTicks, yDomain, height = 200, ariaLabel }) {
  const [ref, width] = useWidth();
  const { tip, bind, isActive } = useTooltip(ref);

  const [x0, x1] = xDomain;
  const [l0, l1] = yDomain.map(Math.log10);
  const sx = (x) => M.left + ((x - x0) / (x1 - x0)) * (width - M.left - M.right);
  const sy = (v) => M.top + (1 - (Math.log10(v) - l0) / (l1 - l0)) * height;
  // Powers of ten, minus any that would sit on top of the target line
  // (a "1M" gridline 6px above a 670K target reads as if the target were 1M).
  const yTicks = [];
  for (let k = l0; k <= l1; k++) {
    if (k === l0 || Math.abs(sy(10 ** k) - sy(target.y)) > 14) yTicks.push(10 ** k);
  }

  const lead = series[0].points[series[0].points.length - 1];
  // Two significant figures: the inputs are too rough for "461×".
  const gap = Number((target.y / lead.y).toPrecision(2));
  const gapX = sx(lead.x);
  const gapMid = sy(Math.sqrt(lead.y * target.y)); // geometric midpoint on a log axis
  const right = width - M.right;
  const baseline = M.top + height;
  const label = { fontFamily: BODY, fontSize: 11 };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {width > 0 && (
        <svg width={width} height={baseline + M.bottom} role="img" aria-label={ariaLabel} style={{ display: "block" }}>
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={M.left} x2={right} y1={sy(v)} y2={sy(v)} stroke={v === 10 ** l0 ? VIZ.axis : VIZ.grid} />
              <text x={M.left - 8} y={sy(v)} dy="0.32em" textAnchor="end" fontSize="10" fontFamily={MONO} fill={VIZ.muted}>
                {formatMiles(v).replace(".0", "")}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <text key={t.label} x={sx(t.x)} y={baseline + 18} textAnchor="middle" fontSize="10" fontFamily={MONO} fill={VIZ.muted}>
              {t.label}
            </text>
          ))}

          {/* Target line, labelled below the line, where there's open space. */}
          <line x1={M.left} x2={right} y1={sy(target.y)} y2={sy(target.y)} stroke={VIZ.secondary} />
          <text x={M.left + 4} y={sy(target.y) + 15} {...label} fill={VIZ.secondary}>
            {target.label} · {formatMiles(target.y)}
          </text>

          {/* Gap bracket: latest point → target. */}
          <line x1={gapX} x2={gapX} y1={sy(lead.y) - 8} y2={sy(target.y)} stroke={VIZ.secondary} />
          <text x={gapX - 8} y={gapMid} dy="0.32em" textAnchor="end" {...label} fontSize="13" fontWeight="600" fill={VIZ.text}>
            ~{gap.toLocaleString()}× gap
          </text>

          {series.filter((s) => s.line).map((s) => (
            <path key={s.id} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
              d={s.points.map((p, i) => `${i ? "L" : "M"}${sx(p.x)},${sy(p.y)}`).join("")} />
          ))}

          {series.map((s) => s.points.map((p, i) => {
            const id = `${s.id}-${i}`;
            const cx = sx(p.x), cy = sy(p.y);
            return (
              <g key={id} {...bind({ id, x: cx, y: cy - 6, value: p.value, label: p.label })} style={{ outline: "none" }}>
                <circle cx={cx} cy={cy} r="12" fill="transparent" />
                <circle cx={cx} cy={cy} r={isActive(id) ? 6 : 4} fill={s.color} stroke={VIZ.surface} strokeWidth="2" />
                {p.direct && (
                  <text x={p.direct.side === "left" ? cx - 10 : cx + 10} y={p.direct.side === "left" ? cy - 8 : cy}
                    dy="0.32em" textAnchor={p.direct.side === "left" ? "end" : "start"} {...label} fill={VIZ.text}>
                    {p.direct.text}
                  </text>
                )}
              </g>
            );
          }))}
        </svg>
      )}
      <Tooltip tip={tip} width={width} />
    </div>
  );
}
