# Bud

A small plant-care companion: you check in, write a line, and the plant grows with you.
React + Vite, Supabase for cloud backup, deployed on Vercel. Screens: Splash, Onboarding,
Today, Mood, Journal, Grove, plus the Meditation overlay.

Read `PRODUCT.md` for what each screen does, and `DESIGN.md` for the design system. Both are
authority; conform to them rather than inventing tokens, sizes or patterns.

## Shipping work on Bud

`.claude/commands/ship.md` is the routine for building or improving anything here. **Follow
it whenever the request is to build, improve, redesign or fix a surface** — whether it arrives
as `/ship <task>`, as "run the ship routine", or as a plain request to change the app.

Some sessions do not register project-level slash commands. That changes nothing: read
`.claude/commands/ship.md` and follow it as written. Do not summarise it, do not substitute
your own sequence, and do not skip a phase because a tool it names is missing — do that
phase's actual job with whatever equivalent this session has, and say which substitution you
made.

Two companion routines live beside it: `bounty.md` (report what past runs left undone) and
`ship-bounty.md` (fix the items chosen from that report).

## Skills vendored into this repo

`.claude/skills/` carries the playbooks the routine depends on, so a session with no local
skills folder still reads the real instructions instead of improvising them:

- `impeccable/` — the critique, audit, polish, typeset, colorize, layout, clarify, harden,
  animate and adapt playbooks. Its `scripts/` binary is deliberately absent; read
  `README-VENDORED.md` for how to do the detector's job by hand.
- `high-end-visual-design/` — the taste authority for this app's UI. Hold it for a whole
  visual pass; never mix it with a second taste skill.

Read the playbook a phase names before running that phase, the same way you would if the
skill were installed.

## Verification in this repo

`npm run qa` drives `qa/smoke.mjs`, a Playwright smoke test that uses real drags and taps
rather than poking state. It covers onboarding, swipe-shuffle, pull-to-refresh, Keep, Water
(the full cycle including the drop-icon reset), Journal write/save/delete, Ploon Mode, Mood
and pot shapes, name editing, and Meditation entry and exit, with a console-error watchdog
across the run.

- **Extend this script rather than writing a new one.** It is the project's QA harness.
- Capture screenshots at 393×852 and 1100×900 and look at them yourself. Measurements catch
  numbers; eyes catch collisions and clipping.
- It covers the localStorage path only. The repo carries no real Supabase project (only
  `.env.example`), so cloud backup and sync stay untested. Say so rather than implying
  coverage you do not have.

## House rules

- Edits go through a patch file you write and run, not long inline replacements.
- `DESIGN.md` and `PRODUCT.md` get updated only where the system actually changed.
- Anything deferred goes to `BACKLOG.md` with its evidence. Never drop a finding silently.
- One deploy per run, except when the change touches data writes or a destructive action —
  then smoke it at the midpoint and deploy again at the end.
