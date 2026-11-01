// Tesla FSD miles between critical disengagements, version by version, on a
// log scale, as a BoardUI chart card. On a log axis, steady multiplicative
// improvement is a straight line, so the dashed projection simply extends the
// recent slope until it meets Tesla's own unsupervised target.
import { useState } from "react";
import {
  ResponsiveContainer, ComposedChart, Line, Scatter, XAxis, YAxis, ReferenceLine, Tooltip, CartesianGrid,
} from "recharts";
import {
  SITE, TESLA_VERSION_PROGRESS, TESLA_INDEPENDENT_TESTS, TESLA_TARGET, TESLA_PROJECTION,
} from "../../../data.js";
import { compactMiles, fullMiles, formatTimes, yearFraction } from "../../lib/format.js";
import { Chip } from "@/components/base/badges/chip";
import Card from "../../components/site/Card.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import Legend from "../../components/site/Legend.jsx";

const Y_TICKS = [1, 10, 100, 1e3, 1e4, 1e5, 1e6];
const POINTS = TESLA_VERSION_PROGRESS.map((d) => ({ ...d, t: yearFraction(d.date), miles: d.milesPerIntervention }));
const TESTS = TESLA_INDEPENDENT_TESTS.map((d) => ({ ...d, t: yearFraction(d.date) }));

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

function ActiveDot({ cx, cy }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="var(--color-series-tesla)" opacity={0.25} />
      <circle cx={cx} cy={cy} r={4.5} fill="var(--color-series-tesla)" stroke="var(--color-background-secondary-default)" strokeWidth={2} />
    </g>
  );
}

export default function VersionTrend() {
  const [index, setIndex] = useState(null);
  const last = POINTS[POINTS.length - 1];
  const proj = project(POINTS);
  const now = yearFraction(SITE.asOf);
  const t0 = Math.floor(POINTS[0].t);
  const t1 = Math.max(Math.ceil(now), Math.min(proj ? Math.ceil(proj.reachT) : t0, t0 + 10));
  const years = Array.from({ length: t1 - t0 + 1 }, (_, i) => t0 + i);

  // The projection is drawn to the target, or to the chart edge if it gets there first.
  const projEndT = proj ? Math.min(proj.reachT, t1) : null;
  const projLine = proj
    ? [{ t: last.t, proj: last.miles }, { t: projEndT, proj: last.miles * Math.pow(proj.perYear, projEndT - last.t) }]
    : [];

  const point = index != null && POINTS[index] ? POINTS[index] : last;
  const gap = TESLA_TARGET.miles / point.miles;

  return (
    <Card as="figure" className="flex flex-col gap-5 px-4 pt-4 pb-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">FSD {point.version} · wide release {point.date}</p>
          <div className="flex items-center gap-2">
            <p key={point.version} className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
              {fullMiles(point.miles)} mi
            </p>
            <Chip color="rose">{formatTimes(gap)} short of target</Chip>
          </div>
          <p className="text-body-2-medium text-text-tertiary">
            between critical disengagements · target {compactMiles(TESLA_TARGET.miles)} mi
          </p>
        </div>
        <Legend items={[
          { label: "Crowdsourced average", swatch: <span className="h-0.5 w-4 rounded-full bg-series-tesla" aria-hidden /> },
          { label: "Independent test", swatch: <span className="size-2.5 rounded-full border-2 border-series-tesla" aria-hidden /> },
          ...(proj ? [{ label: `${proj.from.version}→${proj.last.version} pace (${formatTimes(proj.perYear)}/yr), extended`, swatch: <span className="w-4 border-t-2 border-dashed border-series-tesla" aria-hidden /> }] : []),
        ]} />
      </div>

      <div
        className="h-[360px] w-full"
        role="img"
        aria-label={`Tesla FSD miles between critical disengagements rose from ${POINTS[0].miles} on ${POINTS[0].version} to ${fullMiles(last.miles)} on ${last.version}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            margin={{ top: 20, right: 12, bottom: 0, left: 0 }}
            onMouseMove={(s) => {
              const i = Number(s?.activeTooltipIndex);
              if (s?.isTooltipActive && Number.isFinite(i)) setIndex(i);
            }}
            onMouseLeave={() => setIndex(null)}
          >
            <CartesianGrid vertical={false} stroke="var(--color-chart-track)" strokeDasharray="3 5" />
            <XAxis type="number" dataKey="t" domain={[t0, t1]} ticks={years} allowDuplicatedCategory={false}
              tickLine={false} axisLine={false} tickMargin={12} tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }} />
            <YAxis type="number" scale="log" domain={[1, 1e6]} ticks={Y_TICKS} allowDataOverflow width={44}
              tickFormatter={compactMiles} tickLine={false} axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
            <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeDasharray: "4 4" }} />
            <ReferenceLine y={TESLA_TARGET.miles} stroke="var(--color-text-tertiary)" strokeDasharray="4 4"
              label={{ value: `Unsupervised target · ${compactMiles(TESLA_TARGET.miles)} mi`, position: "insideTopLeft", fontSize: 12, fill: "var(--color-text-secondary)" }} />
            <ReferenceLine x={now} stroke="var(--color-chart-cursor)"
              label={{ value: "Now", position: "insideBottomRight", fontSize: 11, fill: "var(--color-text-tertiary)" }} />
            {proj && (
              <Line data={projLine} dataKey="proj" stroke="var(--color-series-tesla)" strokeWidth={2} strokeDasharray="5 5"
                dot={false} activeDot={false} isAnimationActive={false} />
            )}
            <Line data={POINTS} dataKey="miles" stroke="var(--color-series-tesla)" strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--color-series-tesla)", strokeWidth: 0 }} activeDot={<ActiveDot />}
              label={{ dataKey: "version", position: "top", offset: 10, fontSize: 11, fill: "var(--color-text-secondary)" }}
              animationDuration={450} />
            <Scatter data={TESTS} dataKey="miles" fill="var(--color-background-secondary-default)"
              stroke="var(--color-series-tesla)" strokeWidth={2} isAnimationActive={false}
              label={{ dataKey: "label", position: "right", offset: 8, fontSize: 11, fill: "var(--color-text-secondary)" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="flex flex-wrap items-center gap-2 text-body-2-regular text-text-tertiary">
        {TESLA_PROJECTION.caveat} <SourceTag source={TESLA_TARGET.source} />
      </figcaption>
    </Card>
  );
}
