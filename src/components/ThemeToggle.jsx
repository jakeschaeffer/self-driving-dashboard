// Day/night switch. The icon shows the mode you'll switch TO.
import { useTheme } from "../lib/hooks.js";
import s from "./ThemeToggle.module.css";

const Sun = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </g>
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" />
  </svg>
);

export default function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const next = theme === "dark" ? "day" : "night";
  return (
    <button type="button" className={s.toggle} onClick={toggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
