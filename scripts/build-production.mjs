/**
 * Production portfolio build: approved_public + draft loader stub (no draft catalog in module graph).
 * Does not deploy.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const viteCli = join(root, 'node_modules', 'vite', 'bin', 'vite.js')
if (!existsSync(viteCli)) {
  console.error('vite.js not found at', viteCli)
  process.exit(1)
}

const env = { ...process.env, VITE_PORTFOLIO_MODE: 'approved_public' }
const result = spawnSync(process.execPath, [viteCli, 'build'], {
  cwd: root,
  env,
  stdio: 'inherit',
  shell: false,
})
process.exit(result.status ?? 1)
