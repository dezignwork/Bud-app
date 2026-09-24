---
description: Design-and-ship routine, biased for speed: build, machine QA, two scoped reviewers, one deploy
---

Run the routine below for: $ARGUMENTS

A bare project name — "Bud", "Snorkel" — is a valid target, not a missing one. It means **a full pass over that project**, and choosing what that pass covers is your job, not the user's. Derive it, in this order, and state the scope in one line before you start:

1. `BACKLOG.md`, if it exists — take the highest-impact items still open.
2. Gaps between the code and `DESIGN.md` / `PRODUCT.md` — drift, undocumented patterns, states that exist in the app but nowhere in the docs.
3. Recent commits — what was rushed, what shipped without review.
4. Your own read of the app — the worst thing about using it, found by using it.

Ask what is being built only when there is genuinely nothing to go on: no backlog, no design system, no history. Everything else here you decide yourself — do not ask the user to pick tools, skills, or ordering.

This routine is tuned so that time goes into work that finds real defects, and not into logistics. Two rules carry that intent:

- **Never trade away the reviewers.** Phase 4 is where genuine defects surface. Scope it, never skip it.
- **Never pay for logistics.** One deploy, one liveness check, one report. No per-fix pushes, no polling loops, no narration between phases.
- **Run it as written.** If this session cannot invoke the routine as a slash command, read this file and follow it anyway. Never substitute a summarised or improvised version of it, and never drop a phase because a tool it names is absent — do that phase's real job with an equivalent and say which substitution you made.

**Be honest about timing.** The first run on a project also has to write the Phase 3 QA script, so it lands around 45–60 minutes. Later runs reuse that script and land around 25. Say which one this is at the start rather than promising the faster number and delivering the slower one.

## Rules that hold for the whole routine

1. **One taste authority.** Choose exactly one of: `scroll-craft` (scroll-driven marketing or landing pages), `high-end-visual-design` / `frontend-design` (app UI, dashboards, product surfaces), or a house-style skill the user names. Never combine two on one surface — their opinions about type, rhythm, and motion conflict, and the result reads as a collage.
2. **One motion system.** `scroll-craft` ships its own engine (IntersectionObserver + requestAnimationFrame). If it is the authority, do not add GSAP. Otherwise GSAP is the default. Never load both.
3. **Impeccable owns quality, not style.** Its phases run around the build, never instead of the taste skill, and never silently redesign an approved direction.
4. **Existing project wins.** If `DESIGN.md` or `.impeccable/design.json` exists, read them first and conform. Do not re-run `init` or regenerate a design system over an established one.
5. **Edits go through a patch file.** Write the edit script to your scratchpad and run it, rather than typing long replacements inline. A failed assert mid-script must not cost you the whole script.
6. Work in the project folder the user names. If none exists, propose one and create it.

## Phase 0 — Frame (keep it to a couple of minutes)

- Read `PRODUCT.md` and `DESIGN.md` if they exist and state the framing back in two lines. Do not run an interview when the answers are already on disk.
- If neither exists and the work is a new surface, run `impeccable`'s `init`. Otherwise proceed.
- Decide the platform target (web / ios / android / adaptive) and the mode (Persuade / Operate / Read / Experience). One line, no ceremony.

## Phase 1 — Direction (only for visual work)

Skip this phase entirely for a feature, a bugfix, or any change inside an established `DESIGN.md`. State that you are skipping it and why.

When the work is a new surface or a restyle:

- Gather whatever reference the user already supplied. Do not stall for more.
- **Check the `awesome-design-md` skill first.** It carries 74 ready-made systems derived from real products (`design-md/<name>/DESIGN.md`: Linear, Stripe, Vercel, Apple, Notion, Figma, Nike, Ferrari and more), each with real tokens, a type scale and component specs. Back at least one of your directions with a pack when something there fits, and say which one. If the user names a product's look, read that pack before proposing anything. A direction backed by a coherent system beats three adjectives.
- Adapt a pack, never paste it: rename the tokens to this product, drop what it does not need, and move the accent so the result is not a clone of somebody's brand. Record the lineage in the project's own `DESIGN.md`.
- Skip the library entirely when the project already has a `DESIGN.md`, or when the user has an established brand. Those win.
- Offer 2–3 named directions, one short paragraph each: type system, palette, spacing rhythm, imagery, motion character.
- **This is the routine's only mandatory stop.** Present them with `AskUserQuestion` and wait.
- Record the pick and the chosen taste authority in one line before building.

## Phase 2 — Build

