### Task 6: Dashboard shell polish (no auth changes)

**Files:**
- Modify: `src/pages/Dashboard.jsx` (classNames / layout chrome only)

**Interfaces:**
- Consumes: Existing `STORAGE_KEY`, `authHeader`, `loadAll`, `forceLogout` logic — **do not alter auth control flow**
- Produces: Sidebar `bg-panel border-r border-line`; active nav `text-cyan-400 bg-transparent border-l-2 border-cyan-500`; denser tables; remove heavy `rounded-2xl` glow panels where easy

- [ ] **Step 1: Safety test — auth symbols still present**

```js
const dash = fs.readFileSync(path.join(root, 'src/pages/Dashboard.jsx'), 'utf8')
must(dash.includes("orchestrix_dash_secret"), 'Dashboard auth storage key unchanged')
must(dash.includes('forceLogout') || dash.includes('setAuthed(false)'), 'Dashboard logout path remains')
must(dash.includes('/api/dashboard/stats/'), 'Dashboard still calls stats API')
```

- [ ] **Step 2: Run — must PASS before visual edits (baseline)**

- [ ] **Step 3: Visual-only class updates**

- Outer shell: `bg-ink` / `bg-dark-950`  
- Sidebar: `bg-panel border-r border-line`  
- Active page button: left cyan border, no `bg-primary-500/15` pill wash if it reads as SaaS  
- Stat cards: `border border-line bg-panel rounded-md` (keep structure)  
- Do **not** change `loadAll`, `LoginScreen` attempt logic, axios usage, or storage key

- [ ] **Step 4: Browser auth smoke**

Open `/dashboard` — login screen renders.  
Run: `curl.exe -s -o NUL -w "%{http_code} %{content_type}\n" http://127.0.0.1:5173/api/dashboard/stats/`  
Expected: `401` and `application/json` (via Vite proxy)

- [ ] **Step 5: Re-run token test + auth asserts — PASS**

- [ ] **Step 6: Commit**

```bash
git add src/pages/Dashboard.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): align dashboard shell with command-rail system"
```

---
