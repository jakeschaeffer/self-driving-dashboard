// Musk's self-driving promises as timelines: when each claim was made, when it
// was due, and how long it ran over (to delivery, or to today if still waiting).
import { MUSK_PREDICTIONS, SITE } from "../../../data.js";
import { yearFraction } from "../../lib/format.js";
import SourceTag from "../../components/SourceTag.jsx";
import s from "./PromiseTimeline.module.css";

const START = 2015;
const END = 2027;
const YEAR_TICKS = [2015, 2017, 2019, 2021, 2023, 2025]; // stops short of "Today"
// Claims are stored as whole years; place them mid-year.
const pos = (year) => ((year + 0.5 - START) / (END - START)) * 100;
const nowPos = pos(yearFraction(SITE.asOf) - 0.5);

function lateness(p, now) {
  const end = p.done ?? now;
  const years = Math.floor(end - p.due);
  if (years <= 0) return p.done ? "On time" : "Due now";
  const y = years === 1 ? "1 yr" : `${years} yrs`;
  return p.done ? `${y} late` : `${y}+ overdue`;
}

export default function PromiseTimeline() {
  const now = yearFraction(SITE.asOf) - 0.5;
  const rows = [...MUSK_PREDICTIONS].sort((a, b) => a.said - b.said || a.due - b.due);

  return (
    <div className={s.wrap}>
      <div className={s.axisRow} aria-hidden="true">
        <div />
        <div className={s.axis}>
          {YEAR_TICKS.map((yr) => (
            <span key={yr} className={s.year} style={{ "--pos": pos(yr) - 50 / (END - START) }}>{yr}</span>
          ))}
          <span className={s.nowTag} style={{ "--pos": nowPos }}>Today</span>
        </div>
      </div>

      <ol className={s.list}>
        {rows.map((p) => {
          const end = p.done ?? now;
          return (
            <li key={p.claim} className={s.row}>
              <div className={s.text}>
                <p className={s.claim}>“{p.claim}”</p>
                <p className={s.result}>
                  <span className={s.status} data-done={p.done ? "yes" : "no"}>{lateness(p, now)}</span>{" "}
                  {p.result} <SourceTag source={p.source} />
                </p>
              </div>
              <div className={s.track} aria-hidden="true">
                <span className={s.nowLine} style={{ "--pos": nowPos }} />
                <span className={s.promise} style={{ "--a": pos(p.said), "--b": pos(p.due) }} />
                <span className={s.delay} style={{ "--a": pos(p.due), "--b": p.done ? pos(p.done) : nowPos }} />
                <span className={s.said} style={{ "--pos": pos(p.said) }} />
                <span className={s.due} style={{ "--pos": pos(p.due) }} />
                <span className={p.done ? s.done : s.waiting} style={{ "--pos": p.done ? pos(p.done) : nowPos }} />
              </div>
              <span className={s.srOnly}>
                Said {p.said}, promised for {p.due}, {p.done ? `delivered ${p.done}` : "not delivered"} ({end - p.due > 0 ? "late" : "on time"}).
              </span>
            </li>
          );
        })}
      </ol>

      <p className={s.legend}>
        <span className={s.lgItem}><i className={s.lgSaid} /> Claim made</span>
        <span className={s.lgItem}><i className={s.lgPromise} /> Promised window</span>
        <span className={s.lgItem}><i className={s.lgDelay} /> Overdue</span>
        <span className={s.lgItem}><i className={s.lgDone} /> Delivered</span>
        <span className={s.lgItem}><i className={s.lgWaiting} /> Still waiting</span>
      </p>
    </div>
  );
}
