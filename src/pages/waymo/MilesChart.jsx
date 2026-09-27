// Waymo's cumulative rider-only miles on a true time axis. Uneven gaps between
// data points are drawn to scale, so the curve's steepening is honest.
import { useRef } from "react";
import { WAYMO_MILES_TIMELINE } from "../../../data.js";
import { yearFraction } from "../../lib/format.js";
import { useElementWidth } from "../../lib/hooks.js";
import s from "./MilesChart.module.css";

const HEIGHT = 300;
const M = { top: 24, right: 28, bottom: 34, left: 52 };

// Round the top of the y axis up to a clean step (e.g. 221 → 250).
function niceMax(v) {
  const step = v > 200 ? 50 : v > 100 ? 25 : 10;
  return Math.ceil(v / step) * step;
}

export default function MilesChart() {
  const ref = useRef(null);
  const width = useElementWidth(ref);
  const narrow = width < 560;

  const pts = WAYMO_MILES_TIMELINE.map((d) => ({ ...d, t: yearFraction(d.date) }));
  const last = pts[pts.length - 1];
  const t0 = Math.floor(pts[0].t);
  const t1 = Math.ceil(last.t);
  const yMax = niceMax(last.miles);
  const step = yMax / 5;

  const x = (t) => M.left + ((t - t0) / (t1 - t0)) * (width - M.left - M.right);
  const y = (v) => M.top + (1 - v / yMax) * (HEIGHT - M.top - M.bottom);

  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t)},${y(p.miles)}`).join(" ");
  const area = `${line} L${x(last.t)},${y(0)} L${x(pts[0].t)},${y(0)} Z`;
  const years = [];
  for (let yr = t0; yr <= t1; yr += narrow ? 2 : 1) years.push(yr);

  return (
    <div ref={ref} className={s.frame}>
      <svg width={width} height={HEIGHT} className={s.svg} role="img"
        aria-label={`Waymo cumulative driverless miles: ${pts.map((p) => `${p.period} ${p.miles} million`).join(", ")}.`}>
        {Array.from({ length: 6 }, (_, i) => i * step).map((v) => (
          <g key={v}>
            <line className={v === 0 ? s.base : s.grid} x1={M.left} x2={width - M.right} y1={y(v)} y2={y(v)} />
            <text className={s.tick} x={M.left - 8} y={y(v)} dy="0.32em" textAnchor="end">{v}M</text>
          </g>
        ))}
        {years.map((yr) => (
          <text key={yr} className={s.tick} x={x(yr)} y={HEIGHT - 12} textAnchor="middle">{yr}</text>
        ))}

        <path className={s.area} d={area} />
        <path className={s.line} d={line} />

        {pts.map((p, i) => {
          const isLast = i === pts.length - 1;
          return (
            <g key={p.date}>
              <title>{`${p.period}: ${p.miles}M cumulative driverless miles`}</title>
              <circle className={s.dot} cx={x(p.t)} cy={y(p.miles)} r={isLast ? 6 : 4} />
              {isLast && (
                <text className={s.value} x={x(p.t) - 12} y={y(p.miles) + 5} textAnchor="end">
                  {p.miles}M mi · {p.period}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
