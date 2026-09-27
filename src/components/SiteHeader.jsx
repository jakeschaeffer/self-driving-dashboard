// Sticky top bar: the green guide-sign wordmark, page tabs, data date, theme toggle.
import { PAGES, SITE } from "../../data.js";
import ThemeToggle from "./ThemeToggle.jsx";
import s from "./SiteHeader.module.css";

// Plain links (not buttons): navigation changes the URL, so it should be an <a>.
// That also gives middle-click, "copy link" and screen-reader semantics for free.
const hrefFor = (id) => (id === "home" ? "#" : "#" + id);

export default function SiteHeader({ active }) {
  return (
    <header className={s.header}>
      <div className={s.inner}>
        <a className={s.brand} href="#" aria-label="AVProgress, overview">
          <span className={s.sign}>
            <span className={s.av}>AV</span>Progress
          </span>
        </a>

        <nav className={s.nav} aria-label="Pages">
          {PAGES.map((p) => (
            <a
              key={p.id}
              href={hrefFor(p.id)}
              className={s.link}
              aria-current={active === p.id ? "page" : undefined}
            >
              {p.nav}
            </a>
          ))}
        </nav>

        <div className={s.meta}>
          <span className={s.date}>Data through {SITE.lastUpdated}</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
