// A citation link that also shows what KIND of source it is.
// The type comes from `type` on each entry in SOURCES (data.js). The tag's
// outline encodes trust: solid = independent, outlined = self-reported or
// press, dashed = crowdsourced. SiteFooter shows the legend.
import s from "./SourceTag.module.css";

export const SOURCE_TYPES = {
  regulator:   { short: "GOV",   name: "Regulator or government data" },
  academic:    { short: "PEER",  name: "Peer-reviewed research" },
  company:     { short: "SELF",  name: "Self-reported by the company" },
  crowdsource: { short: "CROWD", name: "Crowdsourced, skews optimistic" },
  press:       { short: "PRESS", name: "Journalism or analyst report" },
};

export default function SourceTag({ source }) {
  const type = SOURCE_TYPES[source.type];
  return (
    <a
      className={s.tag}
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      title={type ? `${type.name}: ${source.label}` : source.label}
    >
      {type && <span className={s.type} data-type={source.type}>{type.short}</span>}
      <span className={s.label}>{source.label}</span>
    </a>
  );
}

// Standalone type badge, used in the footer legend.
export function SourceTypeBadge({ type }) {
  return <span className={s.type} data-type={type}>{SOURCE_TYPES[type].short}</span>;
}
