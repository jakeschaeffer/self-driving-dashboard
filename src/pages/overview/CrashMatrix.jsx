// Like-for-like table: miles between events for humans, Waymo and Tesla's
// robotaxi, one row per severity. Rows come from CRASH_RATES in data.js.
import { CRASH_RATES, CRASH_RATES_FOOTNOTE } from "../../../data.js";
import SourceTag from "../../components/SourceTag.jsx";
import s from "../../components/Table.module.css";

const COLUMNS = [
  { key: "human", name: "Human drivers", series: "human" },
  { key: "waymo", name: "Waymo", series: "waymo", flag: "waymoGood" },
  { key: "tesla", name: "Tesla Robotaxi", series: "tesla", flag: "teslaGood" },
];

// Values are strings in data.js ("529K", "~57K", "0 fatalities*").
// Plain numbers get a "mi" unit; text values are shown as written.
function Cell({ value, good, name }) {
  const isNumber = value !== "—" && !/[a-z]/.test(value);
  const dir = good === true ? 1 : good === false ? -1 : 0;
  return (
    <td className={s.num} data-label={name}>
      <span className={s.delta} data-dir={dir}>
        {dir > 0 && <span aria-label="better than human drivers">▲ </span>}
        {dir < 0 && <span aria-label="worse than human drivers">▼ </span>}
        <span className={s.big}>{value}</span>
        {isNumber && <span className={s.unit}> mi</span>}
      </span>
    </td>
  );
}

export default function CrashMatrix() {
  return (
    <>
    <div className={s.scroll} data-stack>
      <table className={s.table} data-matrix>
        <thead>
          <tr>
            <th>Event</th>
            {COLUMNS.map((c) => (
              <th key={c.key} className={s.num}>
                <span className={s.system}>
                  <span className={s.key} data-series={c.series} aria-hidden="true" />
                  {c.name}
                </span>
              </th>
            ))}
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {CRASH_RATES.map((r) => (
            <tr key={r.metric}>
              <td className={s.metric}>{r.metric}</td>
              {COLUMNS.map((c) => (
                <Cell key={c.key} name={c.name} value={r[c.key]} good={c.flag ? r[c.flag] : null} />
              ))}
              <td><SourceTag source={r.source} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className={s.footnote}>
      {CRASH_RATES_FOOTNOTE.text} <SourceTag source={CRASH_RATES_FOOTNOTE.source} />
    </p>
    </>
  );
}
