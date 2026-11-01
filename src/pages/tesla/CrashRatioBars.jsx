// "How much safer is FSD?" as three bars: Tesla's headline claim, then two
// like-for-like checks. Each bar is how many times farther FSD goes between
// crashes than the comparison group, on one shared linear scale, so the
// shrinking bars show how much of the headline comes from the comparison.
// The marker at 1× is "no safer".
import { TESLA_SAFETY_RATIOS, TESLA_FSD_COLLISIONS } from "../../../data.js";
import { compactMiles, formatTimes } from "../../lib/format.js";
import { Chip } from "@/components/base/badges/chip";
import Card from "../../components/site/Card.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import Legend from "../../components/site/Legend.jsx";

const MAX = Math.ceil(Math.max(...TESLA_SAFETY_RATIOS.map((r) => r.ratio)));
const pct = (ratio) => (ratio / MAX) * 100;

export default function CrashRatioBars() {
  const c = TESLA_FSD_COLLISIONS;
  return (
    <Card as="figure" className="flex flex-col gap-5 p-4">
      <ul className="flex flex-col gap-5">
        {TESLA_SAFETY_RATIOS.map((r) => (
          <li key={r.label} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-body-medium text-text-primary">
                {r.label} <span className="text-body-2-regular text-text-tertiary">· {r.sub}</span>
              </p>
              <Chip color={r.headline ? "orange" : "neutral"} className="tabular-nums">
                {r.approx ? "~" : ""}{formatTimes(r.ratio)} safer
              </Chip>
            </div>
            <div className="relative h-3 rounded-full bg-chart-track" aria-hidden>
              <span
                className={`absolute inset-y-0 start-0 rounded-full ${r.headline ? "bg-series-tesla" : "bg-series-human"}`}
                style={{ width: `${pct(r.ratio)}%` }}
              />
              {/* 1× = no safer than the comparison group */}
              <span className="absolute -inset-y-1 w-0.5 rounded-full bg-text-primary" style={{ left: `${pct(1)}%` }} />
            </div>
            <p className="flex flex-wrap items-center gap-2 text-body-2-regular text-text-tertiary">
              {r.detail} <SourceTag source={r.source} />
            </p>
          </li>
        ))}
      </ul>
      <figcaption className="flex flex-col gap-2">
        <Legend items={[
          { label: "1× = no safer than the comparison", swatch: <span className="h-3 w-0.5 rounded-full bg-text-primary" aria-hidden /> },
          { label: `Tesla's raw figures, ${c.asOf}: FSD ${compactMiles(c.fsd)}, manual with active safety ${compactMiles(c.manualActiveSafety)}, US average ${compactMiles(c.usAverage)} miles per major collision`, swatch: null },
        ]} />
      </figcaption>
    </Card>
  );
}
