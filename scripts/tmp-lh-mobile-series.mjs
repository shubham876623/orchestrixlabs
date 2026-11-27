import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function runLh(label, url, outFile) {
  const r = spawnSync(
    'npx',
    [
      '--yes',
      'lighthouse',
      url,
      '--only-categories=performance,accessibility,seo,best-practices',
      '--form-factor=mobile',
      '--throttling-method=simulate',
      '--output=json',
      `--output-path=${outFile}`,
      '--chrome-flags=--headless --no-sandbox',
      '--quiet',
    ],
    { cwd: root, stdio: 'inherit', shell: true }
  )
  if ((r.status ?? 1) !== 0) throw new Error(`lighthouse failed for ${label}`)
  const data = JSON.parse(fs.readFileSync(path.join(root, outFile), 'utf8'))
  const c = data.categories
  const m = data.audits
  const lcpNode = data.audits['lcp-breakdown-insight']?.details?.items?.find((i) => i.type === 'node')
  return {
    label,
    url,
    perf: c.performance.score,
    a11y: c.accessibility.score,
    seo: c.seo.score,
    bp: c['best-practices'].score,
    FCP: m['first-contentful-paint']?.displayValue,
    LCP: m['largest-contentful-paint']?.displayValue,
    TBT: m['total-blocking-time']?.displayValue,
    CLS: m['cumulative-layout-shift']?.displayValue,
    lcpLabel: lcpNode?.nodeLabel || lcpNode?.snippet || null,
  }
}

function median(nums) {
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

const localRuns = []
for (let i = 1; i <= 5; i++) {
  localRuns.push(runLh(`local-${i}`, 'http://127.0.0.1:4173/', `tmp-lh-mobile-local-${i}.json`))
  console.log(JSON.stringify(localRuns[i - 1]))
}

const prod = runLh('prod-baseline', 'https://orchestrixlabs.com/', 'tmp-lh-mobile-prod.json')
console.log(JSON.stringify(prod))

const summary = {
  environment: {
    tool: 'Lighthouse CLI (npx lighthouse)',
    formFactor: 'mobile',
    throttling: 'simulate (Lighthouse default mobile)',
    chromeFlags: '--headless --no-sandbox',
    localServer: 'scripts/serve-production-audit.mjs on 127.0.0.1:4173 (dist + /api proxy)',
    localOrigin: 'http://127.0.0.1:4173/',
    prodOrigin: 'https://orchestrixlabs.com/',
  },
  localRuns,
  localMedian: {
    perf: median(localRuns.map((r) => r.perf)),
    a11y: median(localRuns.map((r) => r.a11y)),
    seo: median(localRuns.map((r) => r.seo)),
    bp: median(localRuns.map((r) => r.bp)),
  },
  prod,
}

fs.writeFileSync(path.join(root, 'tmp-lh-mobile-series-summary.json'), JSON.stringify(summary, null, 2))
console.log('\nSUMMARY\n', JSON.stringify(summary, null, 2))
