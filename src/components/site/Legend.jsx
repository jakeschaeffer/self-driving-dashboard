// A row of legend items under a chart: [{ swatch: <node>, label }].
export default function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-body-2-medium text-text-secondary">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          {it.swatch}
          {it.label}
        </li>
      ))}
    </ul>
  );
}
