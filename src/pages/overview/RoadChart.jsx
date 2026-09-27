// The hero chart: every safety data point on one log-scale road, one lane per
// category. Distance along the road = miles driven between events, so farther
// right (or higher, on phones) is safer. Mile-marker signs mark each 10× step.
//
// Layout is pure CSS (RoadChart.module.css). This file only works out WHERE
// things go and passes it down as CSS variables: --pos is 0–100 along the road.
import { useState } from "react";
import { EVENT_TYPES, HUMAN_BENCHMARKS } from "../../../data.js";
import { compactMiles, fullMiles } from "../../lib/format.js";
import { compareToHuman } from "../../lib/compare.js";
import SourceTag from "../../components/SourceTag.jsx";
import s from "./RoadChart.module.css";

const LANES = [
  { id: "tesla", name: "Tesla" },
  { id: "waymo", name: "Waymo" },
  { id: "human", name: "Human drivers" },
];

// The road runs from 10^0.7 (5 mi) to 10^8.3 (200M mi).
const MIN_EXP = 0.7;
const MAX_EXP = 8.3;
const MILE_MARKERS = [10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8];
const roadPos = (miles) => ((Math.log10(miles) - MIN_EXP) / (MAX_EXP - MIN_EXP)) * 100;

// Labels sit above or below their marker. When two markers in a lane are
// close, the later label flips to the other side so the two don't collide.
const LABEL_GAP = 0.8; // minimum distance, in powers of ten, to share a side
function placeLabels(points) {
  let lastAbove = -Infinity;
  let lastBelow = -Infinity;
  return [...points]
    .sort((a, b) => a.miles - b.miles)
    .map((p) => {
      const e = Math.log10(p.miles);
      const side = e - lastAbove >= LABEL_GAP || e - lastAbove >= e - lastBelow ? "above" : "below";
      if (side === "above") lastAbove = e;
      else lastBelow = e;
      const pos = roadPos(p.miles);
      // Near either end of the road, align the label inward so it isn't cut off.
      const edge = pos < 8 ? "start" : pos > 92 ? "end" : undefined;
      return { ...p, side, pos, edge };
    });
}

function Readout({ point }) {
  if (!point) {
    return (
      <div className={s.readout}>
        <p className={s.hint}>Farther along the road = more miles between events = safer.</p>
        <p className={s.hintSub}>Hover or tap any marker for its numbers and source.</p>
      </div>
    );
  }
  const cmp = compareToHuman(point);
  return (
    <div className={s.readout} aria-live="polite">
      <p className={s.rTitle}>
        <span className={s.key} data-lane={point.category} aria-hidden="true" />
        {point.label} <span className={s.rSub}>· {point.sublabel}</span>
      </p>
      <p className={s.rValue}>
        {fullMiles(point.miles)} mi <span className={s.rPer}>per {EVENT_TYPES[point.event].label}</span>
      </p>
      <p className={s.rFoot}>
        {cmp ? (
          <span className={s.rCmp} data-dir={cmp.dir}>
            {cmp.text} than the human {cmp.benchmarkLabel} rate{cmp.approx && " (no exact human equivalent)"}
          </span>
        ) : (
          <span className={s.rCmp}>Human benchmark</span>
        )}
        <SourceTag source={point.source} />
      </p>
    </div>
  );
}

export default function RoadChart({ points }) {
  const [activeId, setActiveId] = useState(null);
  const active = points.find((p) => p.id === activeId);
  const baseline = HUMAN_BENCHMARKS.crash;
  let order = 0; // staggers the "drive in" animation across all markers

  return (
    <figure className={s.figure}>
      <div className={s.road}>
        <Readout point={active} />

        <div className={s.body}>
          <div className={s.lanes}>
            <div className={s.carriageway}>
              {LANES.map((lane) => (
                <div key={lane.id} className={s.lane} data-lane={lane.id}>
                  <div className={s.laneName}>
                    <span className={s.key} data-lane={lane.id} aria-hidden="true" />
                    {lane.name}
                  </div>
                  <div className={s.track}>
                    {placeLabels(points.filter((p) => p.category === lane.id)).map((p) => (
                      <div
                        key={p.id}
                        className={s.point}
                        data-side={p.side}
                        data-edge={p.edge}
                        data-active={p.id === activeId || undefined}
                        style={{ "--pos": p.pos, "--i": order++ }}
                      >
                        <button
                          type="button"
                          className={s.marker}
                          data-hollow={p.event === "disengagement" || undefined}
                          aria-label={`${p.label}, ${p.sublabel}: ${fullMiles(p.miles)} miles per ${EVENT_TYPES[p.event].label}`}
                          onMouseEnter={() => setActiveId(p.id)}
                          onFocus={() => setActiveId(p.id)}
                          onClick={() => setActiveId(p.id)}
                        />
                        <span className={s.label} aria-hidden="true">
                          <span className={s.short}>{p.short}</span>
                          <span className={s.miles}>{compactMiles(p.miles)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Decorations drawn over the lanes: joints at each 10× step and the human line. */}
            <div className={s.overlay} aria-hidden="true">
              {MILE_MARKERS.map((m) => (
                <span key={m} className={s.joint} style={{ "--pos": roadPos(m) }} />
              ))}
              <span className={s.humanLine} style={{ "--pos": roadPos(baseline.miles) }}>
                <span className={s.humanTag}>Human crash rate</span>
              </span>
            </div>
          </div>

          <div className={s.axis} aria-hidden="true">
            <span className={s.axisTitle}>Miles per event</span>
            {MILE_MARKERS.map((m) => (
              <span key={m} className={s.post} style={{ "--pos": roadPos(m) }}>{compactMiles(m)}</span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className={s.legend}>
        <span className={s.lgItem}><i className={s.lgFilled} /> Crash, injury or fatality</span>
        <span className={s.lgItem}><i className={s.lgHollow} /> Critical disengagement (a human had to take over)</span>
        <span className={s.lgItem}><i className={s.lgLine} /> Human crash rate, {compactMiles(baseline.miles)} mi</span>
        <span className={s.lgItem}>Log scale: each mile marker is 10× the one before.</span>
      </figcaption>
    </figure>
  );
}
