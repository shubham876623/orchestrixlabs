# Task 1 Report: Design tokens + primitive CSS

## Status

**DONE**

## Commit

| SHA | Subject |
|-----|---------|
| `4bebe36` | feat(ui): add command-rail design tokens and button primitives |

## TDD log

| Step | Action | Result |
|------|--------|--------|
| 1 | Created `scripts/test-command-rail-tokens.mjs` per brief | — |
| 2 | `node scripts/test-command-rail-tokens.mjs` | **FAIL** (11 assertions: missing hex tokens, CSS vars, gradient/glow/section-tag) |
| 3–4 | Updated `tailwind.config.js` and `src/index.css` | — |
| 5 | `node scripts/test-command-rail-tokens.mjs` | **PASS** `command-rail tokens` |
| 6 | `npm run build` | **PASS** (Vite + prerender, no errors) |
| 7 | Git commit on `feat/command-rail-ui` | `4bebe36` |

## Changes summary

### `tailwind.config.js`

- Added semantic colors: `ink`, `panel`, `line`, `copy`, `mute` (spec hex values).
- Remapped `dark.950` / `900` / `800` to `#070B12`, `#0E1520`, `#1C2736`.
- Rebased `primary` scale to cyan signal palette (compatibility keys retained; fills intended to use cyan).

### `src/index.css`

- `:root` CSS variables: `--orch-ink`, `--orch-panel`, `--orch-line`, `--orch-copy`, `--orch-mute`, `--orch-signal`.
- `body`: `text-copy` instead of `text-slate-100`.
- `.btn-primary`: flat `bg-cyan-600`, no gradient/shadow/lift.
- `.btn-outline`: `border-line`, `text-copy`, muted hover (no cyan glow wash).
- `.section-tag`: quiet `text-mute` label (no uppercase / wide tracking).
- `.gradient-text`: solid `text-white`.
- `.cta-panel`: `bg-panel border border-line`.
- `.hero-gradient`: single restrained ink radial (indigo blob removed).
- Removed `.glow` and `.glow-cyan` utilities.

### `scripts/test-command-rail-tokens.mjs`

- Static file assertions for token presence and forbidden legacy patterns (no runtime dependency).

## Self-review

| Area | Assessment |
|------|------------|
| Brief adherence | All listed file edits and commit message match the task brief verbatim. |
| Test coverage | Assertions cover Tailwind hex mapping, CSS vars, btn gradient, glow, section-tag caps. |
| Regression risk | `primary-*` classes site-wide now resolve to cyan; pages still using indigo semantics will shift hue until later tasks refactor components. |
| Dead classes | No `glow` / `glow-cyan` usages under `src/` (grep clean). |
| Light mode | Existing `html:not(.dark)` overrides unchanged; dark tokens apply via `dark` class path. |

## Concerns / follow-ups for later tasks

1. **`::selection`** still uses `rgba(99, 102, 241, 0.3)` (legacy indigo); consider `--orch-signal` in a polish pass.
2. **`.section-tag`** lost pill border/background; page tasks may need explicit markup or a variant if labels should remain visually grouped.
3. **`.card` / `.glass`** still use `white/[0.08]` borders; not in Task 1 scope but will look mismatched against `line` until Task 2+ refactors surfaces.
4. **Dev visual smoke** (brief Step 6): build verified; manual `npm run dev` + browser check not run in this session.

## Commands for verification

```bash
node scripts/test-command-rail-tokens.mjs
npm run build
```

## Branch

`feat/command-rail-ui`