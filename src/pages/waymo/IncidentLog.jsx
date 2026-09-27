// Known Waymo incidents and limitations, newest first, with a severity pill.
import { WAYMO_INCIDENTS } from "../../../data.js";
import Pill from "../../components/Pill.jsx";
import SourceTag from "../../components/SourceTag.jsx";
import s from "./IncidentLog.module.css";

const SEVERITY = {
  high:   { tone: "bad",     label: "Serious" },
  medium: { tone: "warn",    label: "Recall / fix" },
  info:   { tone: "neutral", label: "Limitation" },
};

export default function IncidentLog() {
  return (
    <ol className={s.log}>
      {WAYMO_INCIDENTS.map((item) => {
        const sev = SEVERITY[item.severity];
        return (
          <li key={item.text} className={s.item}>
            <span className={s.date}>{item.date}</span>
            <span className={s.pill}><Pill tone={sev.tone}>{sev.label}</Pill></span>
            <p className={s.text}>
              {item.text} {item.source && <SourceTag source={item.source} />}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
