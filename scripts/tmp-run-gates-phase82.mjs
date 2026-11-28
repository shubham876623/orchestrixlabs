import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function run(cmd, args) {
  console.log(`\n>>> ${cmd} ${args.join(' ')}`)
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: true })
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1)
}

run('npm', ['run', 'test:gates'])
run('npm', ['run', 'test:phase8'])
run('npm', ['run', 'test:prerender-seo'])
run('npm', ['run', 'test:bundle-privacy'])

const pub = fs.readFileSync(path.join(root, 'src/data/portfolioApprovedProjects.js'), 'utf8')
const sm = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8')
const port = [...sm.matchAll(/\/portfolio\/([^<\s"]+)/g)].map((m) => m[1])
const counts = {
  approved: (pub.match(/"publicationApproved": true/g) || []).length,
  csTrue: (pub.match(/"hasCaseStudy": true/g) || []).length,
  sitemapPortfolio: port.length,
  sitemapSlugs: port,
}
console.log('\nCOUNTS', JSON.stringify(counts, null, 2))

const lhPath = path.join(root, 'tmp-lh82-release.json')
if (fs.existsSync(lhPath)) {
  const r = JSON.parse(fs.readFileSync(lhPath, 'utf8'))
  console.log(
    'LIGHTHOUSE',
    JSON.stringify(
      {
        perf: r.categories.performance.score,
        a11y: r.categories.accessibility.score,
        seo: r.categories.seo.score,
        bp: r.categories['best-practices'].score,
        LCP: r.audits['largest-contentful-paint'].displayValue,
        CLS: r.audits['cumulative-layout-shift'].displayValue,
      },
      null,
      2
    )
  )
}
