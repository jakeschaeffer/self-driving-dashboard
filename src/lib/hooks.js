// Small React hooks shared across the app.
//
// A "hook" is a function starting with `use` that lets a component keep state
// or react to the browser (URL changes, resizing). Keeping them here means each
// page component stays focused on layout.
import { useState, useEffect, useLayoutEffect } from "react";

// Which page is showing, driven by the URL hash (#waymo, #tesla, …).
// Using the hash means back/forward buttons and shared links just work,
// with no router library and no server configuration.
export function useHashRoute(ids, fallback) {
  const read = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return ids.includes(h) ? h : fallback;
  };
  const [page, setPage] = useState(read);
  useEffect(() => {
    const onHash = () => {
      setPage(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return page;
}

// Pixel width of an element, kept up to date as the window resizes.
// SVG charts use it to draw at real pixel sizes, so text never stretches.
export function useElementWidth(ref, initial = 800) {
  const [width, setWidth] = useState(initial);
  useLayoutEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth); // measure before the first paint
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

// Light/dark theme. With no saved choice the site follows the OS setting;
// clicking the toggle saves an explicit choice in this browser.
const THEME_KEY = "avprogress-theme";

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function loadSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  } catch {
    // Storage can be blocked (private windows, sandboxed previews) — fall back to the OS theme.
  }
}

export function useTheme() {
  const current = () => document.documentElement.dataset.theme || systemTheme();
  const [theme, setTheme] = useState(current);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* not saved; still applies */ }
    setTheme(next);
  };
  return [theme, toggle];
}
