# Vendored: impeccable playbooks

These are the reference playbooks from the `impeccable` skill, copied into this repo so that
any session working on Bud — including cloud containers with no access to a local skills
folder — reads the real instructions rather than improvising them.

**What is here:** `SKILL.md` and `reference/*.md` — the critique, audit, polish, typeset,
colorize, layout, clarify, harden, animate and adapt playbooks, plus the craft floor.

**What is not here:** `scripts/`, which carries a 14MB self-contained binary. That binary
provides `impeccable detect`, a mechanical scan for values drifting outside `DESIGN.md`.

**Substituting for the detector.** Where a playbook says to run `impeccable detect`, do the
same job by hand:

- grep the changed files for literal colors, font sizes, radii and spacing values, and
  compare each against the token scales in `DESIGN.md`;
- measure the rendered page with Playwright (`qa/smoke.mjs`) rather than trusting the source:
  contrast of painted pairs, hit-area sizes, overflow, heading order;
- treat a finding as evidence, not proof — verify it on the rendered screen before accepting it.

Say which substitution you made, in the report.

Upstream: the `impeccable` skill, installed per-machine at `~/.claude/skills/impeccable`.
When that skill updates, refresh this copy rather than editing it in place.
