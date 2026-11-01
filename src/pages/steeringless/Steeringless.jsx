// Road to Steeringless — the safety bar to clear, the legal blockers, and when
// experts expect each step.
import {
  TARGET_THRESHOLDS, REGULATORY_BARRIERS, EXPERT_TIMELINES, CHILD_SAFETY, HUMAN_BENCHMARKS,
} from "../../../data.js";
import { compactMiles, formatTimes } from "../../lib/format.js";
import { Chip } from "@/components/base/badges/chip";
import Section from "../../components/site/Section.jsx";
import StatusChip from "../../components/site/StatusChip.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import Card from "../../components/site/Card.jsx";

const AVG_MILES_PER_YEAR = 14000; // typical US driver

// How often one typical driver would crash at a given rate: "once every 38 yrs".
function perDriver(miles) {
  const years = miles / AVG_MILES_PER_YEAR;
  return years >= 100 ? `once every ${Math.round(years / 10) * 10} yrs` : `once every ${Math.round(years)} yrs`;
}

const BARRIER_TONE = { achieved: "good", partial: "warn", blocked: "bad" };
const BARRIER_ORDER = ["blocked", "partial", "achieved"];
// Expert-timeline tones from data.js → BoardUI chip colors.
const TIMELINE_TONE = { good: "good", neutral: "info", caution: "warn", far: "neutral" };

export default function Steeringless() {
  const human = HUMAN_BENCHMARKS.crash.miles;
  const barriers = [...REGULATORY_BARRIERS].sort(
    (a, b) => BARRIER_ORDER.indexOf(a.status) - BARRIER_ORDER.indexOf(b.status)
  );

  return (
    <>
      <Section
        eyebrow="Miles per crash · no regulator has set a number"
        title="How safe is safe enough?"
        subtitle="Four steps on the way to removing the wheel, inferred from expert commentary. Each is a crash rate the system would have to reach."
      >
        <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TARGET_THRESHOLDS.map((t, i) => (
            <Card as="li" key={t.label} className="flex flex-col p-2">
              <div className="flex flex-col gap-0.5 px-2 pt-2 pb-3.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-body-medium text-text-secondary">{t.label}</span>
                  <Chip variant="caption" color="soft">Step {i + 1}</Chip>
                </span>
                <span className="text-display-4-medium text-text-primary tabular-nums">{compactMiles(t.miles)} mi</span>
                <span className="text-body-2-medium text-text-tertiary">
                  {i === 0 ? "the human average" : `${formatTimes(t.miles / human)} the human rate`}
                </span>
              </div>
              <Card inner className="mt-auto px-3 py-2.5 text-body-2-regular text-text-secondary">
                {t.description}. For one driver, a crash {perDriver(t.miles)}.
              </Card>
            </Card>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="The gap is legal as well as technical"
        title="Regulatory barriers"
        subtitle="What has to change in federal rules before a car without a steering wheel can be sold at scale."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {barriers.map((b) => (
            <Card as="li" key={b.title} className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-headline-semibold text-text-primary">{b.title}</h3>
                <StatusChip tone={BARRIER_TONE[b.status]} className="capitalize">{b.status}</StatusChip>
              </div>
              <p className="flex-1 text-body-2-regular text-text-secondary">{b.detail}</p>
              <SourceTag source={b.source} />
            </Card>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Forecasts from McKinsey, S&P Global, WEF and BCG"
        title="When experts expect it"
        subtitle="From robotaxis in a few cities today to the long tail of safety benefits."
      >
        <Card className="p-2">
          <Card as="ol" inner className="flex flex-col divide-y divide-separator-border">
            {EXPERT_TIMELINES.map((e) => (
              <li key={e.event} className="grid gap-x-4 gap-y-1.5 px-4 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-baseline">
                <span className="text-headline-semibold text-text-primary tabular-nums">{e.year}</span>
                <div className="flex flex-col gap-1.5">
                  <p className="text-body-medium text-text-primary">{e.event}</p>
                  <p className="flex flex-wrap items-center gap-2">
                    <StatusChip tone={TIMELINE_TONE[e.tone]}>{e.status}</StatusChip>
                    <SourceTag source={e.source} />
                  </p>
                </div>
              </li>
            ))}
          </Card>
        </Card>
      </Section>

      <Section
        eyebrow="The hardest passenger"
        title="Would you send your child alone?"
        subtitle="Parents are far more willing to ride with automation than to hand it their kids."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col gap-4 p-4">
            {[
              { pct: CHILD_SAFETY.parentsComfortableDriving, label: "of parents are comfortable driving with autonomous features" },
              { pct: CHILD_SAFETY.parentsLetChildRideAlone, label: "would let their child ride alone" },
            ].map((d) => (
              <div key={d.label} className="flex flex-col gap-1.5">
                <span className="flex items-baseline gap-2">
                  <span className="text-title-1-medium text-text-primary tabular-nums">{d.pct}</span>
                  <span className="text-body-2-regular text-text-secondary">{d.label}</span>
                </span>
                <span className="h-2.5 overflow-hidden rounded-full bg-chart-track" aria-hidden>
                  <span className="block h-full rounded-full bg-accent-500" style={{ width: `${parseFloat(d.pct)}%` }} />
                </span>
              </div>
            ))}
            <SourceTag source={CHILD_SAFETY.source} />
          </Card>
          <p className="self-center text-body-regular text-text-secondary">
            The implied bar, {CHILD_SAFETY.impliedCrashThreshold}, also needs things that don't exist yet: remote
            monitoring, secure interiors, emergency communication, verified pickup and drop-off, and medical
            response. Waymo already clears that bar for serious-injury crashes ({CHILD_SAFETY.waymoSeriousInjuryRate})
            but not for crashes of any kind ({CHILD_SAFETY.waymoCrashRate}). The rest is unbuilt.
          </p>
        </div>
      </Section>
    </>
  );
}
