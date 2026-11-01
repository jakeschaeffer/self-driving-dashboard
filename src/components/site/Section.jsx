// A titled block of a page. `eyebrow` is a small label naming what's measured
// (e.g. "Miles between events · log scale"); `subtitle` is one line of context.
import { useId } from "react";

export default function Section({ eyebrow, title, subtitle, children }) {
  const id = useId(); // unique id so the heading labels its section for screen readers
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        {eyebrow && <p className="text-caption-1-medium uppercase tracking-wider text-text-tertiary">{eyebrow}</p>}
        <h2 id={id} className="text-title-2-semibold text-balance text-text-primary">{title}</h2>
        {subtitle && <p className="max-w-[70ch] text-body-regular text-text-secondary">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}
