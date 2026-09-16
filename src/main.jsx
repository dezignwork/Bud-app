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
// Even once a new service worker takes over, the JS already running in this
// tab stays the old version — skipWaiting/clientsClaim only decides who
// answers future fetches, it doesn't swap out code already executing in
// memory. That only happens on an actual reload. So: reload once a new
// worker has taken control, but only while the app is backgrounded (not
// mid-interaction) — by the time it's reopened, it's already fresh, with
// no visible flash and no risk of interrupting something like an unsaved
// journal draft.
if ("serviceWorker" in navigator) {
  let pendingReload = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    pendingReload = true;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      navigator.serviceWorker.getRegistration().then((reg) => reg && reg.update());
    } else if (pendingReload) {
      pendingReload = false;
      window.location.reload();
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
