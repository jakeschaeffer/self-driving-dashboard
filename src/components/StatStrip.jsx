// The row of headline numbers under each page title (HOME_STATS, WAYMO_STATS, …).
// A <dl> (description list) is the semantic HTML for label → value pairs.
import SourceTag from "./SourceTag.jsx";
import s from "./StatStrip.module.css";

export default function StatStrip({ stats }) {
  return (
    <dl className={s.strip}>
      {stats.map((st) => (
        <div className={s.tile} key={st.label}>
          <dt className={s.label}>
            {st.series && <span className={s.key} data-series={st.series} aria-hidden="true" />}
            {st.label}
          </dt>
          <dd className={s.value}>{st.value}</dd>
          <dd className={s.sub}>{st.sublabel}</dd>
          {st.source && <dd className={s.source}><SourceTag source={st.source} /></dd>}
        </div>
      ))}
    </dl>
  );
}
