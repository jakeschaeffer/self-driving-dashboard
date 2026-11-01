// The small colored dot that marks Tesla, Waymo or human drivers everywhere.
import { cx } from "@/utils/cx";

const COLORS = {
  tesla: "bg-series-tesla",
  waymo: "bg-series-waymo",
  human: "bg-series-human",
};

export default function SeriesDot({ series, className }) {
  if (!COLORS[series]) return null;
  return <span aria-hidden className={cx("inline-block size-2 shrink-0 rounded-full", COLORS[series], className)} />;
}
