import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'tmp-lcp-diagnose.json')

const rLh = spawnSync(
  'npx',
  [
    '--yes',
    'lighthouse',
    'http://127.0.0.1:4173/',
    '--only-categories=performance',
    '--form-factor=mobile',
    '--screenEmulation.mobile',
    '--throttling-method=simulate',
    '--output=json',
    '--output-path=tmp-lcp-diagnose.json',
    '--chrome-flags=--headless --no-sandbox',
    '--quiet',
  ],
  { cwd: root, stdio: 'inherit', shell: true }
)
if ((rLh.status ?? 1) !== 0) {
  console.error('lighthouse failed', rLh.status)
  process.exit(rLh.status ?? 1)
}

const r = JSON.parse(fs.readFileSync(out, 'utf8'))
const m = r.audits

const lcpInsight = m['lcp-breakdown-insight']?.details?.items || []
const network = (m['network-requests']?.details?.items || [])
  .map((i) => ({
    url: (i.url || '').replace('http://127.0.0.1:4173', ''),
    type: i.resourceType,
    start: Math.round(i.networkRequestTime || 0),
    end: Math.round(i.networkEndTime || 0),
    size: i.resourceSize,
    priority: i.priority,
  }))
  .sort((a, b) => a.start - b.start)
  .slice(0, 25)

const renderBlocking = m['render-blocking-resources']?.details?.items
  || m['render-blocking-insight']?.details?.items
  || []

const unused = m['unused-javascript']?.details?.items?.slice?.(0, 8) || []

const summary = {
  scores: { perf: r.categories.performance.score },
  metrics: {
    FCP: m['first-contentful-paint']?.displayValue,
    LCP: m['largest-contentful-paint']?.displayValue,
    TBT: m['total-blocking-time']?.displayValue,
    CLS: m['cumulative-layout-shift']?.displayValue,
    SI: m['speed-index']?.displayValue,
  },
  lcpInsight,
  renderBlocking,
  unusedJs: unused.map((i) => ({
    url: (i.url || '').slice(-80),
    wasted: i.wastedBytes,
  })),
  bootup: m['bootup-time']?.details?.items?.slice?.(0, 6),
  networkEarly: network,
  diagnostics: {
    domSize: m['dom-size']?.displayValue,
    mainthread: m['mainthread-work-breakdown']?.displayValue,
  },
}

console.log(JSON.stringify(summary, null, 2))
fs.writeFileSync(path.join(root, 'tmp-lcp-diagnose-summary.json'), JSON.stringify(summary, null, 2))
