// A BoardUI chip for status words ("driverless", "blocked", "Serious").
// `tone` maps to BoardUI's status colors; the text always states the status,
// so color is never the only signal.
import { Chip } from "@/components/base/badges/chip";

const TONE_COLOR = { good: "lime", warn: "yellow", bad: "rose", neutral: "neutral", info: "blue" };

export default function StatusChip({ tone = "neutral", children, className }) {
  return (
    <Chip variant="bold" color={TONE_COLOR[tone] ?? "neutral"} className={className}>
      {children}
    </Chip>
  );
}
