/**
 * Local regression checks for Work History empty-state hotfix.
 * Does not touch production.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'src/pages/PortfolioWorkHistory.jsx'), 'utf8')

const checks = [
  ['seeds with localProjects', /useState\(\(\)\s*=>\s*normalizeProjects\(localProjects\)\)/.test(src)],
  ['normalizes missing status', /status:\s*p\.status\s*\|\|\s*'completed'/.test(src)],
  ['axios timeout on projects', /api\.get\('\/api\/projects\/',\s*\{\s*timeout:\s*20000\s*\}\)/.test(src)],
  ['loading ellipsis on completed tab', /Completed jobs \(\{loading \? '…' : completedProjects\.length\}\)/.test(src)],
  ['loading ellipsis on in-progress tab', /In progress \(\{loading \? '…' : inProgressProjects\.length\}\)/.test(src)],
  ['cancel-safe effect cleanup', /cancelled = true/.test(src)],
  ['work-history SEO path', /path="\/work-history"/.test(src)],
  ['strips public financial fields', /project_value:\s*_pv/.test(src) && /hours_worked:\s*_hw/.test(src)],
  ['anonymizes client display', /Verified Upwork Client/.test(src)],
  ['no unverified 143\+ client claim', !/Join 143\+ clients/.test(src) && !/\$100K\+/.test(src)],
]

const app = readFileSync(join(root, 'src/App.jsx'), 'utf8')
checks.push(['work-history route wired', /path="\/work-history"\s+element=\{<PortfolioWorkHistory\s*\/>\}/.test(app)])

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`\n${failed} check(s) failed`)
  process.exit(1)
}
console.log(`\nAll ${checks.length} work-history hotfix checks passed`)
