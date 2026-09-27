// Tesla FSD miles between critical disengagements, version by version, on a
// log scale. On a log axis, steady multiplicative improvement is a straight
// line, so the dashed projection simply extends the recent slope until it
// meets Tesla's own unsupervised target.
import { useRef } from "react";
import {
  SITE, TESLA_VERSION_PROGRESS, TESLA_INDEPENDENT_TESTS, TESLA_TARGET, TESLA_PROJECTION,
} from "../../../data.js";
import { compactMiles, fullMiles, formatTimes, yearFraction } from "../../lib/format.js";
import { useElementWidth } from "../../lib/hooks.js";
import SourceTag from "../../components/SourceTag.jsx";
import s from "./VersionTrend.module.css";

const HEIGHT = 360;
const M = { top: 28, right: 24, bottom: 36, left: 48 }; // room for axis labels
const Y_TICKS = [1, 10, 100, 1e3, 1e4, 1e5, 1e6];

// Yearly growth between `fromVersion` and the latest version, and the date
// that pace would reach the target. Returns null if there is no growth.
function project(points) {
  const from = points.find((p) => p.version === TESLA_PROJECTION.fromVersion) ?? points[0];
  const last = points[points.length - 1];
  const perYear = Math.pow(last.miles / from.miles, 1 / (last.t - from.t));
  if (!(perYear > 1)) return null;
  const reachT = last.t + Math.log(TESLA_TARGET.miles / last.miles) / Math.log(perYear);
  return { from, last, perYear, reachT };
}

export default function VersionTrend() {
  const ref = useRef(null);
  const width = useElementWidth(ref);
  const narrow = width < 560;

  const points = TESLA_VERSION_PROGRESS.map((d) => ({ ...d, t: yearFraction(d.date), miles: d.milesPerIntervention }));
  const tests = TESLA_INDEPENDENT_TESTS.map((d) => ({ ...d, t: yearFraction(d.date) }));
  const last = points[points.length - 1];
  const proj = project(points);
  const now = yearFraction(SITE.asOf);

  // Scales: map a date (t) or a miles value to pixels.
  const t0 = Math.floor(points[0].t);
  const t1 = Math.max(Math.ceil(now), Math.min(proj ? Math.ceil(proj.reachT) : t0, t0 + 10));
  const x = (t) => M.left + ((t - t0) / (t1 - t0)) * (width - M.left - M.right);
  const y = (miles) => M.top + (1 - Math.log10(miles) / 6) * (HEIGHT - M.top - M.bottom);

  const years = [];
  for (let yr = t0; yr <= t1; yr += narrow ? 2 : 1) years.push(yr);

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.t)},${y(p.miles)}`).join(" ");
  const area = `${line} L${x(last.t)},${y(1)} L${x(points[0].t)},${y(1)} Z`;

  // The projection is drawn to the target, or to the chart edge if it gets there first.
  const projEndT = proj ? Math.min(proj.reachT, t1) : null;
  const projEndMiles = proj ? last.miles * Math.pow(proj.perYear, projEndT - last.t) : null;

  return (
    <figure className={s.figure}>
      <div ref={ref} className={s.frame}>
        <svg width={width} height={HEIGHT} className={s.svg} role="img"
          aria-label={`Tesla FSD miles between critical disengagements rose from ${points[0].milesPerIntervention} on ${points[0].version} to ${fullMiles(last.miles)} on ${last.version}.`}>
          {Y_TICKS.map((m) => (
            <g key={m}>
              <line className={s.grid} x1={M.left} x2={width - M.right} y1={y(m)} y2={y(m)} />
              <text className={s.tick} x={M.left - 8} y={y(m)} dy="0.32em" textAnchor="end">{compactMiles(m)}</text>
            </g>
          ))}
          {years.map((yr) => (
            <text key={yr} className={s.tick} x={x(yr)} y={HEIGHT - 12} textAnchor="middle">{yr}</text>
          ))}

          {/* "Now" marker: the gap after the last point is time without new data */}
          <line className={s.now} x1={x(now)} x2={x(now)} y1={M.top} y2={y(1)} />
          <text className={s.nowLabel} x={x(now) + 5} y={y(1) - 6}>Now</text>

          {/* Tesla's own target */}
          <line className={s.target} x1={M.left} x2={width - M.right} y1={y(TESLA_TARGET.miles)} y2={y(TESLA_TARGET.miles)} />
          <text className={s.targetLabel} x={M.left + 6} y={y(TESLA_TARGET.miles) - 8}>
            Unsupervised target · {compactMiles(TESLA_TARGET.miles)} mi
          </text>

          {proj && (
            <>
              <line className={s.proj} x1={x(last.t)} y1={y(last.miles)} x2={x(projEndT)} y2={y(projEndMiles)} />
              {proj.reachT <= t1 && (
                <>
                  <circle className={s.projDot} cx={x(proj.reachT)} cy={y(TESLA_TARGET.miles)} r="4.5" />
                  <text className={s.projLabel} x={x(proj.reachT) - 8} y={y(TESLA_TARGET.miles) + 18} textAnchor="end">
                    ~{Math.round(proj.reachT)} at this pace
                  </text>
                </>
              )}
            </>
          )}

          <path className={s.area} d={area} />
          <path className={s.line} d={line} />

          {points.map((p, i) => {
            const isLast = i === points.length - 1;
            const showName = !narrow || i === 0 || isLast;
            return (
              <g key={p.version}>
                <title>{`${p.version} (${p.date}): ${fullMiles(p.miles)} mi between critical disengagements`}</title>
                <circle className={s.dot} cx={x(p.t)} cy={y(p.miles)} r={isLast ? 6 : 4.5} />
                {showName && (
                  <text className={s.name} x={x(p.t)} y={y(p.miles) - 12} textAnchor="middle">{p.version}</text>
                )}
                {isLast && (
                  <text className={s.value} x={x(p.t) + 12} y={y(p.miles) + 18}>{fullMiles(p.miles)} mi</text>
                )}
              </g>
            );
          })}

          {tests.map((d) => (
            <g key={d.label}>
              <title>{`${d.label}: ${fullMiles(d.miles)} mi between interventions`}</title>
              <circle className={s.test} cx={x(d.t)} cy={y(d.miles)} r="5" />
              <text className={s.testLabel} x={x(d.t) + 10} y={y(d.miles)} dy="0.32em">
                {d.label} · {fullMiles(d.miles)} mi
              </text>
            </g>
          ))}
        </svg>
      </div>

      <figcaption className={s.caption}>
        <span className={s.lgItem}><i className={s.lgLine} /> Crowdsourced average by version</span>
        <span className={s.lgItem}><i className={s.lgTest} /> Independent test</span>
        {proj && (
          <span className={s.lgItem}>
            <i className={s.lgProj} /> {proj.from.version}→{proj.last.version} pace ({formatTimes(proj.perYear)} per year), extended
          </span>
        )}
        <span className={s.lgNote}>
          {TESLA_PROJECTION.caveat} Sources: <SourceTag source={TESLA_TARGET.source} />
        </span>
      </figcaption>
    </figure>
  );
}
