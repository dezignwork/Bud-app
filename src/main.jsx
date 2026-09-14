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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
