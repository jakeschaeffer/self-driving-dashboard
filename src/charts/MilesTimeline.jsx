// Cumulative miles over time.
//
// Desktop: columns placed on a true time axis, so the uneven gaps between
// readings (yearly, then every ~6 months) show as uneven spacing instead of
// looking like steady yearly steps.
// Phone (<720px): horizontal bars, one row per reading — columns would be
// too thin to label at that width.
//
// data: [{ period: "Sep 2025", miles: 127, t: 2025.7 }]   (miles in millions;
//       t = decimal year the reading is "as of")
import { VIZ, CARD, NUM, useNarrow } from "../ui.jsx";

export default function MilesTimeline({ data, color = VIZ.waymo }) {
  const narrow = useNarrow();
  const max = Math.max(...data.map((d) => d.miles));
  const isLast = (i) => i === data.length - 1;
  // Older readings are a tint; the latest is solid and its label is white.
  const fill = (i) => (isLast(i) ? color : color + "55");

  if (narrow) {
    return (
      <div style={{ ...CARD, padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((d, i) => (
          <div key={d.period} style={{ display: "grid", gridTemplateColumns: "68px minmax(0, 1fr) 44px", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: VIZ.muted, whiteSpace: "nowrap" }}>{d.period}</span>
            <div style={{ height: "14px", width: Math.max((d.miles / max) * 100, 1.5) + "%", borderRadius: "0 4px 4px 0", background: fill(i) }} />
            <span style={{ textAlign: "right", fontSize: "12px", fontWeight: 600, color: isLast(i) ? VIZ.text : VIZ.secondary, ...NUM }}>{d.miles}M</span>
          </div>
        ))}
      </div>
    );
  }

  // Pad the axis by half a step on each side so the end columns aren't clipped.
  const t0 = data[0].t - 0.4, t1 = data[data.length - 1].t + 0.4;
  const left = (t) => ((t - t0) / (t1 - t0)) * 100 + "%";
  const column = { position: "absolute", transform: "translateX(-50%)" };
  return (
    <div style={{ ...CARD, padding: "20px 20px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ position: "relative", height: "180px" }}>
        {data.map((d, i) => (
          <div key={d.period} style={{
            ...column, bottom: 0, left: left(d.t), width: "64px", height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "6px",
          }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: isLast(i) ? VIZ.text : VIZ.muted, ...NUM }}>{d.miles}M</span>
            <div style={{ width: "100%", maxWidth: "40px", height: Math.max((d.miles / max) * 150, 3) + "px", borderRadius: "4px 4px 0 0", background: fill(i) }} />
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: "26px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        {data.map((d) => (
          <span key={d.period} style={{ ...column, top: "8px", left: left(d.t), whiteSpace: "nowrap", fontSize: "11px", color: VIZ.muted, ...NUM }}>
            {d.period}
          </span>
        ))}
      </div>
    </div>
  );
}
