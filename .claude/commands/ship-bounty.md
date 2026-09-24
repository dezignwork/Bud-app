---
description: Execute the bounty items the user picked, with the same quality bar as /ship and none of its ceremony
---

Work through the bounty items the user chose: $ARGUMENTS

If `$ARGUMENTS` is empty, use the selection from the `/bounty` run in this session. If there is no such selection, run `/bounty` first rather than guessing.

This is a fix run, not a design run. There is no direction gate and no design system regeneration. Everything else from `/ship` still applies: one taste authority if any visual work is involved, one motion system, patch files for edits, and the existing `DESIGN.md` as law.

## How to work

1. **Confirm each item still exists** before touching it. A bounty list can be stale. Drop anything already fixed and say so in one line.
2. **Take them in the order the user picked**, not in the order that is convenient. If two items touch the same code, do them together and say why.
3. **Fix the cause, not the symptom.** If an item is a symptom of a rule the system keeps breaking, fix the rule and note it for `DESIGN.md`.
4. **Edits go through a patch file** written to your scratchpad, never long inline replacements.
5. **Stay inside the brief.** An item is not a licence to restyle the screen it lives on. Anything you notice on the way goes to `BACKLOG.md`, not into this diff.

## Verification

- Run the project's QA script (`scripts/qa.*`, written by `/ship`) once when all the fixes are in. If the project has none, write it now — the next run needs it anyway.
- Exercise each fixed item yourself, by the path a user would take to hit it. A fix that only passes the script is not verified.
- For anything touching shared or live data, test against a local fixture build, never the live board.

## Reviewers

Spawn the two scoped reviewers from `/ship` Phase 4 **only when** the bounty changed a user-facing surface, or touched data writes, auth, or a destructive action. For a copy fix or a token cleanup, skip them and say so.

When they run, the scope is the bounty diff alone, P0 and P1 only, ranked, with `file:line`.

## Close

- Build, commit, push **once**. One liveness check.
- Update `DESIGN.md` and the sidecar only where a rule actually changed.
- Update `BACKLOG.md`: remove what you fixed, keep what you did not, add anything new you found.
- One report: what was fixed and how you proved it, what you dropped as stale, what is still open and why.
