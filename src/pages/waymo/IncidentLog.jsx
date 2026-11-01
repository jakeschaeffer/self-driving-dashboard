// Known Waymo incidents and limitations, newest first, with a severity chip.
// Laid out like BoardUI's alert feed: one row per item on a single card.
import { WAYMO_INCIDENTS } from "../../../data.js";
import Card from "../../components/site/Card.jsx";
import StatusChip from "../../components/site/StatusChip.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";

const SEVERITY = {
  high:   { tone: "bad",     label: "Serious" },
  medium: { tone: "warn",    label: "Recall / fix" },
  info:   { tone: "neutral", label: "Limitation" },
};

export default function IncidentLog() {
  return (
    <Card className="p-2">
      <Card as="ol" inner className="flex flex-col divide-y divide-separator-border">
        {WAYMO_INCIDENTS.map((item) => {
          const sev = SEVERITY[item.severity];
          return (
            <li key={item.text} className="grid gap-x-4 gap-y-1.5 px-4 py-3 sm:grid-cols-[6rem_8rem_minmax(0,1fr)] sm:items-baseline">
              <span className="text-body-2-medium text-text-tertiary tabular-nums">{item.date}</span>
              <span><StatusChip tone={sev.tone}>{sev.label}</StatusChip></span>
              <p className="text-body-regular text-text-primary">
                {item.text} {item.source && <SourceTag source={item.source} />}
              </p>
            </li>
          );
        })}
      </Card>
    </Card>
  );
}
