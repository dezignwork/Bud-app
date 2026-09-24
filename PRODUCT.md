# Bud — Product Spec

## What it is

Bud is a daily-affirmation companion PWA (React + Vite, installable to a
phone home screen, offline-capable). A small illustrated plant with a face
("Bud") lives on a shelf; opening the app each day surfaces one affirmation
line matched to your mood, and simple caretaking actions (Keep, Water) are
the app's only real "mechanics." There's no login — identity is a name you
give Bud, and continuity is a per-device streak plus an optional anonymous
cloud backup.

## Screens

The app has one top-level `screen` state field (`src/useBud.js`) that
switches between: `onboarding`, `daily-mood`, `today`, `grove`, `journal`,
`themes` (the Mood tab's internal key), plus a `med` boolean overlay
(Meditation) that can show on top of any of the four main tabs.

### Splash (`screens/Splash.jsx`)
A ~2.6s launch animation (seed dot lands, leaf unfurls, brief hold, fade
out) shown on every real app open — not just first install — because a
standalone PWA tab is usually resumed, not reloaded, so this is the user's
recurring "the app is starting" beat. Respects
`prefers-reduced-motion` (shorter, cross-fade only, no scale). Skippable via
the `?skipSplash` query param, used for design/QA work so it isn't waiting
2.6s on every pass.

### Onboarding (`screens/Onboarding.jsx`)
Four steps, shared with the **daily mood check-in** (same component,
`dailyCheckIn` prop skips straight to step 3): (1) intro ("Hi, I'm Bud"),
(2) name entry, (3) sets expectations ("one gentle line a day"), (4) mood
pick. Completing it sets `onboarded: true` and lands on Today. The daily
check-in re-triggers step 4 alone, once per calendar day
(`lastMoodPromptDate !== today`), so mood can drift day to day without a
full re-onboarding.

### Today (`screens/Today.jsx`)
The main/default screen: the day's affirmation line, the plant-on-a-shelf
illustration, and two swipe-out action tabs (Keep, Water me!). See
"Core mechanics" below for exactly how the line is chosen and what each
gesture does. Also hosts: the greeting bubble ("Hi, {name}!" on open), tap
reactions on the plant (random short line, quick squish animation), and
triple-tap-to-enter Meditation.

### Grove (`screens/Grove.jsx`)
"{name}'s grove" — a monthly calendar heatmap (leaf-filled cell = a day the
app was opened that month) plus the list of lines the user has Kept, each
removable in an edit mode. Kept lines and the calendar both reset with the
`month` key rolling over (see Persistence).

### Journal (`screens/Journal.jsx`)
A free-text daily draft (word count, Clear/Save) plus a list of previously
saved entries (also editable/removable), reset monthly like Grove's saved
lines. **Ploon Mode** is a toggle that swaps the textarea's placeholder and
grows its minimum height — a "just let loose, don't worry about structure"
prompt variant, not a different save path or data shape.

### Mood (tab label; internal screen key `themes`) (`screens/Mood.jsx`)
Settings-ish tab: pick a mood (drives which affirmation pool Today draws
from), pick a pot shape (Classic/Round, purely cosmetic), and edit the name
Bud calls you. (An earlier "Kept this month" storage-usage card and a
"Replay the intro" action lived here and were deliberately removed — don't
re-add without being asked.)

### Meditation (`screens/Meditation.jsx`, overlay)
Entered by triple-tapping the plant on Today (three taps within 900ms).
A guided 4-4-4-4 box-breathing exercise: intro → 3-2-1 ready countdown →
four phases (Inhale/Hold/Exhale/Hold, 4s each, one full loop) → "Hope that
helps!" outro with Start again / Back to Today. Can be exited early at any
point.

## Core mechanics

### Choosing today's line
`todayLine(state)` in `useBud.js` is the single source of truth, used
everywhere a line is displayed or saved:
1. If `state.randomLine` is set, return it as-is (see swipe-right, below).
2. Otherwise, pick deterministically: `pool[(daysSinceEpoch + extra) % pool.length]`,
   where `pool` is the current mood's slice of the 1000-line
   `affirmations.json`. This is why, without ever touching `extra` or
   `randomLine`, the same day always shows the same line for a given mood,
   and the sequence advances by exactly one pool position per calendar day.

Three ways a user can change what's showing, and how they differ:
- **Pull down** ("keep pulling…" → "let go for another"): advances `extra`
  by 1 — the *next* line in the deterministic sequence, and clears any
  `randomLine` override.
- **Swipe right**: sets `randomLine` to a genuinely random pick from the
  same mood's pool (guaranteed different from what's currently showing).
  While dragging, the Keep/Water tabs slide right until their icon circles
  touch the screen edge, then snap back on release regardless of whether
  the drag was far enough to commit.
