// The question-style headline and one-paragraph dek at the top of every page.
// Copy comes from PAGES in data.js.
export default function PageIntro({ page }) {
  return (
    <header className="flex flex-col gap-2">
      {page.eyebrow && <p className="text-caption-1-medium uppercase tracking-wider text-accent-500">{page.eyebrow}</p>}
      <h1 className="max-w-[22ch] text-display-3-semibold text-balance text-text-primary max-sm:text-title-1-semibold">
        {page.title}
      </h1>
      <p className="max-w-[62ch] text-headline-regular text-text-secondary max-sm:text-body-regular">{page.sub}</p>
    </header>
  );
}
