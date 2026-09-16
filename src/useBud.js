import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { REACTIONS, SAVE_MSGS, THANKS, fillName, linesForMood } from "./data";
import { dateKey, loadState, markOpenedToday, saveState } from "./storage";
import { pullCloudState, pushCloudState } from "./cloudSync";
import { CYCLE_MS as WATER_CAN_MS } from "./components/WaterCan";

const timers = () => ({});

export default function useBud() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState(null);
  const t = useRef(timers());
  const tapsRef = useRef([]);
  const dragRef = useRef({ y0: 0 });
  const swipeRef = useRef({ startX: 0 });

  // Load persisted state once, stamp today as opened, compute streak.
  useEffect(() => {
    const loaded = loadState();
    const { openedDates, streak } = markOpenedToday(loaded.openedDates);
    const needsDailyMoodCheck = loaded.onboarded && loaded.lastMoodPromptDate !== dateKey();
    setState({
      ...loaded,
      openedDates,
      streak,
      screen: !loaded.onboarded ? "onboarding" : needsDailyMoodCheck ? "daily-mood" : "today",
      step: 0,
      editingName: false,
      extra: 0,
      squish: false,
      tapMsg: null,
      greet: false,
      greetN: 0,
      pull: 0,
      dragging: false,
      flying: false,
      justSaved: false,
      sw: null,
      swX: 0,
      rain: false,
      rainN: 0,
      msgN: 0,
      draft: "",
      ploon: false,
      editingSaved: false,
      editingEntries: false,
      med: false,
      medPhase: -1,
      medN: 4,
      medReady: null,
    });
    setReady(true);
    // The initial greeting is timed to the launch splash instead of firing
    // here directly — see App.jsx, which calls hello() once the splash (or
    // its skip) clears, so it doesn't fire and expire behind the overlay.

    // If this device has no local onboarding record — a fresh install, or
    // local storage was cleared — check for a Supabase backup under this
    // device's id before assuming it's a genuinely new user. A no-op when
    // Supabase isn't configured or there's nothing to restore.
    if (!loaded.onboarded) {
      pullCloudState().then((cloud) => {
        if (!cloud || !cloud.onboarded) return;
        const { openedDates: co, streak: cs } = markOpenedToday(cloud.openedDates || []);
        setState((s) => {
          if (!s || s.onboarded) return s;
          const needsCheck = cloud.lastMoodPromptDate !== dateKey();
          return { ...s, ...cloud, openedDates: co, streak: cs, screen: needsCheck ? "daily-mood" : "today" };
        });
      });
    }
  }, []);

  // Persist the durable slice whenever it changes (skip transient UI fields).
  const durableKey = useMemo(() => {
    if (!state) return "";
    const { onboarded, name, mood, theme, potShape, saved, entries, openedDates, lastMoodPromptDate } = state;
    return JSON.stringify({ onboarded, name, mood, theme, potShape, saved, entries, openedDates, lastMoodPromptDate });
  }, [state]);
  useEffect(() => {
    if (!ready || !state) return;
    saveState(state);
    pushCloudState(JSON.parse(durableKey));
  }, [ready, durableKey]);

  const patch = useCallback((p) => setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })), []);

  useEffect(() => () => {
    Object.values(t.current).forEach((id) => { clearTimeout(id); clearInterval(id); });
  }, []);

  const nameOrFriend = (s) => (s.name || "").trim() || "friend";

  const pool = useCallback((s) => linesForMood(s.mood), []);
  const todayLine = useCallback((s) => {
    const p = pool(s);
    const day = Math.floor(Date.now() / 864e5);
    return p[(day + s.extra) % p.length];
  }, [pool]);

  const hello = useCallback(() => {
    clearTimeout(t.current.greet);
    patch((s) => ({ greet: true, greetN: s.greetN + 1 }));
    t.current.greet = setTimeout(() => patch({ greet: false }), 2400);
  }, [patch]);

  // Onboarding ---------------------------------------------------------
  const setName = useCallback((name) => patch({ name }), [patch]);
  // Picking a mood — from onboarding, the daily check-in, or the Mood tab —
  // also counts as that day's check-in, so it isn't asked again today.
  const pickMood = useCallback((mood) => patch({ mood, extra: 0, lastMoodPromptDate: dateKey() }), [patch]);
  const obNext = useCallback(() => {
    patch((s) => {
      if (s.editingName) return { screen: "themes", editingName: false };
      if (s.step < 3) return { step: s.step + 1 };
      return { screen: "today", step: 0, onboarded: true, lastMoodPromptDate: dateKey() };
    });
  }, [patch]);
  const finishDailyCheckIn = useCallback(() => {
    patch({ screen: "today", lastMoodPromptDate: dateKey() });
    hello();
  }, [patch, hello]);
  const replayIntro = useCallback(() => patch({ screen: "onboarding", step: 0, editingName: false }), [patch]);
  const editName = useCallback(() => patch({ screen: "onboarding", step: 1, editingName: true }), [patch]);

  // Mood / Themes tab ----------------------------------------------------
  const setPotShape = useCallback((potShape) => patch({ potShape }), [patch]);

  // Grove tab --------------------------------------------------------------
  const toggleEditSaved = useCallback(() => patch((s) => ({ editingSaved: !s.editingSaved })), [patch]);
  const removeSaved = useCallback((line) => patch((s) => ({ saved: s.saved.filter((x) => x !== line) })), [patch]);

  // Journal tab --------------------------------------------------------------
  const setDraft = useCallback((draft) => patch({ draft }), [patch]);
  const clearEntry = useCallback(() => patch({ draft: "" }), [patch]);
  const saveEntry = useCallback(() => {
    patch((s) => {
      const text = s.draft.trim();
      if (!text) return {};
      return { entries: [{ d: "TODAY", t: text }, ...s.entries], draft: "" };
    });
  }, [patch]);
  const togglePloon = useCallback(() => patch((s) => ({ ploon: !s.ploon })), [patch]);
  const toggleEditEntries = useCallback(() => patch((s) => ({ editingEntries: !s.editingEntries })), [patch]);
  const removeEntry = useCallback((index) => patch((s) => ({ entries: s.entries.filter((_, i) => i !== index) })), [patch]);

  // Meditation mode (triple-tap the plant) --------------------------------
  const runPhaseRef = useRef(() => {});
  useEffect(() => {
    runPhaseRef.current = (p) => {
      if (p > 3) {
        clearInterval(t.current.medPhaseTimer);
        patch({ medPhase: 4 });
        return;
      }
      const t0 = Date.now();
      patch({ medPhase: p, medN: 4 });
      clearInterval(t.current.medPhaseTimer);
      t.current.medPhaseTimer = setInterval(() => {
        const el = Date.now() - t0;
        if (el >= 4000) {
          clearInterval(t.current.medPhaseTimer);
          runPhaseRef.current(p + 1);
          return;
        }
        const n = 4 - Math.floor(el / 1000);
        patch((s) => (n !== s.medN ? { medN: n } : {}));
      }, 50);
    };
  });
  const runPhase = useCallback((p) => runPhaseRef.current(p), []);

  const startMed = useCallback(() => {
    clearInterval(t.current.medReadyTimer);
    clearInterval(t.current.medPhaseTimer);
    patch({ med: true, medPhase: -1, medN: 4, medReady: null, tapMsg: null, squish: false });
  }, [patch]);

  const beginMed = useCallback(() => {
    clearInterval(t.current.medReadyTimer);
    const t0 = Date.now();
    patch({ medReady: 3, medPhase: -1 });
    t.current.medReadyTimer = setInterval(() => {
      const el = Date.now() - t0;
      if (el >= 3000) {
        clearInterval(t.current.medReadyTimer);
        patch({ medReady: null });
        runPhase(0);
        return;
      }
      const v = 3 - Math.floor(el / 1000);
      patch((s) => (v !== s.medReady ? { medReady: v } : {}));
    }, 50);
  }, [patch, runPhase]);

  const endMed = useCallback(() => {
    clearInterval(t.current.medReadyTimer);
    clearInterval(t.current.medPhaseTimer);
    patch({ med: false, medPhase: -1, medReady: null });
  }, [patch]);

  // Tap reactions --------------------------------------------------------
  const tapPlant = useCallback(() => {
    const now = Date.now();
    tapsRef.current = tapsRef.current.filter((x) => now - x < 900).concat(now);
    if (tapsRef.current.length >= 3) {
      tapsRef.current = [];
      startMed();
      return;
    }
    patch((s) => ({
      tapMsg: fillName(REACTIONS[Math.floor(Math.random() * REACTIONS.length)], nameOrFriend(s)),
      squish: true,
      msgN: s.msgN + 1,
    }));
    clearTimeout(t.current.tap1);
    clearTimeout(t.current.tap2);
    t.current.tap1 = setTimeout(() => patch({ squish: false }), 200);
    t.current.tap2 = setTimeout(() => patch({ tapMsg: null }), 1850);
  }, [patch, startMed]);

  // Keep / save ------------------------------------------------------------
  const save = useCallback((line) => {
    setState((s) => {
      if (s.saved.includes(line)) {
        return { ...s, saved: s.saved.filter((x) => x !== line) };
      }
      clearTimeout(t.current.save1);
      clearTimeout(t.current.save2);
      clearTimeout(t.current.save3);
      t.current.save1 = setTimeout(() => patch({ squish: false }), 220);
      t.current.save2 = setTimeout(() => {
        patch((s2) => ({
          flying: false,
          justSaved: true,
          saved: [line, ...s2.saved],
          tapMsg: SAVE_MSGS[Math.floor(Math.random() * SAVE_MSGS.length)],
          msgN: s2.msgN + 1,
        }));
      }, 780);
      t.current.save3 = setTimeout(() => patch({ justSaved: false }), 1400);
      t.current.save4 = setTimeout(() => patch({ tapMsg: null }), 3100);
      return { ...s, flying: true, squish: true, tapMsg: null };
    });
  }, [patch]);

  // "One more" ---------------------------------------------------------
  const next = useCallback(() => patch((s) => ({ extra: s.extra + 1, pull: 0, dragging: false })), [patch]);

  // Water --------------------------------------------------------------
  const water = useCallback(() => {
    setState((s) => {
      if (s.rain) return s;
      clearTimeout(t.current.rain1);
      clearTimeout(t.current.rain2);
      clearTimeout(t.current.rain3);
      // The thanks message waits until the watering-can animation has fully
      // exited (it runs for exactly WATER_CAN_MS, matching rain2 below) so
      // it never overlaps the can — it reads as Bud's reaction to being
      // watered, not commentary mid-pour.
      t.current.rain1 = setTimeout(() => {
        patch((s2) => ({
          tapMsg: fillName(THANKS[Math.floor(Math.random() * THANKS.length)], nameOrFriend(s2)),
          msgN: s2.msgN + 1,
        }));
      }, WATER_CAN_MS + 100);
      t.current.rain2 = setTimeout(() => patch({ rain: false }), WATER_CAN_MS);
      t.current.rain3 = setTimeout(() => patch({ tapMsg: null }), WATER_CAN_MS + 2700);
      return { ...s, rain: true, rainN: s.rainN + 1 };
    });
  }, [patch]);

  // Pull-to-refresh --------------------------------------------------------
  const pullStart = useCallback((e) => {
    dragRef.current.y0 = e.clientY;
    patch({ dragging: true });
  }, [patch]);
  const pullMove = useCallback((e) => {
    setState((s) => {
      if (!s.dragging) return s;
      const d = e.clientY - dragRef.current.y0;
      // Capped well below the old 96px: the shelf now rests close to the
      // screen's true bottom edge, so a long pull has little room to travel
      // before it'd start sliding the plank off the visible area.
      return { ...s, pull: d > 0 ? Math.min(d * 0.55, 45) : 0 };
    });
  }, []);
  const pullEnd = useCallback(() => {
    setState((s) => {
      if (s.pull > 29) {
        return { ...s, extra: s.extra + 1, pull: 0, dragging: false };
      }
      return { ...s, pull: 0, dragging: false };
    });
  }, []);

  // Swipeable action tabs (Keep / One more / Water) ------------------------
  const swipeDown = useCallback((which) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    swipeRef.current.startX = e.clientX;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    patch({ sw: which, swX: 0 });
  }, [patch]);
  const swipeMove = useCallback((e) => {
    setState((s) => {
      if (!s.sw) return s;
      const dx = swipeRef.current.startX - e.clientX;
      return { ...s, swX: Math.max(0, Math.min(210, dx)) };
    });
  }, []);
  const swipeEnd = useCallback((e) => {
    e.stopPropagation();
    setState((s) => {
      const w = s.sw, dx = s.swX;
      if (!w) return s;
      const trigger = dx > 72 || dx < 6;
      if (trigger) {
        if (w === "keep") setTimeout(() => save(todayLine(s)), 0);
        else if (w === "water") setTimeout(() => water(), 0);
        else setTimeout(() => next(), 0);
      }
      return { ...s, sw: null, swX: 0 };
    });
  }, [save, water, next, todayLine]);

  const goScreen = useCallback((key) => {
    patch({ screen: key });
    if (key === "today") hello();
  }, [patch, hello]);

  return {
    ready, state, patch, hello, goScreen,
    todayLine, nameOrFriend,
    setName, pickMood, obNext, finishDailyCheckIn, replayIntro, editName,
    tapPlant, save, next, water,
    pullStart, pullMove, pullEnd,
    keepDown: swipeDown("keep"), nextDown: swipeDown("next"), waterDown: swipeDown("water"),
    swipeMove, swipeEnd,
    setPotShape,
    toggleEditSaved, removeSaved,
    setDraft, clearEntry, saveEntry, togglePloon, toggleEditEntries, removeEntry,
    beginMed, endMed,
  };
}
