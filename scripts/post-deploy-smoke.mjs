#!/usr/bin/env node
/**
 * Post-deploy smoke for soft launch. Does not mutate data except optional CONTACT_TEST=1.
 */
const BASE = process.env.SITE_URL || 'https://orchestrixlabs.com'
const API = process.env.API_URL || 'https://orchestrixlabsbackend-production.up.railway.app'

const paths = [
  '/',
  '/services',
  '/portfolio',
  '/work-history',
  '/about',
  '/reviews',
  '/contact',
  '/portfolio/ai-estimating-field-ops',
  '/portfolio/restaurant-voice-ordering',
  '/og-image.jpg',
]

const needles = [
  'restaurant-voice-ordering',
  'portfolioDraftCatalog',
  'DRAFT_ONLY_PROJECTS',
  'illustrative demo data',
  'prj-2026-001',
]

async function get(url) {
  const res = await fetch(url, { redirect: 'follow' })
  const text = await res.text()
  return { status: res.status, text, headers: res.headers }
}

const results = []

for (const p of paths) {
  const { status, text } = await get(`${BASE}${p}`)
  results.push({ check: `route ${p}`, ok: status >= 200 && status < 400, detail: `status=${status} len=${text.length}` })
}

const home = await get(`${BASE}/`)
results.push({
  check: 'slogan in title/html',
  ok: /Engineering Intelligence\. Automating Growth/.test(home.text),
  detail: 'home html',
})

const og = home.text.match(/property="og:image"[^>]*content="([^"]+)"/i)
  || home.text.match(/content="([^"]+)"[^>]*property="og:image"/i)
results.push({ check: 'og:image meta', ok: Boolean(og), detail: og?.[1] || 'missing' })

const assetRe = /\/assets\/[^"']+\.js/g
const assets = [...new Set(home.text.match(assetRe) || [])]
let leak = null
for (const a of assets) {
  const { text } = await get(`${BASE}${a}`)
  for (const n of needles) {
    if (text.includes(n)) {
      leak = `${a} contains ${n}`
      break
    }
  }
  if (leak) break
}
results.push({
  check: 'production JS excludes drafts',
  ok: !leak && assets.length > 0,
  detail: leak || `scanned ${assets.length} assets`,
})

const approved = await get(`${BASE}/portfolio/ai-estimating-field-ops`)
results.push({
  check: 'approved case study reachable',
  ok: approved.status === 200 && /Estimating|All Cleared|field/i.test(approved.text),
  detail: `status=${approved.status}`,
})

const draft = await get(`${BASE}/portfolio/restaurant-voice-ordering`)
// SPA may still 200 shell; check linked publishedProjects chunk preference via home assets already
results.push({
  check: 'draft slug not in homepage JS graph',
  ok: !leak,
  detail: `shell status=${draft.status}`,
})

const projects = await get(`${API}/api/projects/?page=1`)
let apiOk = false
let apiDetail = `status=${projects.status}`
try {
  const j = JSON.parse(projects.text)
  const first = j.results?.[0] || j[0]
  const count = j.count ?? j.results?.length
  const hasFin = first && ('project_value' in first || 'hours_worked' in first)
  apiOk = projects.status === 200 && count === 147 && !hasFin
  apiDetail = `count=${count} financials=${hasFin}`
} catch (e) {
  apiDetail = e.message
}
results.push({ check: 'Work History API 147 + no financials', ok: apiOk, detail: apiDetail })

const ogImg = await get(`${BASE}/og-image.jpg`)
results.push({
  check: 'og-image.jpg served',
  ok: ogImg.status === 200 && ogImg.text.length > 1000,
  detail: `status=${ogImg.status} len=${ogImg.text.length}`,
})

const dash = await get(`${API}/api/dashboard/stats/`)
results.push({
  check: 'dashboard protected without auth',
  ok: dash.status === 401 || dash.status === 403,
  detail: `status=${dash.status}`,
})

// Edge-stamp canary: the backend reports which client-identity rule matched.
// Through orchestrixlabs.com it must be 'edge', or every visitor shares one rate-limit bucket.
const stamped = await get(`${BASE}/api/site-stats/`)
const clientSource = stamped.headers.get('x-orx-client-source')
results.push({
  check: 'Vercel edge stamp reaches the backend',
  ok: clientSource === 'edge',
  detail: clientSource === 'edge'
    ? 'x-orx-client-source=edge'
    : `x-orx-client-source=${clientSource} - Vercel edge stamp missing: check EDGE_PROXY_SECRET in Vercel and Railway, then redeploy Vercel`,
})

console.log('=== Post-deploy smoke ===')
let failed = 0
for (const r of results) {
  const mark = r.ok ? 'PASS' : 'FAIL'
  if (!r.ok) failed += 1
  console.log(`${mark}  ${r.check} — ${r.detail}`)
}
console.log(`---\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
