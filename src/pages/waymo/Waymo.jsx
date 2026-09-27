// Waymo — miles growth, crash reduction by severity, incidents.
import { WAYMO_STATS, SOURCES } from "../../../data.js";
import Section from "../../components/Section.jsx";
import StatStrip from "../../components/StatStrip.jsx";
import Note from "../../components/Note.jsx";
import SourceTag from "../../components/SourceTag.jsx";
import MilesChart from "./MilesChart.jsx";
import ReductionBars from "./ReductionBars.jsx";
import IncidentLog from "./IncidentLog.jsx";

export default function Waymo() {
  return (
    <>
      <StatStrip stats={WAYMO_STATS} />

      <Section
        eyebrow="Cumulative rider-only miles · millions"
        title="The odometer"
        subtitle="Miles driven with no one in the driver's seat. The curve bends upward as new cities open."
      >
        <MilesChart />
        <p><SourceTag source={SOURCES.waymoSafety} /></p>
      </Section>

      <Section
        eyebrow="Incidents per million miles"
        title="Crash rates by severity"
        subtitle="Waymo against the human benchmark for the same roads, one row per kind of crash."
      >
        <ReductionBars />
        <p><SourceTag source={SOURCES.kusano2025} /> <SourceTag source={SOURCES.swissRe} /></p>
        <Note>
          Swiss Re compared Waymo against newer vehicles (2018–2021) with driver-assist features, the fairest
          human benchmark available. Human crash data misses about 60% of minor incidents
          (<SourceTag source={SOURCES.nhtsa} />), while AVs report nearly every contact event.
        </Note>
      </Section>

      <Section eyebrow="Newest first" title="Incidents and limits" subtitle="Recalls, investigations, and what Waymo still can't do.">
        <IncidentLog />
      </Section>
    </>
  );
}
