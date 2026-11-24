// App shell — header, tab nav (hash-routed), footer.
import { useState, useEffect } from "react";
import { SITE, PAGES, FOOTER_SOURCES } from "../data.js";
import { FONT, VIZ, LABEL, useNarrow } from "./ui.jsx";
import Overview from "./pages/Overview.jsx";
import Waymo from "./pages/Waymo.jsx";
import Tesla from "./pages/Tesla.jsx";
import Others from "./pages/Others.jsx";
import Steeringless from "./pages/Steeringless.jsx";

const PAGE_COMPONENTS = {
  home: Overview,
  waymo: Waymo,
  tesla: Tesla,
  others: Others,
  targets: Steeringless,
};

// Tabs are addressable: #waymo, #tesla, … Back/forward and deep links work.
function usePage() {
  const fromHash = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return PAGES.some((p) => p.id === h) ? h : "home";
  };
  const [page, setPage] = useState(fromHash);
  useEffect(() => {
    const onHash = () => {
      setPage(fromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (id) => {
    window.location.hash = id === "home" ? "" : id;
  };
  return [page, navigate];
}

function Nav({ active, onChange }) {
  return (
    <nav style={{
      display: "flex", gap: "2px", background: VIZ.surface,
      borderBottom: `1px solid ${VIZ.border}`, padding: "0 20px",
      overflowX: "auto", WebkitOverflowScrolling: "touch",
    }}>
      {PAGES.map((p) => (
        <button key={p.id} onClick={() => onChange(p.id)} style={{
          padding: "13px 16px", background: active === p.id ? "rgba(255,255,255,0.05)" : "transparent",
          border: "none", borderBottom: active === p.id ? "2px solid #60a5fa" : "2px solid transparent",
          ...LABEL, color: active === p.id ? VIZ.text : VIZ.muted, cursor: "pointer",
          fontFamily: FONT, whiteSpace: "nowrap", transition: "all 0.15s",
        }}>{p.nav}</button>
      ))}
    </nav>
  );
}

export default function App() {
  const [page, navigate] = usePage();
  const pg = PAGES.find((p) => p.id === page) || PAGES[0];
  const PageComponent = PAGE_COMPONENTS[page] || Overview;
  const narrow = useNarrow();

  return (
    <div style={{ minHeight: "100vh", background: VIZ.page, color: VIZ.text, fontFamily: FONT }}>
      <header style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: VIZ.text, margin: 0, letterSpacing: "-0.01em" }}>
            <span style={{ color: "#60a5fa" }}>AV</span>Progress
          </h1>
          <span style={{ fontSize: "11px", color: VIZ.muted }}>Autonomous Driving by the Numbers</span>
        </div>
        <div style={{ fontSize: "11px", color: VIZ.muted, marginTop: "3px" }}>
          {"Last updated: "}{SITE.lastUpdated}
        </div>
      </header>

      <Nav active={page} onChange={navigate} />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: narrow ? "24px 20px 48px" : "32px 32px 60px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{pg.title}</h1>
        <p style={{ fontSize: "13px", color: VIZ.secondary, margin: "0 0 24px", lineHeight: 1.5, maxWidth: "680px" }}>{pg.sub}</p>
        <PageComponent />
      </main>

      <footer style={{
        padding: "20px", borderTop: "1px solid rgba(255,255,255,0.03)",
        textAlign: "center", fontSize: "11px", color: VIZ.muted, lineHeight: 1.6,
      }}>
        {"Data: " + FOOTER_SOURCES.join(" · ")}
        <br />Not investment advice. Metrics use different methodologies.
      </footer>
    </div>
  );
}
