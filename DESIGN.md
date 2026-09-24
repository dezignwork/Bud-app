# Bud — Design System

Bud is a single-theme app (`meadow`, in `src/data.js`). This document
describes that theme's tokens and the conventions built on top of them, as
implemented — not an aspirational spec. If the code and this doc ever
disagree, the code is right and this doc is stale; fix the doc.

## Color tokens

All colors live in `THEMES.meadow` (`src/data.js`). There is currently only
one theme; the `theme` object is threaded as a prop through every screen and
component rather than read from a global, so adding a second theme later is
a data change, not a rewire.

| Token | Value | Used for |
|---|---|---|
| `bg` | `#f8f7f4` | App background (off-white/cream) |
| `ink` | `#000000` | Default text on `bg` |
| `card` | `#ffffff` | Plain content cards (Grove/Journal/Mood rows), icon circles |
| `cardInk` | `#000000` | Text/icons on `card` |
| `bubble` | `#ffffff` | Speech bubbles (TailBubble, PopBubble) |
| `bubbleInk` | `#000000` | Text in speech bubbles |
| `leaf` | `#094020` | **Brand/mascot green** — stem, leaves, calendar heatmap, splash mark. Illustration-only. |
| `chip` | `#98ac9f` | **Interactive-accent green** — streak badge, selected mood/pill states, active toggles, action-tab fill. Never used in the plant illustration. |
| `chipInk` | `#000000` | Text/icons on `chip` |
| `pot` | `#7a5638` | Pot body |
| `potInk` | `#fdf6ec` | Eyes/mouth on the pot (cream, for contrast on brown) |
| `btnBg` / `btnFg` | `#000000` / `#ffffff` | Primary black pill buttons (onboarding CTAs, meditation) |
| `ghostLine` | `rgba(0,0,0,.18)` | Hairline borders/outlines (inset shadow rings, bubble edge) |
| `cardShadow` | `0 1px 2px rgba(0,0,0,.04), 0 10px 24px rgba(0,0,0,.05)` | Soft elevation for plain white cards — see "Elevation" below |
| `desk` / `deskDark` | `#c9a876` / `#a4855c` | Wood tones — shelf plank, watering can, book spines |

**`leaf` vs `chip` is a deliberate, load-bearing distinction, not two shades
of the same idea.** `leaf` is Bud's own color (the character/illustration);
`chip` is "the app is listening to you" (anything tappable/selected). Don't
cross them — e.g. don't use `chip` on the plant, don't use `leaf` for a new
toggle.

