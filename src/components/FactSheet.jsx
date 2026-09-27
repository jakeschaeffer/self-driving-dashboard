// A titled list of label → value facts, each with an optional source.
// Used for Tesla's "Supervised vs. Robotaxi" comparison.
import SourceTag from "./SourceTag.jsx";
import s from "./FactSheet.module.css";

export default function FactSheet({ title, rows }) {
  return (
    <div className={s.sheet}>
      <h3 className={s.title}>{title}</h3>
      <dl className={s.list}>
        {rows.map((r) => (
          <div key={r.label} className={s.row}>
            <dt className={s.label}>{r.label}</dt>
            <dd className={s.value}>{r.value}</dd>
            {r.source && <dd className={s.source}><SourceTag source={r.source} /></dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}
