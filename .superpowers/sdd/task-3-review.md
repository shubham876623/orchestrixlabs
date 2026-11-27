# Task 3 Review: Home — hero budget + section hierarchy

**Reviewer:** SDD read-only review  
**Base:** `8134b05fc8d78c82ffb645dec935a4bdf9eb8585`  
**Head:** `fe093343a3ab7ad2c0cde37a406020ed5750400a`  
**Commit:** `fe09334` — `feat(ui): restructure Home for command-rail hero and work log`

## Global constraints (command-rail)

| Constraint | Verdict | Notes |
|------------|---------|-------|
| First viewport: brand + slogan + one line + CTA only | ✅ | Wordmark, solid `SITE.slogan` h1, single ops line, dual CTAs; hero-gradient / grid-pattern / motion stack removed |
| No stats / cards in hero | ✅ | No badges, stats, or card shells in `Hero` |
| TrustBar not in Hero | ✅ | `TrustBar` rendered after `FeaturedWork` in page tree |
| Services as rule list | ✅ | `border-t border-line` rows; no icon-card grid |
| Work log not card grid | ✅ | `FeaturedWork` uses row list + `getHomepageFeaturedProjects`; `ProjectCard` removed from Home |
| Keep `SITE.slogan` | ✅ | h1 binds `{SITE.slogan}`; token test asserts presence |
| Cyan signal only | ⚠️ Partial | Links/focus use cyan appropriately; testimonial stars remain `text-amber-400` (conventional rating affordance, not marketing glow) |

## Return spec (task brief)

| Requirement | ✅/❌ |
|-------------|------|
| Hero: wordmark + solid white `SITE.slogan` + one line + CTAs (“Start a project” / “View work”) | ✅ |
| Hero: no stats, badges, cards, TrustBar, gradient h1 | ✅ |
| Page order: Hero → Services → Work → Trust → Testimonials → CTA | ✅ |
| `ServicesPreview`: rule-separated list (not icon cards) | ✅ |
| `ServicesPreview`: row links to `/services` | ❌ |
| `FeaturedWork`: work-log rows (title · categories · outcome · link) | ✅ |
| Remove `WhoWeHelp` / `TechStackSection` / `ProcessSection` from render | ✅ |
| Remove section-tag spam on Home source | ✅ |
| `TrustBar`: quiet token styling | ✅ |
| `ConsultationCTA`: `border border-line bg-panel` (no `cta-panel`) | ✅ |
| TDD: Home hero / order assertions in `test-command-rail-tokens.mjs` | ✅ |
| Token test PASS | ✅ |
| Scope: `Home.jsx`, `TrustBar.jsx`, `ConsultationCTA.jsx`, test script | ✅ (FAQ unchanged; see Issues) |

**Overall spec:** ⚠️ Partial — core restructure and hero budget match the brief; **service row destinations** do not.

## Strengths

1. **Hero budget discipline** — Large deletion of motion wrappers, decorative gradients, and nested copy yields a clean command-rail above-the-fold: brand, slogan, one supporting line, CTAs only.

2. **Section hierarchy** — Render order matches the brief (`Hero` → `ServicesPreview` → `FeaturedWork` → `TrustBar` → `Testimonials` → `CTABanner`), with TrustBar correctly demoted below work.

3. **List-native sections** — Services and featured work read as operational logs (rule borders, baseline grids, muted arrows) instead of marketing card grids; aligns with global “work log” intent.

4. **Token-aligned chrome** — `TrustBar` drops per-badge brand colors, blur, and tinted borders; `ConsultationCTA` uses flat `panel`/`line` shell.

5. **Regression harness** — New Home assertions (hero block scan, section order indices, removed section functions, CTA panel classes) encode the restructure cheaply; verified locally: `PASS command-rail tokens`.

6. **Dead-code reduction** — Removing unused framer-motion section machinery, tech/process blocks, and `ProjectCard` from Home shrinks bundle surface (~376 lines removed in `Home.jsx` per diff stat).

## Issues

### Critical

*None.*

### Important

1. **Service row URLs vs brief** — Brief: each services row should link to **`/services`**. Implementation links each row to **`SERVICE_PORTFOLIO_LINKS`** category URLs on `/portfolio`. Section head “All services” → `/services` is correct; row-level contract is not. Fix: point rows at `/services` (optionally with hash/slug) or update brief if portfolio deep-links are intentional.

