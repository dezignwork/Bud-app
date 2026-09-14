import { useEffect, useMemo, useRef, useState } from "react";
import { THEMES } from "./data";
import useBud from "./useBud";
import Onboarding from "./screens/Onboarding";
import Today from "./screens/Today";
import Grove from "./screens/Grove";
import Journal from "./screens/Journal";
import Mood from "./screens/Mood";
import Meditation from "./screens/Meditation";
import Splash from "./screens/Splash";
import TabBar from "./components/TabBar";

export default function App() {
  const bud = useBud();
  const { ready, state, goScreen, hello } = bud;

  // ?skipSplash bypasses the launch animation — for design work and tests.
  const skipSplash = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).has("skipSplash");
    } catch {
      return false;
    }
  }, []);
  const [showSplash, setShowSplash] = useState(!skipSplash);
  const helloScheduled = useRef(false);
  const hiddenAtRef = useRef(null);

  // The first greeting is tied to the splash clearing (or its skip) rather
  // than firing on a fixed delay, so it never fires and expires unseen
  // behind the overlay. Only applies when we're landing straight on Today —
  // onboarding and the daily mood check-in trigger their own hello().
  useEffect(() => {
    if (!skipSplash || !ready || !state || helloScheduled.current) return;
    if (state.screen !== "today") return;
    helloScheduled.current = true;
    hello();
  }, [skipSplash, ready, state, hello]);

  // iOS (and most browsers) often keep a PWA's page alive in the background
  // and just resume it on reopen instead of reloading — so the splash above,
  // which only runs once per real page load, would otherwise show just once
  // per install. Re-arm it whenever the app comes back from a real
  // backgrounding (a brief threshold filters out incidental UI blips like a
  // quick Control Center swipe) so it plays on every open, not just the first.
  useEffect(() => {
    if (skipSplash) return;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAtRef.current = Date.now();
        return;
      }
      if (document.visibilityState === "visible" && hiddenAtRef.current && Date.now() - hiddenAtRef.current > 1200) {
        hiddenAtRef.current = null;
        helloScheduled.current = false;
        setShowSplash(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [skipSplash]);

  const handleSplashDone = () => {
    setShowSplash(false);
    setTimeout(() => {
      if (!helloScheduled.current && state && state.screen === "today") {
        helloScheduled.current = true;
        hello();
      }
    }, 30);
  };

  if (!ready || !state) {
    return (
      <div style={{ minHeight: "100dvh", background: THEMES.meadow.bg, position: "relative" }}>
        {showSplash && <Splash onDone={handleSplashDone} />}
      </div>
    );
  }

  const theme = THEMES[state.theme] || THEMES.meadow;
  const isOnboardingLike = state.screen === "onboarding" || state.screen === "daily-mood";

  return (
    <div
      style={{
        minHeight: "100dvh", height: "100dvh", maxWidth: 480, margin: "0 auto",
        background: theme.bg, color: theme.ink, display: "flex", flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif", WebkitFontSmoothing: "antialiased",
        paddingTop: "env(safe-area-inset-top)", boxSizing: "border-box", overflow: "hidden",
        position: "relative",
      }}
    >
      {isOnboardingLike ? (
        <Onboarding bud={bud} theme={theme} dailyCheckIn={state.screen === "daily-mood"} />
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.4 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <div
              onClick={() => goScreen("grove")}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 999, background: theme.chip, color: theme.chipInk, fontSize: 13, fontWeight: 700, letterSpacing: -0.3, cursor: "pointer", transition: "opacity .16s ease" }}
            >
              <span style={{ flex: "none", width: 8, height: 8, borderRadius: "100% 0 100% 0", background: "currentColor" }} />
              <span style={{ whiteSpace: "nowrap" }}>{state.streak} days</span>
            </div>
          </div>

          <div key={state.screen} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, animation: "screenIn .48s cubic-bezier(.22,1,.36,1) both" }}>
            {state.screen === "today" && <Today bud={bud} theme={theme} />}
            {state.screen === "grove" && <Grove bud={bud} theme={theme} />}
            {state.screen === "journal" && <Journal bud={bud} theme={theme} />}
            {state.screen === "themes" && <Mood bud={bud} theme={theme} />}
          </div>

          <TabBar theme={theme} screen={state.screen} onGo={goScreen} justSaved={state.justSaved} />
        </>
      )}

      {state.med && <Meditation bud={bud} theme={theme} />}
      {showSplash && <Splash onDone={handleSplashDone} />}
    </div>
  );
}
