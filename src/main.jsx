import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// iOS's installed-PWA WKWebView can leave its visual viewport shrunk after a
// keyboard opens and closes (a well-known WKWebView bug, distinct from page
// scroll) — CSS units like 100% / 100dvh then stay wrong until something
// else triggers layout. Track the real viewport height in JS instead and
// drive #root's height from it, refreshed on every resize/keyboard event.
function syncAppHeight() {
  const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${h}px`);
}
syncAppHeight();
window.visualViewport?.addEventListener("resize", syncAppHeight);
window.visualViewport?.addEventListener("scroll", syncAppHeight);
window.addEventListener("resize", syncAppHeight);
window.addEventListener("orientationchange", syncAppHeight);
window.addEventListener("focusin", () => setTimeout(syncAppHeight, 50));
window.addEventListener("focusout", () => setTimeout(syncAppHeight, 50));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