- **Changing mood** (Mood tab or onboarding): resets both `extra` and
  `randomLine`, landing back on that mood's deterministic day-1 pick.

`extra` and `randomLine` are both session-only (not persisted) — a reload
always starts from the plain day-indexed pick for whatever mood is saved.

### Keep
Swiping the Keep tab far enough (or tapping through once revealed) saves
the current line into `state.saved` (Grove's list) and plays a short
"flying" animation of the line arcing toward the Grove tab. Saving is a
toggle — keeping an already-kept line un-keeps it.

### Water
Swiping the Water tab plays the watering-can animation (~4.5s, see
`WaterCan.jsx`'s `CYCLE_MS`) and shows a "thanks" reaction line after it
fully exits, timed so the message never overlaps the can. The tab is
visually dimmed and disabled for the duration.

### Streak
`computeStreak` (`storage.js`) counts consecutive calendar days, walking
backward from today, that appear in `openedDates`. Every app open stamps
today's date into `openedDates` (capped to the last 400 entries — plenty
for the streak calc, bounded so the array doesn't grow forever). The plant
itself grows (more/longer leaves, taller stem — `plantGrowth.js`) as the
streak climbs, capping out at streak 12+.

## Data model / persistence

`localStorage` key `bud.app.v1` (`storage.js`) holds the durable slice only
— `onboarded, name, mood, theme, potShape, saved, entries, month,
openedDates, lastMoodPromptDate`. Everything else on `state` (screen,
animation flags, drag positions, `extra`/`randomLine`, etc.) is UI-session
state, recomputed fresh on load and never written to storage.

`saved` (Grove) and `entries` (Journal) both live for the *current calendar
month only* — `loadState()` clears both the moment the stored `month` no
longer matches this month's key. There's no monthly archive; this is a
deliberate "fresh start each month" design, not a bug.

### Cloud backup (Supabase)
Entirely optional and silent. `supabaseClient.js` only constructs a client
if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set; otherwise
`supabase` is `null` and `cloudSync.js`'s `pullCloudState`/`pushCloudState`
are no-ops. There is no login — a random UUID (`bud.device.v1` in
localStorage) is the only identity, generated once per device. On every
durable-state change, the full durable slice is upserted to a single
`bud_state` table row keyed by that device id (fire-and-forget; a failed
push just means local storage stays authoritative until the next attempt).
On boot, if local storage has no onboarding record at all (fresh install or
cleared storage), the app checks for a cloud row under that device id
before assuming it's a genuinely new user.

**This repo currently only has `.env.example`** (empty
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`), not a real `.env` — so the
app runs fully functional on localStorage alone, but the cloud-restore path
has not been (and cannot be, without real project credentials) exercised
against an actual Supabase backend as part of this pass. QA below covers
the local-only path only; treat cloud sync as untested infrastructure until
someone runs it with real credentials.

## Deployment

Vite build → static output, deployed on Vercel (`vercel.json` sets cache
headers for `/icons/*`, the manifest, and `no-cache` on `/`). PWA via
`vite-plugin-pwa`: precaches hashed JS/CSS/asset files for offline use,
serves `index.html` network-first (so a real app open always tries to fetch
the latest deploy rather than an old cached shell), and self-updates
(`autoUpdate` + `skipWaiting`/`clientsClaim`) — `main.jsx` reloads the tab
once a new service worker has taken over, but only while backgrounded, so a
deploy never yanks the rug out from under an in-progress interaction (e.g.
an unsaved journal draft).
