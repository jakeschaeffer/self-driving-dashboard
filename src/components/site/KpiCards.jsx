// The row of headline numbers under each page title (HOME_STATS, WAYMO_STATS, …).
// Follows the recipe of BoardUI's StatCards "footer" variant: label, a large
// value, then a white footer band. Our footer carries the source instead of a
// month-over-month delta, because these numbers aren't trends.
import SeriesDot from "./SeriesDot.jsx";
import SourceTag from "./SourceTag.jsx";
import Card from "./Card.jsx";

export default function KpiCards({ stats }) {
  return (
    <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((st) => (
        <Card key={st.label} className="flex flex-col p-2">
          <div className="flex flex-col gap-0.5 px-2 pt-2 pb-3.5">
            <dt className="flex items-center gap-2 text-body-medium text-text-secondary">
              <SeriesDot series={st.series} />
              {st.label}
            </dt>
            <dd className="text-display-4-medium whitespace-nowrap text-text-primary tabular-nums">{st.value}</dd>
            <dd className="text-body-2-regular text-text-tertiary">{st.sublabel}</dd>
          </div>
          {st.source && (
            <Card as="dd" inner className="mt-auto flex items-center px-2.5 py-2">
              <SourceTag source={st.source} />
            </Card>
          )}
        </Card>
      ))}
    </dl>
  );
}
