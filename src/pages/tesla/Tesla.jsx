// Tesla FSD — version trend, supervised vs. robotaxi, and the promise record.
import {
  TESLA_STATS, TESLA_VERSION_PROGRESS, TESLA_FSD_SUPERVISED, TESLA_ROBOTAXI, SOURCES,
} from "../../../data.js";
import { fullMiles } from "../../lib/format.js";
import Section from "../../components/Section.jsx";
import StatStrip from "../../components/StatStrip.jsx";
import Note from "../../components/Note.jsx";
import SourceTag from "../../components/SourceTag.jsx";
import FactSheet from "../../components/FactSheet.jsx";
import VersionTrend from "./VersionTrend.jsx";
import PromiseTimeline from "./PromiseTimeline.jsx";
import t from "../../components/Table.module.css";
import s from "./Tesla.module.css";

export default function Tesla() {
  return (
    <>
      <StatStrip stats={TESLA_STATS} />

      <Section
        eyebrow="Miles between critical disengagements · log scale"
        title="Version by version"
        subtitle="Each release goes farther before a driver has to take over. The question is whether the slope holds."
      >
        <VersionTrend />
        <details className={t.details}>
          <summary className={t.summary}>Show the version data as a table</summary>
          <div className={t.scroll}>
            <table className={t.table}>
              <thead>
                <tr><th>Version</th><th>Wide release</th><th className={t.num}>Miles per critical disengagement</th></tr>
              </thead>
              <tbody>
                {TESLA_VERSION_PROGRESS.map((v) => (
                  <tr key={v.version}>
                    <td className={t.metric}>{v.version}</td>
                    <td>{v.date}</td>
                    <td className={t.num}>{fullMiles(v.milesPerIntervention)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <Note title="Crowdsourced data skews optimistic">
          Most miles come from enthusiasts driving in favorable conditions (<SourceTag source={SOURCES.teslaTracker} />).
          Independent testing on standardized routes found just 13 miles between interventions on v12.5
          (<SourceTag source={SOURCES.electrekAmci} />).
        </Note>
      </Section>

      <Section
        eyebrow="Same software, different rules"
        title="Supervised FSD vs. Robotaxi"
        subtitle="Two products with two safety records. One needs a driver; the other has none."
      >
        <div className={s.sheets}>
          <FactSheet title="FSD Supervised" rows={TESLA_FSD_SUPERVISED} />
          <FactSheet title="Robotaxi (no driver)" rows={TESLA_ROBOTAXI} />
        </div>
        <Note>
          Tesla fully redacted robotaxi crash details from NHTSA filings until May 2026; narratives are now
          public (<SourceTag source={SOURCES.electrekUnredact} />). Tesla's quarterly Vehicle Safety Reports
          count only high-severity events, mostly on highways (<SourceTag source={SOURCES.teslaSafety} />). The
          IIHS finds little evidence that partial automation improves safety (<SourceTag source={SOURCES.iihs} />).
        </Note>
      </Section>

      <Section
        eyebrow="Claims vs. reality, 2015 → today"
        title="Promises on the timeline"
        subtitle="When each self-driving claim was made, when it was due, and how far past due it ran."
      >
        <PromiseTimeline />
      </Section>
    </>
  );
}
