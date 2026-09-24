# Backlog

Non-blocking findings from the polish pass (2026-09-24) that were logged rather
than fixed, either because they predate this pass or because they're a bigger
scope than a single polish pass should absorb. Each has evidence from the
Phase 4 review and a proposed one-line fix.

## 1. Deleting a kept line or journal entry has no undo or confirm
`Grove.jsx` and `Journal.jsx` both wire their delete icon straight to
`removeSaved(line)` / `removeEntry(i)` — one tap, no confirmation, no undo.
**Fix:** a lightweight confirm-on-second-tap or a toast with an "Undo" action
tied into `useBud.js`'s existing state setters.

## 2. "Clear" wipes the journal draft with no confirm
`Journal.jsx`'s Clear button calls `clearEntry` directly; a stray tap loses
unsaved writing with no recovery path.
**Fix:** same undo-toast pattern as #1, or a two-tap confirm like the delete
icons already could use.

## 3. Journal entries are permanently labeled "TODAY"
`useBud.js:151` stamps `e.d` once at save time and never re-derives it, so an
entry from last week still reads "TODAY" in the Journal list. Pre-existing,
not introduced by this pass.
**Fix:** store the entry's real date and format it relative to `Date.now()`
at render time instead of freezing the label at save time.

## 4. Broad accessibility gaps across the app
No `role="dialog"` on the Meditation full-screen overlay, no keyboard
handling/`tabIndex`/`role="button"` on the ~23 `onClick`-only `<div>`s used as
buttons app-wide, and no pressed-state semantics (`aria-pressed`) on toggles
like EDIT/DONE or Ploon Mode. This pass added touch-target sizing and
headings but didn't attempt a full keyboard/screen-reader pass.
**Fix:** a dedicated accessibility pass — convert interactive `<div>`s to
`<button>` or add `role`/`tabIndex`/key handlers, add `role="dialog"` +
focus trapping to Meditation, add `aria-pressed` to toggles.

## 5. Pre-existing contrast failures across shared UI
Measured ratios (all need 4.5:1 for text, 3:1 for graphics):
- EDIT/DONE labels: 3.92:1
- Delete-icon at opacity .4: ~2.85:1
- TabBar inactive labels: 3.32:1
- Grove weekday headers (M/T/W/T/F/S/S): 2.85:1
- "N of 30 days" / calendar dates: 3.35:1
- Eyebrow labels (LINES YOU KEPT, EARLIER, POT SHAPE, etc.): 3.92-3.98:1
- Journal word count: 3.98:1

These are all instances of the same convention (dimming secondary text via
`opacity`) landing just under WCAG AA rather than isolated bugs.
**Fix:** raise the shared "dimmed" opacity value (or swap to a fixed
lower-contrast color token that's still verified ≥4.5:1) app-wide, then
re-run the audit to confirm.

## 6. QA script doesn't exercise EDIT mode or the Onboarding mood step
`qa/smoke.mjs`'s Phase 3 audit sweep visits the 4 main tabs at rest, but
never toggles Grove/Journal's EDIT mode or steps into Onboarding's mood
picker, so issues only visible in those states (e.g. this pass's own
EDIT/DONE alignment regression) can slip past an audit-only run.
**Fix:** extend the Phase 3 sweep to toggle EDIT mode on Grove/Journal and to
step through Onboarding before running the four audit checks.
