// Like-for-like comparison against human drivers.
// Each event type in data.js names the human benchmark it should be measured
// against (injury crashes vs. human injury crashes, and so on).
import { EVENT_TYPES, HUMAN_BENCHMARKS } from "../../data.js";
import { versus } from "./format.js";

// Returns null for human rows (they ARE the benchmark). Otherwise
// { dir, text, benchmark, benchmarkLabel, approx }, where approx is true when
// no true human equivalent exists (disengagements vs. crashes).
export function compareToHuman(point) {
  if (point.category === "human") return null;
  const type = EVENT_TYPES[point.event];
  const benchmark = HUMAN_BENCHMARKS[type.human];
  return {
    ...versus(point.miles, benchmark.miles),
    benchmark,
    benchmarkLabel: EVENT_TYPES[type.human].label,
    approx: Boolean(type.approx),
  };
}
