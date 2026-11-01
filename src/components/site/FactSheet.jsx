// A titled list of label → value facts, each with an optional source.
// Used for Tesla's "Supervised vs. Robotaxi" comparison.
import SourceTag from "./SourceTag.jsx";
import Card from "./Card.jsx";

export default function FactSheet({ title, rows }) {
  return (
    <Card className="flex flex-col gap-2 p-2">
      <h3 className="px-2 pt-2 text-headline-semibold text-text-primary">{title}</h3>
      <Card as="dl" inner className="flex flex-col divide-y divide-separator-border">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 px-3 py-2.5">
            <dt className="text-body-medium text-text-secondary">{r.label}</dt>
            <dd className="text-end text-body-semibold text-text-primary tabular-nums">{r.value}</dd>
            {r.source && <dd className="col-span-2"><SourceTag source={r.source} /></dd>}
          </div>
        ))}
      </Card>
    </Card>
  );
}