2. **`FAQSection` on Home** — Not in the brief’s target render tree; remains between `Testimonials` and `CTABanner`. Retention may be intentional for SEO (`SEOHead` still passes `faq`), but it reintroduces **pre-command-rail** patterns on the same page (`section-tag`, `gradient-text`, `card` accordion in `FAQSection.jsx`). Either remove from Home, restyle FAQ in a follow-up task, or document as accepted exception.

3. **No browser / viewport check** — Report notes missing visual verification of first-viewport hero budget and scroll hierarchy. Recommend quick `/` pass before calling Task 3 fully closed.

### Minor

1. **UTF-8 BOM** — Diff shows BOM (`﻿`) prepended on `Home.jsx`, `TrustBar.jsx`, and `ConsultationCTA.jsx` imports; harmless at runtime but noisy for diffs and some tooling.

2. **Test gaps** — Order assertion does not account for `FAQSection`; no assertion for services row `to="/services"`; no guard against re-adding hero `gradient-text` outside the sliced hero block if structure changes.

3. **Testimonials layout** — Still a 2-column bordered grid (not card components). Acceptable relative to brief; slightly denser than “quiet borders” ideal.

4. **Supporting line copy** — Uses a fixed production line rather than `SITE.positioning`; brief allowed either; no functional issue.

## Verification

```text
node scripts/test-command-rail-tokens.mjs
→ PASS command-rail tokens
```

Source review: `Hero` contains no `TrustBar`, `gradient-text`, or `section-tag`; page export order matches token test sequence with additional `FAQSection` insert.

## Task quality

**Changes requested**

Approve the hero budget, section order, list sections, and quiet trust/CTA styling after resolving **service row links** (brief says `/services`) and confirming **FAQ placement/styling** on Home. No critical blockers; fixes are small and localized.

---

# Task 3 Re-review (post-fix)

**Reviewer:** SDD read-only review  
**Base:** `8134b05fc8d78c82ffb645dec935a4bdf9eb8585`  
**Head:** `7320d84fc6148f05af3c55fda6281af1275dc2b2`  
**Commits:** `fe09334` + `7320d84` — `fix(ui): point Home services rows to /services and quiet FAQ`

## Prior issues — verification

| Issue | Status | Evidence |
|-------|--------|----------|
| Service row URLs → `/services` | **Fixed** | `SERVICE_PORTFOLIO_LINKS` removed; each `ServicesPreview` row uses `to="/services"` |
| FAQ on Home (pre-command-rail styling) | **Fixed (quiet)** | `FAQSection.jsx` uses `section-shell`, rule-separated `border-line` list; no `section-tag`, `gradient-text`, `card`, or framer-motion |

## Return spec (task brief)

| Requirement | ✅/❌ |
|-------------|------|
| Hero: wordmark + solid white `SITE.slogan` + one line + CTAs (“Start a project” / “View work”) | ✅ |
| Hero: no stats, badges, cards, TrustBar, gradient h1 | ✅ |
| Page order: Hero → Services → Work → Trust → Testimonials → CTA | ✅ (FAQ inserted before CTA; not in brief tree but quieted) |
| `ServicesPreview`: rule-separated list (not icon cards) | ✅ |
| `ServicesPreview`: row links to `/services` | ✅ |
| `FeaturedWork`: work-log rows (title · categories · outcome · link) | ✅ |
| Remove `WhoWeHelp` / `TechStackSection` / `ProcessSection` from render | ✅ |
| Remove section-tag spam on Home source | ✅ |
| `TrustBar`: quiet token styling | ✅ |
| `ConsultationCTA`: `border border-line bg-panel` (no `cta-panel`) | ✅ |
| TDD: Home hero / order assertions in `test-command-rail-tokens.mjs` | ✅ |
| Token test PASS | ✅ |
| Scope + follow-up: FAQ command-rail quiet styling | ✅ |

**Overall spec:** ✅

## Residual notes (non-blocking)

1. **FAQ placement** — Still rendered on Home (`Testimonials` → `FAQSection` → `CTABanner`) for `SEOHead` FAQ schema; styling now matches command-rail. Acceptable given “quiet or removed.”
2. **Test gaps** — Harness still does not assert `to="/services"` on service rows or `FAQSection` in order; prior minor items (BOM on some imports, no browser viewport check) unchanged.
3. **Testimonials** — Amber star icons remain (rating affordance).

## Verification

```text
node scripts/test-command-rail-tokens.mjs
→ PASS command-rail tokens
```

## Task quality

**Approved**