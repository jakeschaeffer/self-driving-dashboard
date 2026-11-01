// Waymo's cumulative rider-only miles, as a BoardUI-style chart card.
// The x axis is real time, so uneven gaps between data points are drawn to
// scale and the curve's steepening is honest. Hovering a point moves the
// headline to that date, the same interaction as BoardUI's revenue card.
import { useId, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { WAYMO_MILES_TIMELINE } from "../../../data.js";
import { yearFraction } from "../../lib/format.js";
import { useCountUp } from "@/hooks/use-count-up";
import { Chip } from "@/components/base/badges/chip";
import Card from "../../components/site/Card.jsx";

const DATA = WAYMO_MILES_TIMELINE.map((d) => ({ ...d, t: yearFraction(d.date) }));

function ActiveDot({ cx, cy }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="var(--color-series-waymo)" opacity={0.25} />
      <circle cx={cx} cy={cy} r={4.5} fill="var(--color-series-waymo)" stroke="var(--color-background-secondary-default)" strokeWidth={2} />
    </g>
  );
}

export default function MilesChart() {
  const [index, setIndex] = useState(null);
  const gradientId = useId();
  const last = DATA[DATA.length - 1];
  const point = index != null ? DATA[index] : last;
  const prev = DATA[DATA.indexOf(point) - 1];
  const shown = useCountUp(point.miles);
  const growth = prev ? `+${Math.round(((point.miles - prev.miles) / prev.miles) * 100)}%` : null;
  const t0 = Math.floor(DATA[0].t);
  const t1 = Math.ceil(last.t);
  const years = Array.from({ length: t1 - t0 + 1 }, (_, i) => t0 + i);

  return (
    <Card as="figure" className="flex h-[380px] flex-col gap-5 px-4 pt-4 pb-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-body-medium text-text-secondary">Rider-only miles, cumulative · {point.period}</p>
        <div className="flex items-center gap-2">
          <p key={point.date} className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">{shown}M mi</p>
          {growth && <Chip color="lime">{growth}</Chip>}
        </div>
        <p className="text-body-2-medium text-text-tertiary tabular-nums">
          {prev ? `${prev.miles}M at ${prev.period}` : "First published total"}
        </p>
      </div>
      <div
        className="min-h-0 flex-1"
        role="img"
        aria-label={`Waymo cumulative driverless miles: ${DATA.map((p) => `${p.period} ${p.miles} million`).join(", ")}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DATA}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            onMouseMove={(s) => {
              const i = Number(s?.activeTooltipIndex);
              if (s?.isTooltipActive && Number.isFinite(i)) setIndex(i);
            }}
            onMouseLeave={() => setIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-series-waymo)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-series-waymo)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis width={44} tickCount={5} tickFormatter={(v) => `${v}M`} tickLine={false} axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
            <XAxis type="number" dataKey="t" domain={[t0, t1]} ticks={years} tickLine={false} axisLine={false}
              tickMargin={12} tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }} />
            <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeDasharray: "4 4" }} />
            <Area type="monotone" dataKey="miles" stroke="var(--color-series-waymo)" strokeWidth={2.5}
              fill={`url(#${gradientId})`} activeDot={<ActiveDot />} dot={{ r: 3, fill: "var(--color-series-waymo)", strokeWidth: 0 }}
              animationDuration={450} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
