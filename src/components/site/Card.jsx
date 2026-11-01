// The BoardUI card surface: a soft gray panel with large rounded corners.
// `inner` is the white tile BoardUI nests inside a card (see its stat cards).
import { cx } from "@/utils/cx";

export default function Card({ as: Tag = "div", inner = false, className, children, ...props }) {
  return (
    <Tag
      className={cx(
        inner
          ? "rounded-2lg bg-background-inner-default shadow-card"
          : "rounded-2xl bg-background-secondary-default",
        "min-w-0",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
