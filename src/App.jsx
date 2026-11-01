// App shell — header, the current page, footer.
// Each page is its own folder in src/pages/; this file only picks which one to show.
import { PAGES } from "../data.js";
import { useHashRoute } from "./lib/hooks.js";
import SiteHeader from "./components/site/SiteHeader.jsx";
import SiteFooter from "./components/site/SiteFooter.jsx";
import PageIntro from "./components/site/PageIntro.jsx";
import Overview from "./pages/overview/Overview.jsx";
import Waymo from "./pages/waymo/Waymo.jsx";
import Tesla from "./pages/tesla/Tesla.jsx";
import Others from "./pages/others/Others.jsx";
import Steeringless from "./pages/steeringless/Steeringless.jsx";

const PAGE_COMPONENTS = {
  home: Overview,
  waymo: Waymo,
  tesla: Tesla,
  others: Others,
  targets: Steeringless,
};

export default function App() {
  const page = useHashRoute(PAGES.map((p) => p.id), "home");
  const info = PAGES.find((p) => p.id === page);
  const Page = PAGE_COMPONENTS[page];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader active={page} />
      {/* key={page} remounts the page on navigation so charts replay their entrance */}
      <main key={page} className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-10 sm:px-6">
        <PageIntro page={info} />
        <Page />
      </main>
      <SiteFooter />
    </div>
  );
}
