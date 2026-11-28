### Task 4: Portfolio work-log index + case study chrome

**Files:**
- Modify: `src/pages/Portfolio.jsx`
- Modify: `src/components/portfolio/ProjectCard.jsx`
- Modify: `src/pages/PortfolioCaseStudy.jsx` (sticky TOC / rule layout; keep content)

**Interfaces:**
- Consumes: `getAllProjectCards` / existing category helpers; `CategoryTabs`
- Produces: Default index layout = single-column dense list (work log); optional keep `CategoryTabs`; `ProjectCard` gains `variant="row"` for list density; case study uses border rules + sticky TOC on `lg:`

- [ ] **Step 1: Failing test for portfolio grid density**

```js
const portfolio = fs.readFileSync(path.join(root, 'src/pages/Portfolio.jsx'), 'utf8')
must(!portfolio.includes('xl:grid-cols-3'), 'Portfolio index must not use 3-column card grid as primary')
must(portfolio.includes('variant="row"') || portfolio.includes("variant='row'") || portfolio.includes('work-log'), 'Portfolio uses row/work-log presentation')
```

- [ ] **Step 2: Run — expect FAIL on `xl:grid-cols-3`**

- [ ] **Step 3: Add `row` variant to `ProjectCard.jsx`**

When `variant === 'row'`:
- Horizontal flex row: title + summary + tech chips + CTA
- `border-b border-line`, no rounded card shadow, no cover image required (optional tiny mark)
- Keep case-study vs contact link logic unchanged

- [ ] **Step 4: Update `Portfolio.jsx`**

- Remove hero gradient/grid-pattern opacity theater (use solid ink + rule under page title)
- Replace `md:grid-cols-2 xl:grid-cols-3` project grids with `flex flex-col` mapping `<ProjectCard variant="row" />`
- Featured block: at most one featured row, not large media card
- Keep filters/`CategoryTabs` behavior

- [ ] **Step 5: Case study layout**

In `PortfolioCaseStudy.jsx`:
- Desktop: `lg:grid lg:grid-cols-[12rem_1fr] gap-10` with sticky TOC links to `#brief #system #delivery #outcome` (match existing section ids or add ids)
- Hairline borders between sections; no glass cards

- [ ] **Step 6: Tests + browser**

Run: `node scripts/test-command-rail-tokens.mjs`  
Open `/portfolio` and one `/portfolio/:slug` — list density + readable case study.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Portfolio.jsx src/components/portfolio/ProjectCard.jsx src/pages/PortfolioCaseStudy.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): portfolio work-log index and case study rail"
```

---
