// Footer: how to read the source tags, the main data sources, and the disclaimer.
import { FOOTER_SOURCES, SITE } from "../../data.js";
import { SOURCE_TYPES, SourceTypeBadge } from "./SourceTag.jsx";
import s from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.block}>
          <h2 className={s.heading}>Reading the source tags</h2>
          <ul className={s.legend}>
            {Object.entries(SOURCE_TYPES).map(([type, t]) => (
              <li key={type}><SourceTypeBadge type={type} /> {t.name}</li>
            ))}
          </ul>
        </div>
        <div className={s.block}>
          <h2 className={s.heading}>Main sources</h2>
          <p className={s.text}>{FOOTER_SOURCES.join(" · ")}</p>
        </div>
        <div className={s.block}>
          <h2 className={s.heading}>Fine print</h2>
          <p className={s.text}>
            Data through {SITE.lastUpdated}. Metrics use different methodologies and are not
            always comparable; each chart says what it counts. Not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
