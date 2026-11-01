// Footer: how to read the source tags, the main data sources, and the disclaimer.
import { FOOTER_SOURCES, SITE } from "../../../data.js";
import { SOURCE_TYPES, SourceTypeChip } from "./SourceTag.jsx";

const Heading = ({ children }) => (
  <h2 className="text-caption-1-medium uppercase tracking-wider text-text-tertiary">{children}</h2>
);

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-separator-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <Heading>Reading the source tags</Heading>
          <ul className="flex flex-col gap-2 text-body-2-regular text-text-secondary">
            {Object.entries(SOURCE_TYPES).map(([type, t]) => (
              <li key={type} className="flex items-center gap-2"><SourceTypeChip type={type} /> {t.name}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <Heading>Main sources</Heading>
          <p className="text-body-2-regular text-text-secondary">{FOOTER_SOURCES.join(" · ")}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Heading>Fine print</Heading>
          <p className="text-body-2-regular text-text-secondary">
            Data through {SITE.lastUpdated}. Metrics use different methodologies and are not
            always comparable; each chart says what it counts. Not investment advice.
          </p>
          <p className="text-body-2-regular text-text-tertiary">
            UI built with <a className="underline underline-offset-2 hover:text-text-primary" href="https://github.com/BoardUI/boardui" target="_blank" rel="noopener noreferrer">BoardUI</a> (MIT).
          </p>
        </div>
      </div>
    </footer>
  );
}
