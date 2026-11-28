### Task 7: Remaining public pages light pass + acceptance

**Files:**
- Modify: `src/pages/About.jsx`, `src/pages/Reviews.jsx`, `src/pages/PortfolioWorkHistory.jsx`, `src/pages/PrivacyPolicy.jsx` (class/token alignment only; no content rewrite)
- Modify: `docs/superpowers/specs/2026-11-24-orchestrix-command-rail-design.md` status → Implemented (partial/complete)

**Interfaces:**
- Consumes: Shared tokens/primitives
- Produces: No page left on old glass/glow hero patterns; acceptance checklist signed off locally

- [ ] **Step 1: Sweep anti-patterns**

Search and remove obvious `glow`, `backdrop-blur-2xl`, `hero-gradient grid-pattern` theater from About/Reviews/Work History headers where present. Keep content.

Run:

```bash
rg -n "glow-cyan|backdrop-blur-2xl|section-tag mb-4 inline-flex" src/pages
```

Expected after fix: few or zero matches in marketing pages (Privacy may keep dense legal layout).

- [ ] **Step 2: Full token test**

Run: `node scripts/test-command-rail-tokens.mjs` → PASS

- [ ] **Step 3: Acceptance checklist (manual)**

- [ ] `/` first viewport: logo + slogan dominate; no stats/cards  
- [ ] `/portfolio` reads as work log  
- [ ] `/services` linear blocks  
- [ ] `/contact` form works  
- [ ] `/dashboard` login UI shows; API still JSON 401  
- [ ] Mobile width ~390px usable  
- [ ] Keyboard Tab shows focus rings on CTAs  

- [ ] **Step 4: Commit**

```bash
git add src/pages/About.jsx src/pages/Reviews.jsx src/pages/PortfolioWorkHistory.jsx src/pages/PrivacyPolicy.jsx docs/superpowers/specs/2026-11-24-orchestrix-command-rail-design.md
git commit -m "feat(ui): finish command-rail pass on remaining public pages"
```

- [ ] **Step 5: Stop — ask user before production deploy**

Do **not** `git push` / Vercel deploy unless user explicitly requests.

---
