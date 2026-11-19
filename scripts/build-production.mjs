/**
 * Production portfolio build: approved_public + draft loader stub (no draft catalog in module graph),
 * then route-specific static HTML prerender for public indexable pages.
 * Does not deploy.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const viteCli = join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const prerenderScript = join(root, 'scripts', 'prerender-routes.mjs')

if (!existsSync(viteCli)) {
  console.error('vite.js not found at', viteCli)
  process.exit(1)
}

const env = { ...process.env, VITE_PORTFOLIO_MODE: 'approved_public' }
const vite = spawnSync(process.execPath, [viteCli, 'build'], {
  cwd: root,
  env,
  stdio: 'inherit',
  shell: false,
})
if ((vite.status ?? 1) !== 0) process.exit(vite.status ?? 1)

const prerender = spawnSync(process.execPath, [prerenderScript], {
  cwd: root,
  env,
  stdio: 'inherit',
  shell: false,
})
process.exit(prerender.status ?? 1)
