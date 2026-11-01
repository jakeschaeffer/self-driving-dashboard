// A citation link that also shows what KIND of source it is, as a BoardUI chip.
// The type comes from `type` on each entry in SOURCES (data.js); the footer
// shows the legend. Chip color encodes trust: government and peer review are
// cool colors, self-reported and crowdsourced numbers are warm.
import { Chip } from "@/components/base/badges/chip";
import { cx } from "@/utils/cx";

export const SOURCE_TYPES = {
  regulator:   { short: "GOV",   name: "Regulator or government data", color: "blue" },
  academic:    { short: "PEER",  name: "Peer-reviewed research",       color: "purple" },
  company:     { short: "SELF",  name: "Self-reported by the company", color: "yellow" },
  crowdsource: { short: "CROWD", name: "Crowdsourced, skews optimistic", color: "orange" },
  press:       { short: "PRESS", name: "Journalism or analyst report", color: "neutral" },
};

export function SourceTypeChip({ type }) {
  const t = SOURCE_TYPES[type];
  if (!t) return null;
  return (
    <Chip variant="caption" color={t.color} className="px-1 py-0 font-mono text-caption-2-semibold tracking-wide">
      {t.short}
    </Chip>
  );
}

export default function SourceTag({ source, className }) {
  if (!source) return null;
  const type = SOURCE_TYPES[source.type];
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      title={type ? `${type.name}: ${source.label}` : source.label}
      className={cx(
        "inline-flex max-w-full items-center gap-1.5 rounded-md align-middle text-body-2-medium text-text-secondary",
        "underline decoration-separator-border underline-offset-2 transition-colors hover:text-text-primary hover:decoration-current",
        "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        className,
      )}
    >
      {type && <SourceTypeChip type={source.type} />}
      <span className="truncate">{source.label}</span>
    </a>
  );
}
