# Task 6 Review: Dashboard shell polish

**Reviewer:** SDD read-only review  
**Base:** `d7853bfdde16cb298678c25626c7fa3315853446`  
**Head:** `fd3475d1acd4da2423f99a1805379211eef6903d`  
**Commit:** `fd3475d` — `feat(ui): align dashboard shell with command-rail system`

## CRITICAL — Auth symbols (must be unchanged)

| Symbol / path | Verdict | Evidence |
|---------------|---------|----------|
| `orchestrix_dash_secret` (`STORAGE_KEY`) | ✅ | `Dashboard.jsx` L13: `const STORAGE_KEY = 'orchestrix_dash_secret'` |
| `/api/dashboard/stats/` | ✅ | L630 (`LoginScreen` verify), L1481 (`loadAll` stats fetch) |
| `forceLogout` | ✅ | L1468 definition; L1489 on auth failure; L1535 `logout = forceLogout` |
| `setAuthed(false)` | ✅ | L1470 inside `forceLogout`; L1537 `LoginScreen` → `setAuthed(true)` on success only |

**Auth control flow:** No edits to `authHeader`, `loadAll` dependency array, axios headers, `LoginScreen` `attempt` body, or storage read/write beyond existing symbols. Diff is className / layout chrome only.

## Must-verify (reviewer checklist)

| Check | Verdict | Evidence |
|-------|---------|----------|
| Sidebar `bg-panel border-r border-line` | ✅ | Desktop + mobile aside at L1560, L1600 |
| Active nav: cyan left rail, no SaaS pill | ✅ | `border-l-2 border-cyan-500`, `text-cyan-400 bg-transparent`; no `bg-primary-500/15 text-primary-400` in file |
| Shell `bg-ink` (replaces `bg-dark-950` on shell/login) | ✅ | Main shell L1556; login L654 |
| Widget surfaces `border border-line bg-panel rounded-md` | ✅ | Stat cards, CRUD shells, analytics panels, tables |
| Denser visitor table | ✅ | Header/cells `px-3 py-2`; path `text-xs` |
| Token test includes Task 6 auth + shell asserts | ✅ | Eight new `must(...)` blocks in `test-command-rail-tokens.mjs` |

## Return spec (task brief)

| Requirement | ✅/❌ |
|-------------|------|
| Modify `Dashboard.jsx` — classNames / layout chrome only | ✅ |
| Do **not** alter auth control flow | ✅ |
| Outer shell `bg-ink` / panel tokens | ✅ |
| Sidebar `bg-panel border-r border-line` | ✅ |
| Active nav cyan left border, drop pill wash | ✅ |
| Stat/widgets `border border-line bg-panel rounded-md` | ✅ |
| Auth safety: `orchestrix_dash_secret`, stats API, logout path | ✅ |
| Step 5: re-run token test + auth asserts — PASS | ✅ |
| Scope: `Dashboard.jsx`, `test-command-rail-tokens.mjs` | ✅ |

**Overall spec:** ✅ — Visual shell aligns with command-rail tokens; auth contract preserved.

## Strengths

1. **Scoped diff** — 118 line edits are overwhelmingly `className` swaps (`border-line`, `bg-panel`, `rounded-md`, `bg-ink`); no structural or data-flow changes.

2. **Nav treatment** — Desktop and mobile sidebars share the same cyan left-rail active state; removes primary-tinted pill that read as generic SaaS.

3. **Regression harness** — Auth trio plus sidebar/nav/panel asserts lock the “no auth drift” rule into CI-friendly `node scripts/test-command-rail-tokens.mjs`.

4. **Density** — Visitor log table padding and typography tightened without changing columns or fetch logic.

5. **Header simplification** — Sticky top bar drops `backdrop-blur-xl` / translucent stack for flat `bg-ink` + `border-line`.

## Issues

### Critical

*None.*

### Important

*None.*

### Minor

1. **Partial token sweep** — Modals and form inputs inside CRUD still use `border-white/[…]` in places (report acknowledges); consistent with “remove heavy panels where easy,” not full dashboard token pass.

2. **Login shell styling** — Login card uses panel/line tokens only; brief Step 4 browser smoke on `/dashboard` was run in implementation but not re-executed in this read-only review (curl 401 JSON cited in report).

3. **StatCard icon chips** — Inner icon wells still use `*-500/10` tinted backgrounds; outer card matches panel spec; acceptable for functional color coding.

4. **Automated vs visual** — Token test PASS re-verified here; no live browser pass in this review.

## Verification

```text
node scripts/test-command-rail-tokens.mjs
→ PASS command-rail tokens
```

Grep: `orchestrix_dash_secret`, `/api/dashboard/stats/`, `forceLogout`, `setAuthed` — all present.  
Nav: `bg-primary-500/15` absent from `Dashboard.jsx`.

## Task quality

**Approved**

Task 6 meets the dashboard shell polish brief with auth symbols and logout/stats paths intact. Safe to proceed; optional follow-up: inner input borders to `border-line` and a quick browser check on login + authed shell.