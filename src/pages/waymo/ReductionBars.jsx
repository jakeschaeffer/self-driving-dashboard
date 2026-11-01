// Waymo vs. human crash rates by severity. Each row is scaled to its own human
// rate (the full gray track = 100%), so every row reads the same way: how much
// of the human rate is left. Drawn as BoardUI progress-style tracks.
import { WAYMO_CRASH_REDUCTION } from "../../../data.js";
import { Chip } from "@/components/base/badges/chip";
import Card from "../../components/site/Card.jsx";
import Legend from "../../components/site/Legend.jsx";

export default function ReductionBars() {
  return (
    <Card as="figure" className="flex flex-col gap-4 p-4">
      <ul className="flex flex-col gap-4">
        {WAYMO_CRASH_REDUCTION.map((r) => (
          <li key={r.category} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[12rem_minmax(0,1fr)_7rem]">
            <span className="text-body-medium text-text-primary">{r.category}</span>
            <span className="relative h-2.5 overflow-hidden rounded-full bg-chart-track max-sm:col-span-2 max-sm:row-start-2" aria-hidden>
              <span className="absolute inset-y-0 start-0 rounded-full bg-series-waymo" style={{ width: `${100 - r.reduction}%` }} />
            </span>
            <span className="flex flex-col items-end">
              <Chip color="lime">{r.reduction}% fewer</Chip>
              {r.waymo != null && (
                <span className="mt-1 text-caption-1-regular text-text-tertiary tabular-nums">{r.waymo} vs {r.human}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <figcaption>
        <Legend items={[
          { label: "Human benchmark (full track = 100%)", swatch: <span className="h-2 w-4 rounded-full bg-chart-track" aria-hidden /> },
          { label: "Waymo, as a share of the human rate", swatch: <span className="h-2 w-4 rounded-full bg-series-waymo" aria-hidden /> },
          { label: "Rates, where published, are incidents per million miles", swatch: null },
        ]} />
      </figcaption>
    </Card>
  );
}
