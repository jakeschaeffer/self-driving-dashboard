// Waymo vs. human crash rates by severity. Each row is scaled to its own human
// rate (the gray bar = 100%), so every row reads the same way: how much of the
// human rate is left.
import { WAYMO_CRASH_REDUCTION } from "../../../data.js";
import s from "./ReductionBars.module.css";

export default function ReductionBars() {
  return (
    <figure className={s.figure}>
      <ul className={s.list}>
        {WAYMO_CRASH_REDUCTION.map((r) => (
          <li key={r.category} className={s.row}>
            <span className={s.cat}>{r.category}</span>
            <span className={s.bars} aria-hidden="true">
              <span className={s.human} />
              <span className={s.waymo} style={{ "--w": (r.waymo / r.human) * 100 }} />
            </span>
            <span className={s.pct}>{r.reduction}% fewer</span>
            <span className={s.rates}>
              {r.waymo} <span className={s.vs}>vs</span> {r.human}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className={s.legend}>
        <span className={s.lgItem}><i className={s.lgHuman} /> Human benchmark (100%)</span>
        <span className={s.lgItem}><i className={s.lgWaymo} /> Waymo, as a share of the human rate</span>
        <span className={s.lgItem}>Rates are incidents per million miles.</span>
      </figcaption>
    </figure>
  );
}
