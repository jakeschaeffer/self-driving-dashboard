// Waymo — miles growth, crash reduction by severity, incidents.
import { WAYMO_STATS, SOURCES } from "../../../data.js";
import Section from "../../components/site/Section.jsx";
import KpiCards from "../../components/site/KpiCards.jsx";
import Callout from "../../components/site/Callout.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import MilesChart from "./MilesChart.jsx";
import ReductionBars from "./ReductionBars.jsx";
import IncidentLog from "./IncidentLog.jsx";

export default function Waymo() {
  return (
    <>
      <KpiCards stats={WAYMO_STATS} />

      <Section
        eyebrow="Cumulative rider-only miles · millions"
        title="The odometer"
        subtitle="Miles driven with no one in the driver's seat. The curve bends upward as new cities open."
      >
        <MilesChart />
        <p className="flex flex-wrap gap-3"><SourceTag source={SOURCES.waymoSafety} /></p>
      </Section>

      <Section
        eyebrow="Incidents per million miles"
        title="Crash rates by severity"
        subtitle="Waymo against the human benchmark for the same roads, one row per kind of crash."
      >
        <ReductionBars />
        <p className="flex flex-wrap gap-3"><SourceTag source={SOURCES.waymoSep26} /> <SourceTag source={SOURCES.swissRe} /></p>
        <Callout>
          Injury rows are Waymo's own figures through June 2026, using a method published in peer-reviewed
          work (<SourceTag source={SOURCES.kusano2025} />). Swiss Re compared Waymo against newer vehicles
          (2018–2021) with driver-assist features. Human crash data misses about 60% of minor incidents
          (<SourceTag source={SOURCES.nhtsa} />), while AVs report nearly every contact event.
        </Callout>
      </Section>

      <Section eyebrow="Newest first" title="Incidents and limits" subtitle="Recalls, investigations, and what Waymo still can't do.">
        <IncidentLog />
      </Section>
    </>
  );
}
