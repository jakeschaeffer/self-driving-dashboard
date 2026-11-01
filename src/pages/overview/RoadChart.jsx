// The hero chart: every safety data point on one log-scale axis, one lane per
// category. Farther right = more miles between events = safer.
//
// Built as a BoardUI chart card: the headline above the plot shows whichever
// point you hover or tap (like BoardUI's revenue card shows the hovered month),
// and the chart itself is Recharts, colored from the theme's tokens.
import { useState } from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ReferenceLine, CartesianGrid } from "recharts";
import { EVENT_TYPES, HUMAN_BENCHMARKS } from "../../../data.js";
import { compactMiles, fullMiles } from "../../lib/format.js";
import { compareToHuman } from "../../lib/compare.js";
import { useMediaQuery } from "../../lib/hooks.js";
import { Chip } from "@/components/base/badges/chip";
import Card from "../../components/site/Card.jsx";
import SeriesDot from "../../components/site/SeriesDot.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import Legend from "../../components/site/Legend.jsx";

const LANES = [
  { id: "tesla", name: "Tesla", color: "var(--color-series-tesla)" },
  { id: "waymo", name: "Waymo", color: "var(--color-series-waymo)" },
  { id: "human", name: "Human drivers", color: "var(--color-series-human)" },
];
const MILE_MARKERS = [10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8];
const DOMAIN = [5, 2e8];

// Labels sit above or below their dot. When two dots in a lane are close,
// the later label flips to the other side so the two don't collide.
const LABEL_GAP = 0.8; // minimum distance, in powers of ten, to share a side
function withLabelSides(points) {
  let lastAbove = -Infinity;
  let lastBelow = -Infinity;
  return [...points].sort((a, b) => a.miles - b.miles).map((p) => {
    const e = Math.log10(p.miles);
    const above = e - lastAbove >= LABEL_GAP || e - lastAbove >= e - lastBelow;
    if (above) lastAbove = e; else lastBelow = e;
    return { ...p, above };
  });
}

// Recharts calls this to draw each point. It is a focusable, labelled button
// so keyboard and screen-reader users can reach every value too.
function Marker({ cx, cy, payload, color, active, showLabel, onActivate }) {
  if (cx == null || cy == null) return null;
  const hollow = payload.event === "disengagement";
  const r = active ? 8 : 6;
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${payload.label}, ${payload.sublabel}: ${fullMiles(payload.miles)} miles per ${EVENT_TYPES[payload.event].label}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className="cursor-pointer outline-none [&:focus-visible>circle:last-of-type]:stroke-[var(--color-border-focus-ring)]"
    >
      {active && <circle cx={cx} cy={cy} r={r + 6} fill={color} opacity={0.2} />}
      <circle
        cx={cx} cy={cy} r={r}
        fill={hollow ? "var(--color-background-secondary-default)" : color}
        stroke={color} strokeWidth={hollow ? 2.5 : 2}
      />
      {showLabel && (
        <text x={cx} y={payload.above ? cy - 14 : cy + 22} textAnchor="middle" className="pointer-events-none">
          <tspan fontSize={12} fontWeight={600} fill="var(--color-text-primary)">{payload.short}</tspan>
          <tspan fontSize={11} dx={4} fill="var(--color-text-tertiary)">{compactMiles(payload.miles)}</tspan>
        </text>
      )}
    </g>
  );
}

function Headline({ point }) {
  const baseline = HUMAN_BENCHMARKS.crash;
  if (!point) {
    return (
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-body-medium text-text-secondary">Human drivers · all police-reported crashes</p>
        <p className="text-title-1-medium text-text-primary tabular-nums">{fullMiles(baseline.miles)} mi</p>
        <p className="text-body-2-medium text-text-tertiary">The baseline. Hover or tap any point to compare it.</p>
      </div>
    );
  }
  const cmp = compareToHuman(point);
  return (
    <div className="flex min-w-0 flex-col gap-0.5" aria-live="polite">
      <p className="flex items-center gap-2 text-body-medium text-text-secondary">
        <SeriesDot series={point.category} />
        <span className="truncate">{point.label} · {point.sublabel}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <p key={point.id} className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
          {fullMiles(point.miles)} mi
        </p>
        {cmp && (
          <Chip variant="bold" color={cmp.dir > 0 ? "lime" : cmp.dir < 0 ? "rose" : "neutral"}>{cmp.text}</Chip>
        )}
      </div>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-2-medium text-text-tertiary">
        <span>
          per {EVENT_TYPES[point.event].label}
          {cmp ? ` · vs. the human ${cmp.benchmarkLabel} rate${cmp.approx ? " (no exact human equivalent)" : ""}` : " · the benchmark"}
        </span>
        <SourceTag source={point.source} />
      </p>
    </div>
  );
}

export default function RoadChart({ points }) {
  const [activeId, setActiveId] = useState(null);
  const wide = useMediaQuery("(min-width: 720px)");
  const active = points.find((p) => p.id === activeId);
  const baseline = HUMAN_BENCHMARKS.crash;

  return (
    <Card as="figure" className="flex flex-col gap-5 px-4 pt-4 pb-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <Headline point={active} />
        <Legend items={LANES.map((l) => ({ label: l.name, swatch: <SeriesDot series={l.id} /> }))} />
      </div>

      <div className="h-[340px] w-full" onMouseLeave={() => setActiveId(null)}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: wide ? 56 : 16, bottom: 4, left: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-chart-track)" strokeDasharray="3 5" />
            <XAxis
              type="number" dataKey="miles" scale="log" domain={DOMAIN} ticks={MILE_MARKERS} allowDataOverflow
              tickFormatter={compactMiles} tickLine={false} axisLine={false} tickMargin={10}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
            />
            <YAxis
              type="number" dataKey="lane" domain={[-0.6, 2.6]} ticks={[0, 1, 2]} reversed
              tickFormatter={(i) => (wide ? LANES[i]?.name : "")} width={wide ? 104 : 4}
              tickLine={false} axisLine={false}
              tick={{ fontSize: 13, fontWeight: 500, fill: "var(--color-text-secondary)" }}
            />
            <ReferenceLine
              x={baseline.miles} stroke="var(--color-text-tertiary)" strokeDasharray="4 4"
              label={{ value: "Human crash rate", position: "top", fontSize: 11, fill: "var(--color-text-tertiary)" }}
            />
            {LANES.map((lane, i) => (
              <Scatter
                key={lane.id}
                name={lane.name}
                data={withLabelSides(points.filter((p) => p.category === lane.id)).map((p) => ({ ...p, lane: i }))}
                isAnimationActive={false}
                shape={(props) => (
                  <Marker
                    {...props}
                    color={lane.color}
                    active={props.payload.id === activeId}
                    showLabel={wide}
                    onActivate={() => setActiveId(props.payload.id)}
                  />
                )}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <figcaption>
        <Legend items={[
          { label: "Crash, injury or fatality", swatch: <span className="size-2.5 rounded-full bg-text-secondary" aria-hidden /> },
          { label: "Critical disengagement (a human took over)", swatch: <span className="size-2.5 rounded-full border-2 border-text-secondary" aria-hidden /> },
          { label: "Log scale: each gridline is 10× the one before", swatch: null },
        ]} />
      </figcaption>
    </Card>
  );
}
