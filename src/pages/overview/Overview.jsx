// Overview — the road chart plus the like-for-like crash table.
import { SAFETY_POINTS, HOME_STATS, SOURCES } from "../../../data.js";
import { fullMiles } from "../../lib/format.js";
import { compareToHuman } from "../../lib/compare.js";
import Section from "../../components/Section.jsx";
import StatStrip from "../../components/StatStrip.jsx";
import Note from "../../components/Note.jsx";
import SourceTag from "../../components/SourceTag.jsx";
import RoadChart from "./RoadChart.jsx";
import PointsTable from "./PointsTable.jsx";
import CrashMatrix from "./CrashMatrix.jsx";

// The one-sentence takeaway, computed from the data so it never goes stale:
// Waymo's best like-for-like lead, and Tesla's best supervised number.
function Verdict() {
  const best = (list) => list.reduce((a, b) => (b.miles > a.miles ? b : a));
  const waymo = SAFETY_POINTS.filter((p) => p.category === "waymo" && p.event !== "disengagement")
    .map((p) => ({ p, cmp: compareToHuman(p) }))
    .reduce((a, b) => (b.p.miles / b.cmp.benchmark.miles > a.p.miles / a.cmp.benchmark.miles ? b : a));
  const fsd = best(SAFETY_POINTS.filter((p) => p.category === "tesla" && p.event === "disengagement"));
  const fsdCmp = compareToHuman(fsd);
  return (
    <>
      Waymo goes <strong>{waymo.cmp.text.replace(" better", "")}</strong> farther than human drivers between{" "}
      {waymo.cmp.benchmarkLabel}es. Tesla's best supervised figure, {fullMiles(fsd.miles)} miles between critical
      disengagements, is <strong>{fsdCmp.text.replace(" short", "")}</strong> short of the human crash rate.
    </>
  );
}

export default function Overview() {
  return (
    <>
      <StatStrip stats={HOME_STATS} />

      <Section
        eyebrow="Miles between events · log scale"
        title="Everyone on one road"
        subtitle={<Verdict />}
      >
        <RoadChart points={SAFETY_POINTS} />
        <PointsTable points={SAFETY_POINTS} />
      </Section>

      <Section
        eyebrow="Miles between events · higher is safer"
        title="Like for like"
        subtitle="The same kind of event, measured the same way. ▲ beats the human rate, ▼ falls short."
      >
        <CrashMatrix />
        <Note>
          Disengagements and crashes are different things: a disengagement is a human taking over,
          and most would not have ended in a crash. Human crash data also misses about 60% of minor
          incidents (<SourceTag source={SOURCES.nhtsa} />), while AVs report nearly every contact event.
        </Note>
      </Section>
    </>
  );
}
