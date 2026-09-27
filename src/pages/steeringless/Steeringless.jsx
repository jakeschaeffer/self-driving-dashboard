// Road to Steeringless — the safety bar to clear, the legal blockers, and when
// experts expect each step.
import {
  TARGET_THRESHOLDS, REGULATORY_BARRIERS, EXPERT_TIMELINES, CHILD_SAFETY, HUMAN_BENCHMARKS,
} from "../../../data.js";
import { compactMiles, formatTimes } from "../../lib/format.js";
import Section from "../../components/Section.jsx";
import Pill from "../../components/Pill.jsx";
import SourceTag from "../../components/SourceTag.jsx";
import s from "./Steeringless.module.css";

const AVG_MILES_PER_YEAR = 14000; // typical US driver

// How often one typical driver would crash at a given rate: "once every 38 yrs".
function perDriver(miles) {
  const years = miles / AVG_MILES_PER_YEAR;
  return years >= 100 ? `once every ${Math.round(years / 10) * 10} yrs` : `once every ${Math.round(years)} yrs`;
}

const BARRIER_TONE = { achieved: "good", partial: "warn", blocked: "bad" };
const BARRIER_ORDER = ["blocked", "partial", "achieved"];

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
        subtitle="Four exits on the way to removing the wheel, inferred from expert commentary. Each is a crash rate the system would have to reach."
      >
        <ol className={s.exits}>
          {TARGET_THRESHOLDS.map((t, i) => (
            <li key={t.label} className={s.exit}>
              <div className={s.sign}>
                <span className={s.exitTab}>Exit {i + 1}</span>
                <span className={s.signLabel}>{t.label}</span>
                <span className={s.signMiles}>{compactMiles(t.miles)} mi</span>
                <span className={s.signSub}>
                  {i === 0 ? "the human average" : `${formatTimes(t.miles / human)} the human rate`}
                </span>
              </div>
              <p className={s.exitText}>{t.description}. For one driver, a crash {perDriver(t.miles)}.</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="The gap is legal as well as technical"
        title="Regulatory barriers"
        subtitle="What has to change in federal rules before a car without a steering wheel can be sold at scale."
      >
        <ul className={s.barriers}>
          {barriers.map((b) => (
            <li key={b.title} className={s.barrier}>
              <div className={s.barrierHead}>
                <h3 className={s.barrierTitle}>{b.title}</h3>
                <Pill tone={BARRIER_TONE[b.status]}>{b.status}</Pill>
              </div>
              <p className={s.barrierText}>{b.detail}</p>
              <SourceTag source={b.source} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Forecasts from McKinsey, S&P Global, WEF and BCG"
        title="When experts expect it"
        subtitle="From robotaxis in a few cities today to the long tail of safety benefits."
      >
        <ol className={s.timeline}>
          {EXPERT_TIMELINES.map((e) => (
            <li key={e.event} className={s.stop} data-tone={e.tone}>
              <span className={s.year}>{e.year}</span>
              <div className={s.stopBody}>
                <p className={s.stopEvent}>{e.event}</p>
                <p className={s.stopMeta}>
                  <span className={s.status} data-tone={e.tone}>{e.status}</span>
                  <SourceTag source={e.source} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="The hardest passenger"
        title="Would you send your child alone?"
        subtitle="Parents are far more willing to ride with automation than to hand it their kids."
      >
        <div className={s.child}>
          <div className={s.compare}>
            {[
              { pct: CHILD_SAFETY.parentsComfortableDriving, label: "of parents are comfortable driving with autonomous features" },
              { pct: CHILD_SAFETY.parentsLetChildRideAlone, label: "would let their child ride alone" },
            ].map((d) => (
              <div key={d.label} className={s.bar}>
                <span className={s.pct}>{d.pct}</span>
                <span className={s.track}><span className={s.fill} style={{ "--w": parseFloat(d.pct) }} /></span>
                <span className={s.barLabel}>{d.label}</span>
              </div>
            ))}
            <SourceTag source={CHILD_SAFETY.source} />
          </div>
          <p className={s.childText}>
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
