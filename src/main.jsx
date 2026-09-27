// Entry point: load the global styles, restore the saved theme, mount the app.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/base.css";
import { loadSavedTheme } from "./lib/hooks.js";
import App from "./App.jsx";

loadSavedTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