**Deriving shades, don't hardcode a second color.** When something needs a
darker or lighter variant of an existing token, use CSS `color-mix`, the
same way the codebase already does it, rather than inventing a new literal
hex:
```js
`color-mix(in oklab, ${theme.pot}, #000 16%)`   // pot rim, a shade darker than the pot body
`color-mix(in oklab, ${theme.chip}, #094020 22%)` // Journal's Save button gradient
```
This keeps every derived color tied to its source token, so a future theme
swap doesn't leave orphaned hardcoded shades behind.

## Elevation

Plain white cards (Grove's calendar/saved-line rows, Journal's draft card
and entry rows, Mood's info rows) use `boxShadow: theme.cardShadow` — a
two-layer soft shadow — so they read as raised above the `bg` cream instead
of just a color swap. Apply this to any new plain content card; don't invent
a different shadow recipe per screen.

Interactive pills that are *not* elevated cards (mood chips, action tabs,
onboarding CTA) use either a flat fill (`chip`/`btnBg`) or an inset ring
(`inset 0 0 0 1px ${theme.ghostLine}`) instead — elevation is reserved for
content containers, not buttons.

## Typography

Self-hosted Inter (Latin subset only — the app is English-only, so this
keeps the PWA's offline precache smaller), weights 300/400/600/700 as
`@font-face` in `index.css`. No 500 or 800 weight is loaded; don't reference
them.

**Size scale** (consolidated in an earlier pass to five steps, plus a few
named hero sizes that don't reuse):

| Size | Weight | Role |
|---|---|---|
| 11px | 600 | Micro labels — eyebrow tags (`LINES YOU KEPT`, `POT SHAPE`, journal date, entry timestamps) |
| 13px | 400/600 | Small UI — buttons, pills, captions, tab labels |
| 15px | 400 | Body copy — saved lines, journal entries, bubble text, mood picker labels |
| 16px | 600 | Card sub-headers (calendar month, "Bud calls you {name}") |
| 17px | 300 | Journal textarea only (intentionally lighter weight — it's the user's own writing, not UI chrome) |

Hero/one-off sizes, each used in exactly one place: **20px** (onboarding
name input), **26px** (the "flying" save-bubble copy of the quote), **28px**
(screen titles — "Journal", "{name}'s grove", "How are you today?"),
**38px** (Today's quote — the app's single largest, most important text),
**64px** (meditation's countdown numeral).

Headline weights are 700 (quote, screen titles) or 600 (card sub-headers,
buttons); body copy is 400; only the journal textarea drops to 300. Don't
introduce a 500-weight "medium" tier or a size outside this scale without
a reason worth writing down here.

Negative `letterSpacing` tightens larger sizes (e.g. `-2.28` at 38px, `-1.68`
at 28px); `0.6` positive tracking is reserved for the 11px uppercase eyebrow
labels.

## Spacing & layout

- **28px side gutter** on every screen (`padding: "0 28px ..."`), consistent
  across Today/Grove/Journal/Mood.
- **Edge-bleed technique**: elements meant to feel like part of the physical
  scene (the shelf in `ShelfScene`, the swipeable action tabs) deliberately
  bleed *past* the 28px gutter to the true screen edge via `left: -28` /
  `right: -28`, canceling the parent's padding exactly. Regular content
  cards do not do this — only furniture/drawer-style elements that should
  feel flush with the device edge.
  - Careful: `right`/`left` on an absolutely-positioned element is relative
    to the nearest positioned ancestor's own edge, *not* that ancestor's
    padded content edge. `right: -28` only reaches the true screen edge if
    the ancestor's padding is exactly 28px; a `-28` inside a container with
    different padding will overshoot and get clipped by `overflow:hidden`.
- **Gap-centering with a floor clamp**: when centering an element in the
  variable-height gap between two other elements (see the action-tab stack
  in `Today.jsx`), center on `calc(50% - halfOfTheFixedNeighbor)`, then
  clamp with `max(halfOwnHeight, ...)` — not `max(0, ...)` — so the
  clamp accounts for the centered element's own half-height once
  `translateY(-50%)` is applied. Verified by measuring actual rendered
  rects, not by eyeballing.

## Illustration style

Flat solid shapes only — **no strokes/outlines, no gradients as decoration,
no drop shadows on individual illustration pieces.** Depth comes from two
techniques, both borrowed from print/paper-cutout illustration:

1. **A `color-mix`'d darker shade layered behind/under a lighter shape** —
   e.g. the pot's rim is `color-mix(in oklab, ${theme.pot}, #000 16%)`
   sitting just above the pot body; the watering can's rim/base/spray-head
   use the same trick with a `CAN_DARK` derived from the base `CAN` yellow.
2. **A thin highlight or shading line** — the shelf books' lighter "page
   edge" strip and darker "binding band," the cup's highlight strip, the
   watering can's seam line. Always a flat rect/rounded-rect, never a
   gradient.

The one sanctioned use of a CSS `border` in the illustration layer is a
**ring/handle shape** (the watering can's handle and top grip) — a border is
the only practical way to punch a hole in a div without SVG, so it's the
shape's actual material, not a decorative stroke, and it never carries a
second, contrasting outline color on top.

When redrawing or adding an illustrated element, match this level of
definition: one base fill + one `color-mix` shade + maybe one highlight
line. If a design reference (a user-supplied sticker/reference image) has
heavier outlines or multi-tone gradients, translate it down to this
vocabulary rather than porting it as-is — see the watering can's history in
git log for a worked example of doing exactly that.

Bud himself (the pot with a face) is unique — no other illustrated pot/plant
in the app gets eyes or a mouth. A decorative plant elsewhere would need to
stay faceless to avoid being confused for Bud.

## Motion

Keyframes live in `src/index.css` (globals) or co-located in a component's
own `<style>` tag when they're specific to it and ported from elsewhere
(see `WaterCan.jsx`). Naming is short and prefixed by where it's used
(`sp*` = splash, `med*` = meditation), not by what it does.

Common easings:
- `cubic-bezier(.34,1.4,.64,1)` / `cubic-bezier(.34,1.3,.64,1)` — bouncy
  overshoot, used for anything settling into place after a drag or tap
  (pull-to-refresh snap-back, tab width reveal, the swipe-right tab slide).
- `cubic-bezier(.22,1,.36,1)` — snappier settle, no overshoot (screen
  transitions, onboarding bubble entrance).
- Plain `ease` for simple fades/drifts (speech bubbles).

**Gesture damping pattern** (see `useBud.js`'s pull-to-refresh and
swipe-right-to-shuffle): raw drag distance is scaled down and capped before
being written to state — e.g. `pull: Math.min(dy * 0.55, 45)` — so the
visual travel is a damped, capped fraction of the finger's actual movement,
and a separate, roughly-proportional threshold (not necessarily the same
number as the cap) decides whether releasing "commits" the gesture. When
two gestures can start from the same touch (e.g. pull-down vs swipe-right on
Today's content), lock onto one axis after a small deadzone
(`Math.abs(dx) > 8 || Math.abs(dy) > 8`, then compare magnitudes) rather
than trying to support both at once.

**Respecting `prefers-reduced-motion`**: any continuous, unconditional idle
loop (Bud's breathe/sway/leafbob/blink) reads `usePrefersReducedMotion()`
(`src/usePrefersReducedMotion.js`) and swaps its `animation` to `"none"` when
the setting is on. Brief, action-triggered animations (save-fly, watering,
screen transitions, gesture snap-backs) are left alone — motion sensitivity
is about things that loop forever in the background, not a one-shot response
to something the user just did. If an element needs a `delay` alongside a
conditional `animation`, fold the delay into the shorthand string itself
(`` `leafbob 4.2s ease-in-out ${delay}s infinite` ``) rather than a separate
`animationDelay` property — mixing a shorthand and a longhand for the same
CSS property on one element causes a React dev warning and can leave the
longhand desynced after a live toggle.

## Touch targets

Every tappable element should measure at least 44×44 CSS px (WCAG 2.5.5 /
iOS HIG), even when its visible design is smaller (an EDIT label, a small
delete icon, a compact pill). Prefer growing the visible element itself when
that reads fine at the larger size (e.g. Journal's Ploon Mode pill, Clear/
Save buttons). When growing the visible element would look wrong (e.g. it
would visually outweigh the content next to it, like the streak badge or an
EDIT/DONE label), wrap it in an invisible centered hit area instead:

```jsx
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44, cursor: "pointer" }}>
  <span>{/* unchanged, small, visible element */}</span>
</div>
```

Two things to get right with this wrapper:
- Match `justifyContent` to how the original element was aligned in its row
  (`flex-end` for something that was flush-right, not `center`) — recentering
  it inside the wrapper shifts the visible text/icon off its original
  position.
- If the wrapper sits inside a flex row alongside fixed-height siblings, its
  own `minHeight: 44` can grow that row's total height even though nothing
  visible changed. Cancel it with a negative vertical margin sized to the
  difference (e.g. `margin: "-7px 0"` for a 44px wrapper around a ~30px-tall
  visible pill) so the wrapper still paints and receives taps at the full
  44px without pushing the rest of the layout down.

## Components (`src/components/`)

- **`TabBar`** — top nav (lives under the date/streak row, not pinned to the
  bottom). Each tab is a label over a small leaf-shaped dot that fills in
  when active.
- **`SpeechBubble`** exports `TailBubble` (curved-tail bubble for greetings/
  reactions on Today, positioned by an absolute `bottom` prop tied to plant
  height) and `PopBubble` (rotated-square-tail bubble, onboarding only).
- **`Plant`** — the Bud mark itself: stem + leaves (count/height driven by
  `plantGrowth(streak)`), pot body + rim (shape driven by `POT_SHAPES`),
  blinking two-dot face. Also exports `potMetrics(potShape, large)` so
  screens can compute plant-relative positions (message bubbles, watering
  can) without duplicating pot geometry.
- **`ShelfScene`** — the wooden shelf/bookend/books/cup furniture Today's
  plant sits on. Fixed 260px height; bleeds to the screen edges.
- **`WaterCan`** — the "Water me!" animation: rides in from the left, tilts
  to pour an 18-droplet fan spray across 6 trajectories, rights itself, rides
  out. Runs once per tap (`animation-fill-mode: both`, iteration count 1),
  not the looping demo it was ported from. Exports `CYCLE_MS` so
  `useBud.js` can key its timers (thanks-message delay, rain-state
  duration) off the same constant instead of a second hardcoded number.

## Pot shapes (`POT_SHAPES` in `data.js`)

Two shapes, user-selectable on the Mood tab: **Classic** (`taper`, a
narrow-necked tapered pot via `clip-path` polygon) and **Round** (`orb`, a
stout wider-than-tall jar with a flat rim band, via `border-radius` + scale
factors). Both are defined as `clip`/`radius`/`rimClip`/`rimRadius` plus
optional `widthScale`/`heightScale`/`rimWidthScale`/`rimHeightScale`
multipliers applied on top of shared base dimensions in
`Plant.jsx`'s `potMetrics()` — add a third shape by following that same
shape descriptor, not by forking `Plant.jsx`'s render logic.
