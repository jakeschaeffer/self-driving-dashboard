// Number formatting and the comparison math every page shares.
// Pure functions: no React, no DOM — easy to test and reuse.

const trim = (x, digits) => x.toFixed(digits).replace(/\.0$/, "");

// 13 → "13" · 1454 → "1.5K" · 57000 → "57K" · 1350000 → "1.4M" · 50000000 → "50M"
export function compactMiles(n) {
  if (n >= 1e6) return trim(n / 1e6, n >= 1e7 ? 0 : 1) + "M";
  if (n >= 1e3) return trim(n / 1e3, n >= 1e4 ? 0 : 1) + "K";
  return String(Math.round(n));
}

// 1454 → "1,454"
export const fullMiles = (n) => Math.round(n).toLocaleString("en-US");

// Round to two significant figures so we never print false precision
// like "39,811×" when the inputs are rough estimates.
export function roundSig(x, digits = 2) {
  if (x === 0) return 0;
  const p = Math.pow(10, digits - Math.ceil(Math.log10(Math.abs(x))));
  return Math.round(x * p) / p;
}

// 2.47 → "2.5×" · 316 → "320×" · 39811 → "40,000×"
export function formatTimes(ratio) {
  const r = roundSig(ratio);
  return (r < 10 ? r.toFixed(1) : r.toLocaleString("en-US")) + "×";
}

// How far a system is from a benchmark, in "miles between events".
// More miles between events = safer, so a ratio above 1 means past the benchmark.
// Returns { dir, text }: dir is 1 (past it), -1 (short of it) or 0 (level).
export function versus(miles, benchmarkMiles) {
  const ratio = miles / benchmarkMiles;
  if (ratio > 0.9 && ratio < 1.1) return { dir: 0, text: "Level" };
  if (ratio > 1) return { dir: 1, text: formatTimes(ratio) + " better" };
  return { dir: -1, text: formatTimes(1 / ratio) + " short" };
}

// "2025-11" → 2025.875 (the middle of November), for time axes.
export function yearFraction(yyyyMm) {
  const [y, m = "6"] = String(yyyyMm).split("-");
  return Number(y) + (Number(m) - 0.5) / 12;
}
