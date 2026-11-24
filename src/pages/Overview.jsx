// Overview — headline stats, the hero ladder, and the AV-vs-human crash table.
import { NINES_SCALE_DATA, HOME_STATS, CRASH_RATES, SOURCES } from "../../data.js";
import { VIZ, CARD, LABEL, NUM, useNarrow, Src, SourceLine, Note, StatCards, Section } from "../ui.jsx";
import SafetyLadder from "../charts/SafetyLadder.jsx";

// Each source cited once, in ladder order.
const uniqueSources = (rows) => [...new Map(rows.map((r) => [r.source.url, r.source])).values()];

const Sources = ({ rows }) => (
  <SourceLine>
    Sources:{" "}
    {uniqueSources(rows).map((s, i) => (
      <span key={s.url}>{i > 0 && " · "}<Src href={s.url}>{s.label}</Src></span>
    ))}
  </SourceLine>
);

const COLUMNS = [
  { key: "human", label: "Human", color: VIZ.secondary },
  { key: "waymo", label: "Waymo", color: VIZ.text },
  { key: "tesla", label: "Tesla", color: VIZ.text },
];

// Desktop: a four-column grid. Phone: one block per event with the three
// values side by side and their labels underneath, so nothing scrolls sideways.
function CrashTable() {
  const narrow = useNarrow();
  const divider = "1px solid rgba(255,255,255,0.04)";

  if (narrow) {
    return (
      <div style={{ ...CARD, padding: "4px 16px" }}>
        {CRASH_RATES.map((r) => (
          <div key={r.metric} style={{ padding: "12px 0", borderBottom: divider, display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: VIZ.text }}>{r.metric}</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
              {COLUMNS.map((c) => (
                <div key={c.key} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: c.color, ...NUM }}>
                    {/* The long "0 in 3.1M mi" form doesn't fit a third of a phone. */}
                    {r[c.key].replace("0 in 3.1M mi†", "0†").replace("0 fatalities*", "0 deaths*")}
                  </span>
                  <span style={{ fontSize: "11px", color: VIZ.muted }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const grid = { display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) repeat(3, minmax(0, 1fr))", gap: "12px" };
  return (
    <div style={{ ...CARD, padding: "6px 20px" }}>
      <div style={{ ...grid, ...LABEL, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>Event</div>
        {COLUMNS.map((c) => <div key={c.key} style={{ textAlign: "right" }}>{c.label}</div>)}
      </div>
      {CRASH_RATES.map((r) => (
        <div key={r.metric} style={{ ...grid, padding: "11px 0", borderBottom: divider, fontSize: "13px", alignItems: "center" }}>
          <div style={{ color: "#cbd5e1" }}>{r.metric}</div>
          {COLUMNS.map((c) => <div key={c.key} style={{ textAlign: "right", color: c.color, ...NUM }}>{r[c.key]}</div>)}
        </div>
      ))}
    </div>
  );
}

export default function Overview() {
  const narrow = useNarrow();
  return (
    <div>
      <StatCards stats={HOME_STATS} />

      <Section
        title="Miles between safety events"
        subtitle={narrow ? "Log scale — each step right is 10× safer." : "Tesla, Waymo and human drivers. Log scale — each step right is 10× safer."}
      >
        <SafetyLadder rows={NINES_SCALE_DATA} />
        <SourceLine>
          Critical takeovers are counted as crash-equivalent: each is a crash the driver had to prevent.
          Robotaxi: every NHTSA-reportable crash, Jan–Oct 2026, from Tesla’s Robotaxi Safety Report.
        </SourceLine>
        <Sources rows={NINES_SCALE_DATA} />
      </Section>

      <Section title="Crash rates vs. human drivers" subtitle="Miles between events — higher is safer.">
        <CrashTable />
        <SourceLine>
          * Zero fatalities in 220M+ driverless miles. Tesla: Robotaxi Safety Report, Jan–Oct 2026 (Model Y and Cybercab,
          no safety monitor); crash figure counts every NHTSA-reportable crash.
          † {narrow && "0 in 3.1M mi: "}No events yet, too few miles for a rate; injuries counted only where the robotaxi made first contact.
        </SourceLine>
        <Sources rows={[...CRASH_RATES, { source: SOURCES.teslaRobotaxiSafety }]} />
        <Note>
          Human crash data underreports minor incidents by ~60% (<Src href={SOURCES.nhtsa.url}>NHTSA</Src>),
          while AVs report virtually every contact event.
        </Note>
      </Section>
    </div>
  );
}
