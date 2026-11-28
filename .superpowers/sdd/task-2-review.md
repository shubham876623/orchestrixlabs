# Task 2 Review: Navbar + Footer chrome

**Reviewer:** SDD read-only review  
**Base:** `4bebe3697dd3d020be30783de806773c83fd13d4`  
**Head:** `8134b05fc8d78c82ffb645dec935a4bdf9eb8585`  
**Commit:** `8134b05` — `feat(ui): restyle navbar and footer to command-rail chrome`

## Global constraints (command-rail)

| Constraint | Verdict | Notes |
|------------|---------|-------|
| Keep logo / slogan / cyan signal | ✅ | `BrandLogo` retained; active nav + footer consultation link use `text-cyan-400`; focus rings `ring-cyan-400`; social hover `border-cyan-400/40` |
| Sparse nav + one primary CTA | ⚠️ Partial | Primary `btn-primary` → `/contact` preserved; **7 desktop nav links unchanged** (brief required keeping `navLinks`). **Upwork** remains a secondary bordered CTA—consistent with brief, not a sole-header-CTA layout |
| No glass / glow | ✅ | Logo drop-shadow removed; no `backdrop-blur-2xl` / `shadow-xl` on header or mobile drawer; `layoutId` pill glow removed |
| Utility footer | ✅ | No newsletter/subscribe; panel shell + link columns / legal / social only; decorative pulse on availability dot removed |

## Return spec (task brief)

| Requirement | ✅/❌ |
|-------------|------|
| Consume Task 1 `panel` / `line` (and related) tokens in chrome | ✅ |
| Fixed header: scrolled `bg-panel/95 border-b border-line` | ✅ |
| No logo cyan drop-shadow | ✅ |
| One primary Contact CTA (`Contact` / `/contact`) | ✅ |
| Footer utility-only (no newsletter collage) | ✅ |
| Unscrolled header: `py-4 bg-ink/80` (no heavy glass) | ✅ |
| Active nav: `text-cyan-400` + accent bar, not pill glow | ✅ |
| Trim header entrance motion (`initial={false}`) | ✅ |
| Footer: `bg-panel border-t border-line`, `text-copy` / `text-mute` | ✅ |
| TDD: chrome assertions in `test-command-rail-tokens.mjs` | ✅ |
| Token test PASS (verified locally) | ✅ |
| Scope: Navbar, Footer, test script only | ✅ |

**Overall spec:** ✅ (brief interfaces and steps satisfied)

## Strengths

1. **Faithful command-rail chrome** — Header and mobile menu use flat `panel` / `ink` / `line` surfaces with no blur stack or logo glow; matches the stated “produces” contract in the brief.

2. **Regression tests** — Four source-level assertions (drop-shadow, `backdrop-blur-2xl`, Contact CTA, footer newsletter) give cheap guards against reintroducing glass/glow and footer bloat.

3. **Active-state design** — Desktop left-bar + `text-cyan-400` and mobile `border-l-2` replace the Framer `layoutId` pill; cyan is used as signal, not ambient glow.

4. **Motion discipline** — Dropping the `y: -80` header entrance avoids competing with the hero; mobile drawer transition shortened to `0.2s`.

5. **Footer token alignment** — Slate/white opacity stacks replaced with `text-mute` / `text-copy` / `border-line`; social chips use `bg-ink` without primary gradient hover.

6. **Process** — Report documents fail → pass TDD path, build, and browser checks; single focused commit.

## Issues

### Critical

*None.*

### Important

1. **Global vs brief on header actions** — Global guidance calls for “one primary CTA”; implementation still shows **Upwork + Request Consultation** on desktop and mobile. The brief explicitly kept Upwork and did not require removal—**acceptable for Task 2**, but product should confirm whether a later task should demote or relocate Upwork for a sparser rail.

2. **“Sparse nav” unchanged** — Seven primary nav items remain. Restyling improves visual noise but not link count; any true sparsity belongs to a nav IA task, not this chrome task.

### Minor

1. **Test coverage gaps** — Assertions do not guard against `shadow-xl`, `backdrop-blur` variants on mobile, or scrolled/unscrolled class strings (e.g. `bg-ink/80`). Current code is clean; optional follow-up assertions would harden regressions.

2. **CTA label inconsistency** — Nav link “Contact” vs button/footer “Request Consultation” (same route)—pre-existing; harmless but slightly redundant in the header cluster.

3. **Footer legal bar density** — Utility scope is met, but the bottom row still packs privacy, cookies, availability, and consultation link; acceptable for a marketing site footer.

4. **Dev HMR note** — Report mentions intermittent `@apply text-copy` errors on dev; out of scope for Task 2 if `npm run build:review` passes (as reported).

## Verification

```text
node scripts/test-command-rail-tokens.mjs
→ PASS command-rail tokens
```

Manual grep on `Navbar.jsx` / `Footer.jsx`: no `drop-shadow`, `backdrop-blur`, or `shadow-xl` in Task 2 files.

## Task quality

**Approved**

Task 2 meets the SDD brief, encodes key regressions in the token test, and aligns navbar/footer with command-rail tokens and no-glass/no-glow constraints. Remaining items are product/IA follow-ups (nav count, secondary Upwork CTA) and optional test hardening—not blockers for this task.