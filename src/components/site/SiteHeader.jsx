// Sticky top bar: wordmark, page tabs (BoardUI PillTab), data date, theme toggle.
import { PAGES, SITE } from "../../../data.js";
import { PillTabList, PillTab } from "@/components/base/tabs/pill-tab";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";

// Pages live in the URL hash (#waymo, #tesla…), so back/forward and shared links work.
const go = (id) => { window.location.hash = id === "home" ? "" : id; };

export default function SiteHeader({ active }) {
  return (
    <header className="sticky top-0 z-40 border-b border-separator-border bg-background-full/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 max-md:flex-wrap">
        <a href="#" onClick={() => go("home")} className="rounded-md text-headline-bold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <span className="text-accent-500">AV</span>Progress
        </a>

        {/* On phones the tabs drop to their own row and scroll sideways. */}
        <nav aria-label="Pages" className="-mx-1 overflow-x-auto px-1 max-md:order-last max-md:w-full md:flex-1">
          <PillTabList>
            {PAGES.map((p) => (
              <PillTab key={p.id} variant="gray" isSelected={active === p.id} onSelect={() => go(p.id)}>
                {p.nav}
              </PillTab>
            ))}
          </PillTabList>
        </nav>

        <div className="ms-auto flex items-center gap-3">
          <span className="text-caption-1-medium whitespace-nowrap text-text-tertiary max-sm:hidden">
            Data through {SITE.lastUpdated}
          </span>
          <ThemeToggle appearance="segmented" size="small" />
        </div>
      </div>
    </header>
  );
}
