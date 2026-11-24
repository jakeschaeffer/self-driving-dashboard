// A-vs-B rate cards, one per severity level: two numbers labelled underneath
// and the reduction. Both numbers are white; the labels (not colors) say
// which is which. 3 columns on desktop, 2 on phones.
//
// items: [{ category, short?, waymo, human, reduction }]
//   short: optional shorter category name for phones.
import { VIZ, CARD, LABEL, NUM, useNarrow } from "../ui.jsx";

export default function SeverityCards({ items, aName = "Waymo", bName = "Human" }) {
  const narrow = useNarrow();
  const value = { fontSize: narrow ? "17px" : "20px", fontWeight: 600, color: VIZ.text, ...NUM };
  const name = { fontSize: "11px", color: VIZ.muted };
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${narrow ? 2 : 3}, minmax(0, 1fr))`, gap: narrow ? "8px" : "10px" }}>
      {items.map((d) => (
        <div key={d.category} style={{ ...CARD, padding: narrow ? "12px 14px" : "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* min-height keeps the numbers aligned when a name wraps to two lines */}
          <span style={{ ...LABEL, minHeight: narrow ? "30px" : undefined }}>{narrow && d.short ? d.short : d.category}</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: narrow ? "8px" : "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span style={value}>{d.waymo}</span><span style={name}>{aName}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}><span style={value}>{d.human}</span><span style={name}>{bName}</span></div>
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: VIZ.better, ...NUM }}>↓ {d.reduction}% fewer</span>
        </div>
      ))}
    </div>
  );
}
