### Task 3: Home — hero budget + section hierarchy

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/TrustBar.jsx` (quiet styling only if needed)
- Modify: `src/components/ConsultationCTA.jsx` (panel border only)

**Interfaces:**
- Consumes: `SITE` from `src/lib/site.js` (`slogan`, `positioning`, `founder`, `founderExperienceYears`)
- Produces: First viewport = brand + slogan + one line + CTA group only; below fold order: services list → work log → trust → CTA; remove section-tag ALL-CAPS usage and icon-card services preview

- [ ] **Step 1: Extend failing test for Home hero budget**

Append to `scripts/test-command-rail-tokens.mjs`:

```js
const home = fs.readFileSync(path.join(root, 'src/pages/Home.jsx'), 'utf8')
must(home.includes('SITE.slogan'), 'Home must keep SITE.slogan')
must(!/section-tag mb-4/.test(home) || (home.match(/section-tag/g) || []).length <= 2, 'Home must not spam section-tag eyebrows')
// Prefer list structure for services preview
must(home.includes('FeaturedWork') || home.includes('work'), 'Home keeps featured work section')
```

(Adjust assertions to match real function names after edit; final assert: no `WhoWeHelp` stats-style cards in first viewport — Hero component must not render TrustBar.)

Also assert:

```js
const heroStart = home.indexOf('function Hero')
const heroEnd = home.indexOf('function WhoWeHelp')
const heroBlock = home.slice(heroStart, heroEnd === -1 ? heroStart + 2500 : heroEnd)
must(!heroBlock.includes('TrustBar'), 'TrustBar must not be inside Hero')
must(heroBlock.includes('btn-primary') || heroBlock.includes('/contact'), 'Hero has primary CTA')
```

- [ ] **Step 2: Run test — expect FAIL if TrustBar still in Hero or tags spam**

- [ ] **Step 3: Rewrite Home structure**

Keep `SEOHead`. Export default order:

```jsx
<>
  <SEOHead ... />
  <Hero />
  <ServicesPreview />   {/* rule-separated list, not icon cards */}
  <FeaturedWork />      {/* work-log rows */}
  <TrustBar />          {/* after work, not hero */}
  <Testimonials />      {/* optional keep; quiet borders */}
  <CTABanner />
</>
```

Remove or demote `TechStackSection` / `ProcessSection` / `WhoWeHelp` from default page (YAGNI for command rail) — delete from render tree (functions may be deleted to avoid dead code).

**Hero content (exact structure):**
- Wordmark img `/brand/logo-wordmark-dark.svg` (existing)
- `h1`: `SITE.slogan` (solid white, not gradient wash)
- Supporting `p`: short ops line using `SITE.positioning` or the existing production line about voice AI / CRM / field ops
- CTAs: `Link to=/contact` `.btn-primary` “Start a project”; `Link to=/portfolio` `.btn-outline` “View work”
- No stats, no badges, no cards in Hero

**ServicesPreview:** map existing service titles to a vertical list with `border-t border-line` rows; each row: title + one sentence + link to `/services`.

**FeaturedWork:** take top approved projects (existing data helper); render as rows: title | categories | outcome one-liner | link — not `ProjectCard` grid.

- [ ] **Step 4: Quiet ConsultationCTA**

In `ConsultationCTA.jsx`, replace `cta-panel` gradient classes with `border border-line bg-panel`.

- [ ] **Step 5: Run tests + browser**

Run: `node scripts/test-command-rail-tokens.mjs` → PASS  
Open `/` — first viewport brand test; scroll shows list sections.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx src/components/ConsultationCTA.jsx src/components/TrustBar.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): restructure Home for command-rail hero and work log"
```

---
