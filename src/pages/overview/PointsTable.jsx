// Every point on the chart as a plain table, folded away under it.
// Charts need a text alternative: this is it, and it is where sources live.
// Uses BoardUI's Table, which is React Aria's accessible table underneath.
import { EVENT_TYPES } from "../../../data.js";
import { fullMiles } from "../../lib/format.js";
import { compareToHuman } from "../../lib/compare.js";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@/components/base/table/table";
import { Chip } from "@/components/base/badges/chip";
import Card from "../../components/site/Card.jsx";
import SeriesDot from "../../components/site/SeriesDot.jsx";
import SourceTag from "../../components/site/SourceTag.jsx";
import Disclosure from "../../components/site/Disclosure.jsx";

const LANE_ORDER = { tesla: 0, waymo: 1, human: 2 };

export default function PointsTable({ points }) {
  const rows = [...points].sort(
    (a, b) => LANE_ORDER[a.category] - LANE_ORDER[b.category] || b.miles - a.miles
  );
  return (
    <Disclosure summary={`Show all ${rows.length} data points as a table`}>
      <Card inner className="overflow-hidden">
        <Table aria-label="Every data point on the chart" size="sm">
          <TableHeader>
            <TableColumn isRowHeader>System</TableColumn>
            <TableColumn>What is counted</TableColumn>
            <TableColumn className="text-end">Miles per event</TableColumn>
            <TableColumn>Compared with human drivers</TableColumn>
            <TableColumn>Source</TableColumn>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const cmp = compareToHuman(p);
              return (
                <TableRow key={p.id} id={p.id}>
                  <TableCell>
                    <span className="flex items-center gap-2 text-body-medium text-text-primary">
                      <SeriesDot series={p.category} />{p.label}
                    </span>
                    <span className="block ps-4 text-body-2-regular text-text-tertiary">{p.sublabel}</span>
                  </TableCell>
                  <TableCell>{EVENT_TYPES[p.event].label}</TableCell>
                  <TableCell className="text-end tabular-nums">{fullMiles(p.miles)}</TableCell>
                  <TableCell>
                    {cmp ? (
                      <span className="flex flex-wrap items-center gap-2">
                        <Chip color={cmp.dir > 0 ? "lime" : cmp.dir < 0 ? "rose" : "neutral"}>{cmp.text}</Chip>
                        <span className="text-body-2-regular text-text-tertiary">
                          vs. {cmp.benchmarkLabel} rate{cmp.approx ? " (approx.)" : ""}
                        </span>
                      </span>
                    ) : (
                      <Chip color="soft">Benchmark</Chip>
                    )}
                  </TableCell>
                  <TableCell><SourceTag source={p.source} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </Disclosure>
  );
}
