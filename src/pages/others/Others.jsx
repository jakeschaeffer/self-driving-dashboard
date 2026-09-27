// Other Players — everyone beyond Waymo and Tesla, grouped by how far along
// they are: driverless service, supervised service, testing, or shut down.
import { OTHERS_STATS, OTHER_PLAYERS, SOURCES, SITE } from "../../../data.js";
import Section from "../../components/Section.jsx";
import StatStrip from "../../components/StatStrip.jsx";
import Note from "../../components/Note.jsx";
import Pill from "../../components/Pill.jsx";
import SourceTag from "../../components/SourceTag.jsx";
import s from "./Others.module.css";

const GROUPS = [
  { status: "driverless", tone: "good",    title: "Driverless service", blurb: "Paid or public rides with no one at the wheel." },
  { status: "supervised", tone: "warn",    title: "Supervised service", blurb: "Public rides with a safety operator on board." },
  { status: "testing",    tone: "neutral", title: "Testing or announced", blurb: "Permits, pilots and launch dates." },
  { status: "dead",       tone: "bad",     title: "Shut down", blurb: "" },
];

export default function Others() {
  return (
    <>
      <StatStrip stats={OTHERS_STATS} />

      <Section
        eyebrow={`Status as of ${SITE.lastUpdated}`}
        title="Who else is on the road"
        subtitle="Each company's headline number is the one it chooses to disclose: rides, fleet size or miles."
      >
        {GROUPS.map((g) => {
          const players = OTHER_PLAYERS.filter((p) => p.status === g.status);
          if (!players.length) return null;
          return (
            <div key={g.status} className={s.group}>
              <div className={s.groupHead}>
                <Pill tone={g.tone}>{g.title}</Pill>
                {g.blurb && <span className={s.blurb}>{g.blurb}</span>}
              </div>
              <ul className={s.grid}>
                {players.map((p) => (
                  <li key={p.company} className={s.card} data-status={p.status}>
                    <h3 className={s.company}>{p.company}</h3>
                    <p className={s.scale}>{p.scale}</p>
                    <p className={s.detail}>{p.detail}</p>
                    <SourceTag source={p.source} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <Note title="Not comparable">
          Rides, fleet size and miles can't be compared across companies. NHTSA's Standing General Order
          (<SourceTag source={SOURCES.nhtsaSgo} />) is the only neutral cross-company incident feed, and it has
          no mileage denominators.
        </Note>
      </Section>
    </>
  );
}
