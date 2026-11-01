// A caveat box: a warning glyph, a bold title, and the context a reader needs
// before trusting a number. Uses BoardUI's yellow status colors.
import { RiErrorWarningFill } from "@remixicon/react";
import Card from "./Card.jsx";

export default function Callout({ title = "Caveat", children }) {
  return (
    <Card as="aside" className="flex gap-3 p-4">
      <RiErrorWarningFill className="mt-0.5 size-5 shrink-0 text-status-yellow-text" aria-hidden />
      <p className="max-w-[75ch] text-body-regular text-text-secondary">
        <strong className="text-body-semibold text-text-primary">{title}.</strong> {children}
      </p>
    </Card>
  );
}
