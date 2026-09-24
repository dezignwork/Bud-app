---
description: Show what a ship run actually left undone, ranked by real impact, for the user to pick from
---

Report what the last `/ship` run on this project left undone, for: $ARGUMENTS

If `$ARGUMENTS` is empty, use the current project folder.

This command is **read-only**. It writes nothing except `BACKLOG.md` bookkeeping, and it fixes nothing. Its whole job is to tell the truth about what was deferred, rank it by what it costs the people using the app, and let the user choose. `/ship-bounty` is what executes the choice.

## Where the items come from

Gather, in this order, and deduplicate:

1. **`BACKLOG.md`** — what the ship run explicitly deferred, with its evidence.
2. **The ship report itself** — anything described as deliberately left open. Check the session transcript or recent commit messages for the phrases the report used.
3. **Unfixed reviewer findings** — P2s that were logged but never acted on.
4. **Drift since the ship** — run `impeccable detect --json` over the changed files, and `git log` since the ship commit. New code written after the review has never been reviewed.
5. **Your own read of the diff** — defects that were real but never got written down anywhere.

Do not invent work to fill the list. A short honest list beats a padded one. If the ship run genuinely left nothing important, say exactly that.

## How to rank

Rank by what it does to the person using the app, not by how easy it is to fix or how it scores on a checklist.

**Sort into three bands:**

- **Costs the user something now.** Data can be lost, an action fails silently, a control is unreachable by some people, copy says something untrue, a state the app can actually reach is unhandled. These come first, always, however small the fix.
- **Costs the user something eventually.** Work that compounds: a system rule the code keeps breaking, an untested failure path, a pattern that will be copied into the next feature, a performance cliff that only shows on an older phone.
- **Costs nobody anything yet.** Cosmetic drift, a token off the scale, a nit that only a detector notices.

**Then cut the third band from the report.** Leave those items in `BACKLOG.md` and replace them with a single line carrying a count and an age: "11 cosmetic items in the backlog, oldest from three ships ago." The count makes the pile visible so it can be cleared deliberately; listing them turns this report into a lint log, and omitting them entirely lets the pile rot unseen.

Be suspicious of your own earlier reasoning. An item deferred as "deliberately left open" during a ship was deferred under time pressure; re-judge it on the evidence, not on that label.

## What to report

A numbered list. For each item, four lines at most:

1. **What is wrong**, in the user's terms, not the code's.
2. **Where** — `file:line`, or the screen and the step that reaches it.
3. **Why it matters** — the concrete consequence, not a principle.
4. **Cost to fix** — a rough size (minutes / an hour / a session) and anything it depends on.

After the list, a one-line total: how many items, roughly how long for all of them, and which single item you would do first if only one gets done.

Then stop and ask which ones to take, using `AskUserQuestion` with the top items as options and multiSelect on. Nothing after the question.

## What this command must not do

- Do not fix anything, even a one-line fix that is "right there".
- Do not re-run the full `/ship` review. If the code has not changed since the ship, the reviewers' findings are still valid; reuse them.
- Do not pad the list with anything from the third band.
- Do not report an item you have not verified still exists. Check it against the current code or the running app first, and say so if you could not.
