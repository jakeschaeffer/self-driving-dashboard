// Entry point: load the styles, mount the app.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import "./styles/site.css"; // imports BoardUI's globals.css, which pulls in Tailwind + tokens
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BoardUI's React Aria components read locale and direction from this provider. */}
    <DirectionProvider locale="en-US">
      <App />
    </DirectionProvider>
  </StrictMode>,
);
