// Musk's self-driving promises as timelines: when each claim was made, when it
// was due, and how long it ran over (to delivery, or to today if still waiting).
// Each row is a BoardUI-style track; positions are percentages along 2015 → 2027.
import { MUSK_PREDICTIONS, SITE } from "../../../data.js";
import { yearFraction } from "../../lib/format.js";
import Card from "../../components/site/Card.jsx";
import StatusChip from "../../components/site/StatusChip.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import Legend from "../../components/site/Legend.jsx";

const START = 2015;
const END = 2027;
const YEAR_TICKS = [2015, 2017, 2019, 2021, 2023, 2025];
// Claims are stored as whole years; place them mid-year.
const pos = (year) => ((year + 0.5 - START) / (END - START)) * 100;

function lateness(p, now) {
  const end = p.done ?? now;
  const years = Math.floor(end - p.due);
  if (years <= 0) return p.done ? "On time" : "Due now";
  const y = years === 1 ? "1 yr" : `${years} yrs`;
  return p.done ? `${y} late` : `${y}+ overdue`;
}

const Dot = ({ at, className }) => (
  <span className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${className}`} style={{ left: `${at}%` }} />
);
const Bar = ({ from, to, className }) => (
  <span className={`absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full ${className}`} style={{ left: `${from}%`, width: `${Math.max(0, to - from)}%` }} />
);

export default function PromiseTimeline() {
  const now = yearFraction(SITE.asOf) - 0.5;
  const nowPos = pos(now);
  const rows = [...MUSK_PREDICTIONS].sort((a, b) => a.said - b.said || a.due - b.due);

  return (
    <Card className="flex flex-col gap-3 p-2">
      <Card as="ol" inner className="flex flex-col divide-y divide-separator-border">
        <li aria-hidden className="grid gap-4 px-4 pt-3 pb-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] max-md:hidden">
          <span />
          <span className="relative h-4 text-caption-1-medium text-text-tertiary">
            {YEAR_TICKS.map((yr) => (
              <span key={yr} className="absolute -translate-x-1/2" style={{ left: `${pos(yr)}%` }}>{yr}</span>
            ))}
            <span className="absolute -translate-x-1/2 rounded bg-text-primary px-1 text-background-primary-default" style={{ left: `${nowPos}%` }}>Today</span>
          </span>
        </li>
        {rows.map((p) => {
          const endPos = p.done ? pos(p.done) : nowPos;
          return (
            <li key={p.claim} className="grid items-center gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <div className="flex flex-col gap-1">
                <p className="text-body-semibold text-text-primary">“{p.claim}”</p>
                <p className="flex flex-wrap items-center gap-2 text-body-2-regular text-text-secondary">
                  <StatusChip tone={p.done ? "warn" : "bad"}>{lateness(p, now)}</StatusChip>
                  {p.result} <SourceTag source={p.source} />
                </p>
              </div>
              <div className="relative h-6" aria-hidden>
                <span className="absolute inset-x-0 top-1/2 h-px bg-separator-border" />
                <span className="absolute inset-y-0 w-px bg-text-tertiary" style={{ left: `${nowPos}%` }} />
                <Bar from={pos(p.said)} to={pos(p.due)} className="bg-series-human" />
                <Bar from={pos(p.due)} to={endPos} className="bg-status-rose-text/70" />
                <Dot at={pos(p.said)} className="border-2 border-series-human bg-background-inner-default" />
                <Dot at={endPos} className={p.done ? "bg-status-lime-text" : "bg-status-rose-text"} />
              </div>
              <span className="sr-only">
                Said {p.said}, promised for {p.due}, {p.done ? `delivered ${p.done}` : "not delivered"}.
              </span>
            </li>
          );
        })}
      </Card>
      <div className="px-2 pb-1">
        <Legend items={[
          { label: "Claim made", swatch: <span className="size-2.5 rounded-full border-2 border-series-human" aria-hidden /> },
          { label: "Promised window", swatch: <span className="h-1.5 w-4 rounded-full bg-series-human" aria-hidden /> },
          { label: "Overdue", swatch: <span className="h-1.5 w-4 rounded-full bg-status-rose-text/70" aria-hidden /> },
          { label: "Delivered", swatch: <span className="size-2.5 rounded-full bg-status-lime-text" aria-hidden /> },
          { label: "Still waiting", swatch: <span className="size-2.5 rounded-full bg-status-rose-text" aria-hidden /> },
        ]} />
      </div>
    </Card>
  );
}
