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

// Matches TabBar's own tab order — swiping steps forward/back through this.
const TAB_ORDER = ["today", "grove", "journal", "themes"];

export default function App() {
  const bud = useBud();
  const { ready, state, goScreen, hello } = bud;
  const swipeRef = useRef({ x0: 0, y0: 0 });

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

  // Swipe left/right anywhere in the screen content to step to the
  // next/previous tab, in the same order they appear in the nav bar.
  const onContentTouchStart = (e) => {
    const t = e.touches[0];
    swipeRef.current = { x0: t.clientX, y0: t.clientY };
  };
  const onContentTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - swipeRef.current.x0;
    const dy = t.clientY - swipeRef.current.y0;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const idx = TAB_ORDER.indexOf(state.screen);
    if (idx === -1) return;
    if (dx < 0 && idx < TAB_ORDER.length - 1) goScreen(TAB_ORDER[idx + 1]);
    else if (dx > 0 && idx > 0) goScreen(TAB_ORDER[idx - 1]);
  };

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
      <div style={{ minHeight: "100svh", background: THEMES.meadow.bg, position: "relative" }}>
        {showSplash && <Splash onDone={handleSplashDone} theme={THEMES.meadow} />}
      </div>
    );
  }

  const theme = THEMES[state.theme] || THEMES.meadow;
  const isOnboardingLike = state.screen === "onboarding" || state.screen === "daily-mood";

  return (
    <div
      style={{
        minHeight: "100svh", height: "100svh", maxWidth: 480, margin: "0 auto",
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.4 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            {/* The visible pill stays its original compact size — only the
                tappable area grows to 44px tall, via an invisible centered
                wrapper, rather than inflating the badge itself. The negative
                vertical margin cancels the wrapper's own extra height back
                out of the header row's flow, so the header doesn't grow
                taller (and push every screen's content down) just because
                this one control's hit area did — the wrapper still paints
                at the full 44px for tap purposes, it just doesn't reserve
                that much space in layout. */}
            <div
              onClick={() => goScreen("grove")}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44, margin: "-7px 0", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 999, background: theme.chip, color: theme.chipInk, fontSize: 13, fontWeight: 600, letterSpacing: -0.3, transition: "opacity .16s ease" }}>
                <span style={{ flex: "none", width: 8, height: 8, borderRadius: "100% 0 100% 0", background: "currentColor" }} />
                <span style={{ whiteSpace: "nowrap" }}>{state.streak} day{state.streak === 1 ? "" : "s"}</span>
              </div>
            </div>
          </div>

          <TabBar theme={theme} screen={state.screen} onGo={goScreen} justSaved={state.justSaved} />

          <div
            key={state.screen}
            onTouchStart={onContentTouchStart}
            onTouchEnd={onContentTouchEnd}
            style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, animation: "screenIn .48s cubic-bezier(.22,1,.36,1) both" }}
          >
            {state.screen === "today" && <Today bud={bud} theme={theme} />}
            {state.screen === "grove" && <Grove bud={bud} theme={theme} />}
            {state.screen === "journal" && <Journal bud={bud} theme={theme} />}
            {state.screen === "themes" && <Mood bud={bud} theme={theme} />}
          </div>
        </>
      )}

      {state.med && <Meditation bud={bud} theme={theme} />}
      {showSplash && <Splash onDone={handleSplashDone} theme={theme} />}
    </div>
  );
}
