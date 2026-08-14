// Other Players — everyone beyond Waymo and Tesla, one row per company.
import { OTHERS_STATS, OTHER_PLAYERS, SOURCES } from "../../data.js";
import { MONO, CARD, useNarrow, Src, Note, StatCards, Section } from "../ui.jsx";

const STATUS_CHIPS = {
  driverless: { bg: "rgba(34,197,94,0.12)", fg: "#22c55e", label: "driverless" },
  supervised: { bg: "rgba(251,191,35,0.12)", fg: "#fbbf24", label: "supervised" },
  testing:    { bg: "rgba(96,165,250,0.12)", fg: "#60a5fa", label: "testing" },
  dead:       { bg: "rgba(148,163,184,0.10)", fg: "#64748b", label: "shut down" },
};

export default function Others() {
  const narrow = useNarrow();
  return (
    <div>
      <StatCards stats={OTHERS_STATS} />

      <Section title="Who else is on the road" subtitle="Status and scale as of Aug 2026, using each company's own disclosed metric.">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {OTHER_PLAYERS.map((p, i) => {
            const chip = STATUS_CHIPS[p.status];
            return (
              <div key={i} style={{
                ...CARD, borderRadius: "6px", padding: "12px 16px",
                display: "grid",
                gridTemplateColumns: narrow ? "1fr auto" : "170px 1fr 110px auto",
                columnGap: "14px", rowGap: "4px", alignItems: "center",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: p.status === "dead" ? "#64748b" : "#e2e8f0" }}>
                  {p.company}
                </div>
                <div style={{
                  justifySelf: "end", order: narrow ? 0 : 3,
                  fontSize: "8px", padding: "2px 7px", borderRadius: "10px",
                  textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em",
                  background: chip.bg, color: chip.fg, whiteSpace: "nowrap",
                }}>{chip.label}</div>
                <div style={{ gridColumn: narrow ? "1 / -1" : "auto", fontSize: "11px", color: "#64748b", lineHeight: 1.5 }}>
                  {p.detail} <Src href={p.source.url}>{p.source.label}</Src>
                </div>
                <div style={{
                  gridColumn: narrow ? "1 / -1" : "auto",
                  fontSize: "12px", fontWeight: 700, fontFamily: MONO,
                  color: p.status === "dead" ? "#4b5563" : chip.fg,
                  textAlign: narrow ? "left" : "right", whiteSpace: "nowrap",
                }}>{p.scale}</div>
              </div>
            );
          })}
        </div>
        <Note>
          Scale figures are each company's own disclosure — rides, fleet size, and miles are not comparable across companies.
          NHTSA's <Src href={SOURCES.nhtsaSgo.url}>Standing General Order</Src> is the only neutral cross-company incident feed, but it has no mileage denominators.
        </Note>
      </Section>
    </div>
  );
}
