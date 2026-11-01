// "Show as a table" fold-out under a chart. A native <details> element, so it
// works with the keyboard and screen readers with no JavaScript.
import { RiArrowRightSLine } from "@remixicon/react";

export default function Disclosure({ summary, children }) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md text-body-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring [&::-webkit-details-marker]:hidden">
        <RiArrowRightSLine className="size-5 transition-transform group-open:rotate-90" aria-hidden />
        {summary}
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}
