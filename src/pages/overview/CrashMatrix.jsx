// Like-for-like table: miles between events for humans, Waymo and Tesla's
// robotaxi, one row per severity. Rows come from CRASH_RATES in data.js.
// Better/worse than humans is a lime or rose BoardUI chip with an arrow,
// so the meaning never rests on color alone.
import { CRASH_RATES, CRASH_RATES_FOOTNOTE } from "../../../data.js";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@/components/base/table/table";
import { Chip } from "@/components/base/badges/chip";
import Card from "../../components/site/Card.jsx";
import SeriesDot from "../../components/site/SeriesDot.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";

const COLUMNS = [
  { key: "human", name: "Human drivers", series: "human" },
  { key: "waymo", name: "Waymo", series: "waymo", flag: "waymoGood" },
  { key: "tesla", name: "Tesla Robotaxi", series: "tesla", flag: "teslaGood" },
];

// Values are strings in data.js ("529K", "~57K", "0 at fault*").
// Plain numbers get a "mi" unit; text values are shown as written.
function Value({ value, good }) {
  const isNumber = value !== "—" && !/[a-z]/.test(value);
  // ms-1 rather than a leading space: inside a chip (a flex box) a leading space is dropped.
  const text = <>{value}{isNumber && <span className="ms-1 opacity-60">mi</span>}</>;
  if (good === true) return <Chip color="lime"><span aria-label="better than human drivers">▲ </span>{text}</Chip>;
  if (good === false) return <Chip color="rose"><span aria-label="worse than human drivers">▼ </span>{text}</Chip>;
  return <span className="text-body-medium text-text-primary">{text}</span>;
}

export default function CrashMatrix() {
  return (
    <div className="flex flex-col gap-3">
      <Card inner className="overflow-hidden">
        <Table aria-label="Miles between events, by severity">
          <TableHeader>
            <TableColumn isRowHeader>Event</TableColumn>
            {COLUMNS.map((c) => (
              <TableColumn key={c.key} className="text-end">
                <span className="inline-flex items-center gap-1.5"><SeriesDot series={c.series} />{c.name}</span>
              </TableColumn>
            ))}
            <TableColumn>Source</TableColumn>
          </TableHeader>
          <TableBody>
            {CRASH_RATES.map((r) => (
              <TableRow key={r.metric} id={r.metric}>
                <TableCell className="text-body-medium text-text-primary">{r.metric}</TableCell>
                {COLUMNS.map((c) => (
                  <TableCell key={c.key} className="text-end tabular-nums">
                    <Value value={r[c.key]} good={c.flag ? r[c.flag] : null} />
                  </TableCell>
                ))}
                <TableCell><SourceTag source={r.source} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <p className="max-w-[80ch] text-body-2-regular text-text-tertiary">
        {CRASH_RATES_FOOTNOTE.text} <SourceTag source={CRASH_RATES_FOOTNOTE.source} />
      </p>
    </div>
  );
}
