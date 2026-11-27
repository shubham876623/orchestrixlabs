# Task 1 Review: Design tokens + primitive CSS

**Reviewer:** Task-scoped gate  
**Base:** `734c54d67481b37db71fad0227527f64891f1b39`  
**Head:** `4bebe3697dd3d020be30783de806773c83fd13d4`  
**Scope:** `tailwind.config.js`, `src/index.css`, `scripts/test-command-rail-tokens.mjs`

---

## 1. Spec compliance: ✅

| Requirement | Status |
|-------------|--------|
| Semantic Tailwind colors `ink`, `panel`, `line`, `copy`, `mute` with spec hex | Met |
| `dark.950` / `900` / `800` → `#070B12`, `#0E1520`, `#1C2736` | Met |
| `:root` vars `--orch-ink` … `--orch-mute` (+ `--orch-signal` per brief snippet) | Met |
| `.btn-primary` flat cyan, no gradient/shadow/lift | Met |
| `.btn-outline` uses `border-line` / `text-copy`, no cyan glow wash | Met |
| `.section-tag` quiet label, no uppercase / wide tracking | Met |
| `.gradient-text` → solid white | Met |
| Remove `.glow` / `.glow-cyan` | Met (no `src/` usages) |
| `.cta-panel` → `bg-panel border border-line` | Met |
| `.hero-gradient` → single restrained ink radial | Met |
| `body` → `text-copy` on dark path | Met |
| `scripts/test-command-rail-tokens.mjs` per brief | Met |
| TDD: fail then pass (per report) | Credibly documented |
| Commit message and file set | Met |
| **Global constraints:** no `middleware.js` / API proxy / auth changes | Met (diff touches 3 files only) |

**Gaps**

- **Brief Step 6 (manual dev smoke):** Report used `npm run build` instead of `npm run dev` + browser check on `127.0.0.1:5173`. Build passing is reasonable proxy for this token-only change, but the brief’s explicit step was not executed.
- **Incomplete primitive pass (expected deferral):** `.card`, `.glass`, `::selection` (indigo), `.section-sub` (`text-slate-400`), and hover cyan on `.card` remain legacy styling. Not enumerated as Task 1 edits except where noted above; acceptable for a tokens task but leaves visual inconsistency until later tasks.

**Extras**

- Rebased entire `primary` scale to cyan (brief Step 3 snippet requires this; broader than “CTAs only” but spec-aligned).
- `--orch-signal` in CSS (brief includes it).

---

## 2. Strengths

- **TDD discipline:** Token test matches the brief verbatim; assertions target the highest-risk regressions (hex mapping, CSS vars, forbidden btn gradient, glow, section-tag caps).
- **Focused diff:** 69 insertions / 41 deletions across exactly the three files named in the brief—no scope creep.
- **Brand constraints respected:** Removed glow utilities, gradient primary CTA, indigo hero blob, and eyebrow-style section tags; cyan remains the intentional signal on buttons and focus rings.
- **Motion hygiene:** Replaced `transition-all` + hover translate on buttons with `transition-colors`—aligns with “restrained UI” without adding page-load motion.
- **Honest report:** Self-review calls out `primary-*` hue shift, skipped dev smoke, and follow-ups (`::selection`, `.section-tag` visual grouping).

---

## 3. Issues

### Critical

- None identified for Task 1 scope.

### Important

1. **Site-wide `primary` palette is now cyan.** Any existing `bg-primary-*`, `text-primary-*`, or `ring-primary-*` (e.g. skip-link `focus:bg-primary-500`) renders cyan immediately, not only new CTAs. Matches the brief’s tailwind snippet but increases blast radius until component tasks audit indigo semantics.
2. **Brief Step 6 not done.** For a gate that treats the brief checklist as acceptance criteria, manual visual smoke is an open verification item (low functional risk given static CSS + green build).

### Minor

1. **Test file:** No trailing newline at EOF in `scripts/test-command-rail-tokens.mjs` (diff artifact).
2. **Test coverage gaps (acceptable for Task 1):** Does not assert `copy`/`mute` hex in Tailwind or presence of `--orch-signal`; does not guard against reintroduction of `.glow-cyan`.
3. **Residual indigo / glass patterns:** `::selection` rgba indigo; `.glass` and `.card` unchanged—consistent with report, mismatched against `line`/`panel` until Task 2+.
4. **`.section-tag` styling reduction:** Pill border/background removed; pages may look flatter until markup or a variant is added in later tasks.

---

## 4. Task quality: **Approved**

Implementation matches the task brief’s deliverables and interfaces. Residual risks are documented, scoped to follow-on work, and do not block Task 1. Recommend completing Brief Step 6 dev smoke when convenient and tracking `primary-*` / surface primitive cleanup in the next UI tasks—not as a rework condition for this commit.