- Invoke the taste authority via the Skill tool and hold it for the whole pass.
- Source components with the `21st` CLI rather than hand-rolling common patterns:
  - `21st search "<query>" --limit 5 --json` — free, use liberally.
  - `21st logo "<brand>" --json` — free.
  - `21st get <id> --json` — **metered, 2/day on free**. Check `21st usage` first. Spend it only on a structurally new component, never on something the project already solves, and never on a framework the project does not use. Retype anything sourced into the project's own tokens before it ships.
  - `21st generate` / `iterate` are not enabled. Do not call them.
- Build the real content path end to end: arrival, loading, empty, error, success. A shell with placeholder states is not a finished build.
- Respect `prefers-reduced-motion` everywhere, and keep animation on `transform` and `opacity` only.
- **Do not deploy in this phase.** Do not verify screen by screen either — that is Phase 3's job.

## Phase 3 — Machine QA (one run)

Write, or reuse, a committed QA script in the project (`scripts/qa.mjs`, `qa/smoke.mjs`, `scripts/qa.py`, whatever the project already has or the stack fits). Drive it with whatever this session actually has — a browser pane, Playwright, or headless Chrome from Bash. A missing tool is never a reason to skip the phase; do its job with the equivalent you have and name the substitution. It boots the app headless, seeds whatever identity or fixture state the app needs, walks every changed screen at the two target widths, and asserts:

- horizontal overflow (`scrollWidth > clientWidth`)
- interactive elements whose hit area, including `::after` expanders, is under 44×44
- contrast of every rendered text/background pair actually painted
- heading order, dialog roles and labelling, focus return, live regions on async status
- every state renders: loading, empty, error, success
- screenshots for each screen, written to a temp directory

Run it once. Fix everything it flags. Look at the screenshots yourself in one batch — the script catches measurements, your eyes catch collisions and clipping.

The script is committed, so the next `/ship` on this project starts with it already there. Extend it rather than rewriting it.

## Phase 4 — Two scoped reviewers (parallel, mandatory)

Spawn two isolated sub-agents in a single message. They must not see each other's work.

**Reviewer A — design review.** Reads the changed source and looks at the Phase 3 screenshots. Judges design specificity, hierarchy, cognitive load, emotional journey at destructive or high-stakes moments, and the Nielsen heuristics.

**Reviewer B — detector and measured evidence.** Runs `impeccable detect --json` over the changed files, verifies the findings against the rendered page, and reports what the detector got wrong as well as what it got right.

Both prompts must say, explicitly:

- **the scope is the diff plus everything it can reach** — any file whose tokens, class names, global selectors, or shared helpers the diff touches, whether or not that screen was edited. A new class colliding with an existing one breaks a screen the change never opened, and a screen-scoped review looks straight past it;
- only P0 and P1, ranked, each with file:line or a measured number;
- plus **up to three bullets of "notable, non-blocking"** — strategic observations that are not defects and would otherwise be filtered out by a defects-only instruction. Three is the cap, not a target;
- no essays, no praise, no restating the design system;
- do not use the parent's browser tools — drive headless Chrome from Bash instead;
- read-only: never edit the repo.

Reviewer output that is not a ranked defect list is a failed review. Ask for it again rather than synthesising around it.

## Phase 5 — Fix P0 and P1 only

- Verify each finding against the rendered page before accepting it. Detector output is evidence, not proof.
- Fix every accepted P0 and P1, using the targeted impeccable phases the findings actually name (`typeset`, `colorize`, `layout`, `clarify`, `harden`, `animate`, `adapt`) — and only those.
- Append every P2 to `BACKLOG.md` with its evidence and a one-line fix. Never drop one silently.
- Re-run the Phase 3 script once after the fixes. That is the last verification round.

## Phase 6 — Record and ship

- Update `DESIGN.md` and `.impeccable/design.json` **only where the system actually changed** — new tokens, new rules, a new component. Regenerate from scratch only when there was no design system before.
- Build, commit, push **once**. Check the deploy is live **once**. If it is not live after a reasonable wait, say so and move on rather than looping.
- **One exception:** when the diff touches data writes, auth, or a destructive action, deploy twice — once at the midpoint for a smoke check on the real thing, once at the end. Twenty fixes landing on people's phones in a single push is very hard to bisect when one of them breaks.
- Close with one report:
  - what shipped, in plain language;
  - what the reviewers found and what you fixed;
  - what went to `BACKLOG.md`;
  - anything deliberately left open, and why.

## Reporting

No narration between phases, and no per-phase status lines. The user hears from you at the Phase 1 gate (when there is one), when something needs a decision, and at the Phase 6 report. Anything else is noise.
