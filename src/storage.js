const STORE_KEY = "bud.app.v1";

const pad = (n) => String(n).padStart(2, "0");
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const monthKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

// Consecutive-day streak ending today, derived from the set of days the app was opened on.
export function computeStreak(openedDates) {
  const set = new Set(openedDates);
  const today = new Date();
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (set.has(dateKey(d))) streak++;
    else break;
  }
  return streak;
}

const defaults = () => ({
  onboarded: false,
  name: "",
  mood: "Calm",
  theme: "meadow",
  potShape: "taper",
  saved: [],
  entries: [],
  month: monthKey(),
  openedDates: [],
});

export function loadState() {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
  } catch {
    data = null;
  }
  const base = defaults();
  if (!data || typeof data !== "object") return base;

  const merged = { ...base, ...data };

  // Saved lines and journal entries live for the current month only.
  if (data.month !== monthKey()) {
    merged.saved = [];
    merged.entries = [];
    merged.month = monthKey();
  }
  if (!Array.isArray(merged.openedDates)) merged.openedDates = [];
  return merged;
}

// Marks today as opened (idempotent) and returns { openedDates, streak, changed }.
export function markOpenedToday(openedDates) {
  const today = dateKey();
  if (openedDates.includes(today)) {
    return { openedDates, streak: computeStreak(openedDates), changed: false };
  }
  const next = [...openedDates, today].slice(-400); // cap growth, streak only needs recent history
  return { openedDates: next, streak: computeStreak(next), changed: true };
}

export function saveState(state) {
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        onboarded: state.onboarded,
        name: state.name,
        mood: state.mood,
        theme: state.theme,
        potShape: state.potShape,
        saved: state.saved,
        entries: state.entries,
        month: monthKey(),
        openedDates: state.openedDates,
      })
    );
  } catch {
    // storage unavailable (private mode, quota) — app still works for the session
  }
}
