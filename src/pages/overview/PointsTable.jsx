// Every point on the road as a plain table, folded away under the chart.
// Charts need a text alternative: this is it, and it is where sources live.
import { EVENT_TYPES } from "../../../data.js";
import { fullMiles } from "../../lib/format.js";
import { compareToHuman } from "../../lib/compare.js";
import SourceTag from "../../components/SourceTag.jsx";
import s from "../../components/Table.module.css";

const LANE_ORDER = { tesla: 0, waymo: 1, human: 2 };

export default function PointsTable({ points }) {
  const rows = [...points].sort(
    (a, b) => LANE_ORDER[a.category] - LANE_ORDER[b.category] || b.miles - a.miles
  );
  return (
    <details className={s.details}>
      <summary className={s.summary}>Show all {rows.length} data points as a table</summary>
      <div className={s.scroll}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>System</th>
              <th>What is counted</th>
              <th className={s.num}>Miles per event</th>
              <th>Compared with human drivers</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const cmp = compareToHuman(p);
              return (
                <tr key={p.id}>
                  <td>
                    <span className={s.system}>
                      <span className={s.key} data-series={p.category} aria-hidden="true" />
                      {p.label}
                    </span>
                    <span className={s.subtle}>{p.sublabel}</span>
                  </td>
                  <td>{EVENT_TYPES[p.event].label}</td>
                  <td className={s.num}>{fullMiles(p.miles)}</td>
                  <td>
                    {cmp ? (
                      <span className={s.delta} data-dir={cmp.dir}>
                        {cmp.dir > 0 ? "▲ " : cmp.dir < 0 ? "▼ " : ""}
                        {cmp.text}
                        <span className={s.subtle}>
                          vs. {cmp.benchmarkLabel} rate{cmp.approx ? " (approx.)" : ""}
                        </span>
                      </span>
                    ) : (
                      <span className={s.subtle}>Benchmark</span>
                    )}
                  </td>
                  <td><SourceTag source={p.source} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
