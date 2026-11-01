// Other Players — everyone beyond Waymo and Tesla, grouped by how far along
// they are: driverless service, supervised service, testing, or shut down.
import { OTHERS_STATS, OTHER_PLAYERS, SOURCES, SITE } from "../../../data.js";
import Section from "../../components/site/Section.jsx";
import KpiCards from "../../components/site/KpiCards.jsx";
import Callout from "../../components/site/Callout.jsx";
import StatusChip from "../../components/site/StatusChip.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import Card from "../../components/site/Card.jsx";

const GROUPS = [
  { status: "driverless", tone: "good",    title: "Driverless service", blurb: "Paid or public rides with no one at the wheel." },
  { status: "supervised", tone: "warn",    title: "Supervised service", blurb: "Public rides with a safety operator on board." },
  { status: "testing",    tone: "neutral", title: "Testing or announced", blurb: "Permits, pilots and launch dates." },
  { status: "dead",       tone: "bad",     title: "Shut down", blurb: "" },
];

export default function Others() {
  return (
    <>
      <KpiCards stats={OTHERS_STATS} />

      <Section
        eyebrow={`Status as of ${SITE.lastUpdated}`}
        title="Who else is on the road"
        subtitle="Each company's headline number is the one it chooses to disclose: rides, fleet size or miles."
      >
        {GROUPS.map((g) => {
          const players = OTHER_PLAYERS.filter((p) => p.status === g.status);
          if (!players.length) return null;
          return (
            <div key={g.status} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <StatusChip tone={g.tone}>{g.title}</StatusChip>
                {g.blurb && <span className="text-body-2-regular text-text-tertiary">{g.blurb}</span>}
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {players.map((p) => (
                  <Card as="li" key={p.company} className="flex flex-col gap-2 p-2">
                    <div className="flex flex-col gap-0.5 px-2 pt-2">
                      <h3 className="text-headline-semibold text-text-primary">{p.company}</h3>
                      <p className="text-title-3-medium text-text-primary tabular-nums">{p.scale}</p>
                    </div>
                    <Card inner className="flex flex-1 flex-col gap-2 px-3 py-2.5">
                      <p className="flex-1 text-body-2-regular text-text-secondary">{p.detail}</p>
                      <SourceTag source={p.source} />
                    </Card>
                  </Card>
                ))}
              </ul>
            </div>
          );
        })}
        <Callout title="Not comparable">
          Rides, fleet size and miles can't be compared across companies. NHTSA's Standing General Order
          (<SourceTag source={SOURCES.nhtsaSgo} />) is the only neutral cross-company incident feed, and it has
          no mileage denominators.
        </Callout>
      </Section>
    </>
  );
}
