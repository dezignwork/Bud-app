import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Standalone iOS PWAs don't get the browser's normal periodic service-worker
// update checks — the check only fires on a fresh navigation. Since this app
// is opened by resuming the same "tab" from the home screen, re-check for an
// updated sw.js every time the app comes back to the foreground, so a new
// deploy is ready to take over (skipWaiting + clientsClaim) sooner than
// "close and reopen twice."
if ("serviceWorker" in navigator) {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      navigator.serviceWorker.getRegistration().then((reg) => reg && reg.update());
    }
  });
}

// iOS occasionally reports a too-short viewport height for a moment right
// after a standalone (home-screen) launch — only correcting itself once a
// scroll happens. That's the "content starts high, drag down to fix it"
// glitch reported on real devices; confirmed absent in a plain Safari tab,
// so it's specific to the standalone launch process itself, not our CSS.
// Nudge it ourselves immediately rather than waiting for the user to find
// it by hand — a few attempts across the first half-second, since we don't
// know exactly when iOS finishes settling.
const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
if (isStandalone) {
  const nudgeViewport = () => {
    window.scrollTo(0, 1);
    window.scrollTo(0, 0);
  };
  nudgeViewport();
  requestAnimationFrame(() => requestAnimationFrame(nudgeViewport));
  [60, 150, 300, 600].forEach((ms) => setTimeout(nudgeViewport, ms));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
