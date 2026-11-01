// Tesla FSD — version trend, supervised vs. robotaxi, and the promise record.
import {
  TESLA_STATS, TESLA_VERSION_PROGRESS, TESLA_FSD_SUPERVISED, TESLA_ROBOTAXI, SOURCES,
} from "../../../data.js";
import { fullMiles } from "../../lib/format.js";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@/components/base/table/table";
import Section from "../../components/site/Section.jsx";
import KpiCards from "../../components/site/KpiCards.jsx";
import Callout from "../../components/site/Callout.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import FactSheet from "../../components/site/FactSheet.jsx";
import Disclosure from "../../components/site/Disclosure.jsx";
import Card from "../../components/site/Card.jsx";
import VersionTrend from "./VersionTrend.jsx";
import PromiseTimeline from "./PromiseTimeline.jsx";

export default function Tesla() {
  return (
    <>
      <KpiCards stats={TESLA_STATS} />

      <Section
        eyebrow="Miles between critical disengagements · log scale"
        title="Version by version"
        subtitle="Each release goes farther before a driver has to take over. The question is whether the slope holds."
      >
        <VersionTrend />
        <Disclosure summary="Show the version data as a table">
          <Card inner className="overflow-hidden">
            <Table aria-label="FSD versions" size="sm">
              <TableHeader>
                <TableColumn isRowHeader>Version</TableColumn>
                <TableColumn>Wide release</TableColumn>
                <TableColumn className="text-end">Miles per critical disengagement</TableColumn>
              </TableHeader>
              <TableBody>
                {TESLA_VERSION_PROGRESS.map((v) => (
                  <TableRow key={v.version} id={v.version}>
                    <TableCell className="text-body-medium text-text-primary">{v.version}</TableCell>
                    <TableCell>{v.date}</TableCell>
                    <TableCell className="text-end tabular-nums">{fullMiles(v.milesPerIntervention)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Disclosure>
        <Callout title="Crowdsourced data skews optimistic and swings">
          Most miles come from enthusiasts driving in favorable conditions (<SourceTag source={SOURCES.teslaTracker} />).
          Single releases swing widely: v14.1 briefly topped 9,000 miles (<SourceTag source={SOURCES.piperSandler} />),
          then v14.2 fell back, with city miles dropping from 4,109 to 809 (<SourceTag source={SOURCES.benzingaGlj} />).
          No stable average for v14.3 has been published. Independent testing found just 13 miles between
          interventions on v12.5 (<SourceTag source={SOURCES.electrekAmci} />).
        </Callout>
      </Section>

      <Section
        eyebrow="Same software, different rules"
        title="Supervised FSD vs. Robotaxi"
        subtitle="Two products with two safety records. One needs a driver; the other has none."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FactSheet title="FSD Supervised" rows={TESLA_FSD_SUPERVISED} />
          <FactSheet title="Robotaxi (no driver)" rows={TESLA_ROBOTAXI} />
        </div>
        <Callout>
          The ~57K-mile crash rate covers the period with a safety monitor aboard; Tesla has not published
          crash counts for its unsupervised miles. Remote operators have caused at least three robotaxi crashes
          (<SourceTag source={SOURCES.electrekHouston} />). Tesla's own FSD figure counts "major" collisions
          only, a narrower bar than police-reported crashes (<SourceTag source={SOURCES.teslaFsdSafety} />).
          Tesla fully redacted robotaxi crash details from NHTSA filings until May 2026; narratives are now
          public (<SourceTag source={SOURCES.electrekUnredact} />). Tesla's quarterly Vehicle Safety Reports
          count only high-severity events, mostly on highways (<SourceTag source={SOURCES.teslaSafety} />). The
          IIHS finds little evidence that partial automation improves safety (<SourceTag source={SOURCES.iihs} />).
        </Callout>
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
