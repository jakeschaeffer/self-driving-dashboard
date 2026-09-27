// The question-style headline and one-paragraph dek at the top of every page.
// Copy comes from PAGES in data.js.
import s from "./PageIntro.module.css";

export default function PageIntro({ page }) {
  return (
    <header className={s.intro} data-hero={page.id === "home" || undefined}>
      {page.eyebrow && <p className={s.eyebrow}>{page.eyebrow}</p>}
      <h1 className={s.title}>{page.title}</h1>
      <p className={s.sub}>{page.sub}</p>
    </header>
  );
}
