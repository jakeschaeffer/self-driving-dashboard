// A titled block of a page. `eyebrow` is a small label naming what's measured
// (e.g. "Miles between events · log scale"); `subtitle` is one line of context.
import { useId } from "react";
import s from "./Section.module.css";

export default function Section({ eyebrow, title, subtitle, children }) {
  const id = useId(); // unique id so the heading labels its section for screen readers
  return (
    <section className={s.section} aria-labelledby={id}>
      <header className={s.head}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <h2 id={id} className={s.title}>{title}</h2>
        {subtitle && <p className={s.sub}>{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}
