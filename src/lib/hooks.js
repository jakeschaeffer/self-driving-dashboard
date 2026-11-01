// Small React hooks shared across the app.
//
// A "hook" is a function starting with `use` that lets a component keep state
// or react to the browser (like URL changes). Keeping them here means each
// page component stays focused on layout.
import { useState, useEffect } from "react";

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

// True while a CSS media query matches, e.g. useMediaQuery("(min-width: 640px)").
// Charts use it to drop point labels on phones, where they would collide.
export function useMediaQuery(query) {
  const get = () => window.matchMedia?.(query).matches ?? false;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia?.(query);
    if (!mql) return;
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
