// The hero ladder: miles between safety events on a log scale, one row per
// system, with the human crash rate as a reference rule through every row.
//
// Desktop: name | bar | "vs Human" in three columns, tick labels in the header.
// Phone (<720px): name and "vs Human" on one line, full-width bar below it.
//
// rows: NINES_SCALE_DATA from data.js — { miles, label, sublabel, event, category }
import { VIZ, CARD, LABEL, NUM, formatMiles, useNarrow } from "../ui.jsx";
import { Marker, Legend } from "./parts.jsx";

const SCALE_MAX = 8.5;                  // log10 of the right edge (~316M mi)
const HUMAN = Math.log10(529000);       // NHTSA all-crash rate: the reference rule
const pct = (nines) => (nines / SCALE_MAX) * 100;
const HUMAN_LEFT = pct(HUMAN) + "%";

// Row labels keep three significant figures where they matter:
// 1,454 (not "1K") and 1.35M (not "1.4M").
const milesLabel = (n) =>
  n < 10000 ? n.toLocaleString("en-US")
  : n >= 1e6 ? Number((n / 1e6).toPrecision(3)) + "M"
  : formatMiles(n);

// Each family gets a shape and a color (shape is the accessible cue).
export const FAMILY = {
  tesla: { label: "Tesla", shape: "circle", color: VIZ.accent, end: 11 },
  waymo: { label: "Waymo", shape: "square", color: VIZ.waymo, end: 11 },
  human: { label: "Human drivers", shape: "diamond", color: VIZ.human, end: 10 },
};

// "~360× worse", "2.6× safer". Two significant figures: the inputs are rough.
function relToHuman(row) {
  if (row.event === "fatal crash") return { text: "Fatal rate", color: "#cbd5e1" };
  const diff = Math.log10(row.miles) - HUMAN;
  if (Math.abs(diff) < 0.05) return { text: "Match", color: "#cbd5e1" };
  const mul = Math.pow(10, Math.abs(diff));
  const n = mul >= 10 ? "~" + Number(mul.toPrecision(2)).toLocaleString("en-US") : mul.toFixed(1);
  return diff > 0
    ? { text: n + "× safer", color: VIZ.better }
    : { text: n + "× worse", color: VIZ.worse };
}

// One row's bar: track, human rule, filled bar, shape end-marker, and the
// "57K mi / crash" label. The label sits on an opaque backing so the human
// rule never paints through it, and flips to the left of the marker once the
// bar is long enough that it would run off the end.
function Bar({ row, flipAt, gapRight, gapLeft }) {
  const fam = FAMILY[row.category];
  const p = pct(Math.log10(row.miles));
  const flip = p >= flipAt;
  return (
    <div style={{ position: "relative", height: "22px" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "10px", height: "2px", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", left: HUMAN_LEFT, top: "2px", bottom: "2px", width: "1px", background: "rgba(148,163,184,0.5)" }} />
      <div style={{ position: "absolute", left: 0, top: "9px", height: "4px", borderRadius: "2px", width: p + "%", background: fam.color }} />
      <Marker shape={fam.shape} color={fam.color} size={fam.end} ring style={{
        position: "absolute", left: p + "%", top: "11px", transform: "translate(-50%, -50%)",
      }} />
      <span style={{
        position: "absolute", top: 0, bottom: 0, display: "flex", alignItems: "center", gap: "4px",
        ...(flip ? { right: `calc(${100 - p}% + ${gapRight}px)` } : { left: `calc(${p}% + ${gapLeft}px)` }),
        padding: "0 6px", borderRadius: "3px", background: VIZ.surface,
        fontSize: "11px", fontWeight: 700, color: VIZ.text, whiteSpace: "nowrap", ...NUM,
      }}>
        {milesLabel(row.miles)} mi <span style={{ color: VIZ.muted, fontWeight: 500 }}>/ {row.event}</span>
      </span>
    </div>
  );
}

function Name({ row }) {
  const fam = FAMILY[row.category];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
      <span style={{ fontSize: "12px", fontWeight: 600, color: VIZ.text, display: "flex", alignItems: "center", gap: "6px" }}>
        <Marker shape={fam.shape} color={fam.color} />{row.label}
      </span>
      <span style={{ fontSize: "11px", color: VIZ.muted }}>{row.sublabel}</span>
    </div>
  );
}

const Rel = ({ row }) => {
  const rel = relToHuman(row);
  return (
    <div style={{ textAlign: "right", whiteSpace: "nowrap", fontSize: "12px", fontWeight: 700, color: rel.color, ...NUM }}>
      {rel.text}
    </div>
  );
};

export default function SafetyLadder({ rows }) {
  const narrow = useNarrow();
  const sorted = rows.slice().sort((a, b) => b.miles - a.miles);
  const rowBg = (r) => (r.category === "human" ? "rgba(255,255,255,0.02)" : "transparent");
  const cols = narrow ? "minmax(0, 1fr) 112px" : "190px minmax(0, 1fr) 120px";
  const rule = "1px solid rgba(255,255,255,0.03)";

  return (
    <>
      <Legend items={Object.values(FAMILY)} style={{ marginBottom: narrow ? "14px" : "16px" }} />
      <div style={{ ...CARD, padding: narrow ? "14px 16px" : "16px 20px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: cols, gap: narrow ? "12px" : "14px", alignItems: "end",
          paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)", ...LABEL,
        }}>
          <div>System</div>
          {!narrow && (
            <div style={{ position: "relative", height: "34px" }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
                <span key={k} style={{ position: "absolute", bottom: 0, left: pct(k) + "%", transform: "translateX(-50%)", letterSpacing: "0.04em" }}>
                  {formatMiles(10 ** k)}
                </span>
              ))}
              <span style={{ position: "absolute", top: 0, left: HUMAN_LEFT, transform: "translateX(-50%)", fontWeight: 700, color: "#cbd5e1" }}>Human</span>
            </div>
          )}
          <div style={{ textAlign: "right" }}>vs Human</div>
        </div>

        {/* Phone: the header has no room for the scale, so a slim tick row sits under it. */}
        {narrow && (
          <div style={{ position: "relative", height: "18px", marginTop: "8px", fontSize: "11px", color: VIZ.muted }}>
            <span style={{ position: "absolute", left: pct(3) + "%", transform: "translateX(-50%)" }}>1K</span>
            <span style={{ position: "absolute", left: HUMAN_LEFT, transform: "translateX(-50%)", color: "#cbd5e1", fontWeight: 500 }}>human</span>
            <span style={{ position: "absolute", left: pct(8) + "%", transform: "translateX(-50%)" }}>100M</span>
          </div>
        )}

        {sorted.map((r, i) => narrow ? (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: cols, columnGap: "12px", rowGap: "8px",
            alignItems: "center", padding: "10px 0", borderBottom: rule, background: rowBg(r),
          }}>
            <Name row={r} />
            <Rel row={r} />
            <div style={{ gridColumn: "1 / -1" }}><Bar row={r} flipAt={50} gapRight={14} gapLeft={10} /></div>
          </div>
        ) : (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: cols, gap: "14px",
            alignItems: "center", padding: "9px 0", borderBottom: rule, background: rowBg(r),
          }}>
            <Name row={r} />
            <Bar row={r} flipAt={55} gapRight={18} gapLeft={12} />
            <Rel row={r} />
          </div>
        ))}
      </div>
    </>
  );
}
