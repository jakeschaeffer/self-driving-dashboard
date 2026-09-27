// A small status label. `tone` picks the color: "good" | "warn" | "bad" | "neutral".
// The text itself always says the status, so color is never the only signal.
import s from "./Pill.module.css";

export default function Pill({ tone = "neutral", children }) {
  return <span className={s.pill} data-tone={tone}>{children}</span>;
}
