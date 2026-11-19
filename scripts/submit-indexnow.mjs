#!/usr/bin/env node
/**
 * IndexNow submission for production canonical URLs only.
 * Designed for post-deploy CI — not page visits.
 *
 * Durable dedupe: committed scripts/indexnow-state.json (survives CI runners).
 * Soft-fail by default so production deploys are never blocked.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *   node scripts/submit-indexnow.mjs --force
 *   node scripts/submit-indexnow.mjs --dry-run
 *   node scripts/submit-indexnow.mjs --url=https://orchestrixlabs.com/services
 *   INDEXNOW_STRICT=1 node scripts/submit-indexnow.mjs   # non-zero exit on API failure
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  INDEXNOW,
  buildUrlCatalog,
  diffCatalog,
  isEligibleUrl,
} from './lib/indexnow-config.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const STATE_PATH = join(ROOT, 'scripts', 'indexnow-state.json')
const STRICT = process.env.INDEXNOW_STRICT === '1'

function parseArgs(argv) {
  const opts = { force: false, dryRun: false, writeState: true, urls: [] }
  for (const a of argv) {
    if (a === '--force') opts.force = true
    else if (a === '--dry-run') opts.dryRun = true
    else if (a === '--no-write-state') opts.writeState = false
    else if (a.startsWith('--url=')) opts.urls.push(a.slice(6))
  }
  return opts
}

function loadState() {
  if (!existsSync(STATE_PATH)) {
    return { version: 1, host: INDEXNOW.host, updatedAt: null, entries: {} }
  }
  try {
    const raw = JSON.parse(readFileSync(STATE_PATH, 'utf8'))
    return {
      version: 1,
      host: INDEXNOW.host,
      updatedAt: raw.updatedAt || null,
      lastResponse: raw.lastResponse || null,
      entries: raw.entries && typeof raw.entries === 'object' ? raw.entries : {},
    }
  } catch {
    return { version: 1, host: INDEXNOW.host, updatedAt: null, entries: {} }
  }
}

function saveState(entries, lastResponse) {
  const next = {
    version: 1,
    host: INDEXNOW.host,
    updatedAt: new Date().toISOString(),
    lastResponse,
    entries,
  }
  writeFileSync(STATE_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
}

async function postIndexNow(urlList) {
  const body = {
    host: INDEXNOW.host,
    key: INDEXNOW.key,
    keyLocation: INDEXNOW.keyLocation,
    urlList,
  }
  const res = await fetch(INDEXNOW.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
  const text = await res.text().catch(() => '')
  return {
    status: res.status,
    ok: res.status === 200 || res.status === 202,
    text: text.slice(0, 500),
  }
}

function softExit(code, payload) {
  console.log(JSON.stringify(payload))
  if (STRICT) process.exit(code)
  // Never fail the deploy/CI job unless STRICT is set.
  process.exit(0)
}

const opts = parseArgs(process.argv.slice(2))
const catalog = buildUrlCatalog(ROOT)
const state = loadState()

let toSubmit = []
let diff = null

if (opts.urls.length) {
  toSubmit = [...new Set(opts.urls.filter(isEligibleUrl))]
} else if (opts.force || !Object.keys(state.entries).length) {
  toSubmit = catalog.urls
  diff = {
    added: catalog.urls,
    changed: [],
    removed: [],
    unchanged: [],
    reason: opts.force ? 'force' : 'initial-state',
  }
} else {
  diff = diffCatalog(catalog.entries, state.entries)
  toSubmit = diff.toSubmit
}

toSubmit = [...new Set(toSubmit)].filter(isEligibleUrl)

const summary = {
  action: opts.dryRun ? 'dry-run' : 'prepare',
  endpoint: INDEXNOW.endpoint,
  keyLocation: INDEXNOW.keyLocation,
  eligibleCount: catalog.urls.length,
  eligibleUrls: catalog.urls,
  submitCount: toSubmit.length,
  submitUrls: toSubmit,
  diff: diff
    ? {
        added: diff.added?.length || 0,
        changed: diff.changed?.length || 0,
        removed: diff.removed?.length || 0,
        unchanged: diff.unchanged?.length || 0,
        reason: diff.reason || 'fingerprint-diff',
      }
    : { reason: 'explicit-urls' },
}

console.log(JSON.stringify(summary))

if (!toSubmit.length) {
  softExit(0, { action: 'skip', reason: 'no new/changed/removed eligible URLs' })
}

if (opts.dryRun) process.exit(0)

try {
  const result = await postIndexNow(toSubmit)
  console.log(JSON.stringify({ action: 'response', ...result }))

  if (!result.ok) {
    softExit(1, {
      action: 'error',
      reason: 'indexnow-http-failure',
      status: result.status,
      softFail: !STRICT,
    })
  }

  if (opts.writeState) {
    // Persist current catalog fingerprints so future CI runs can dedupe.
    // Removed URLs drop out of entries automatically.
    saveState(catalog.entries, { status: result.status, at: new Date().toISOString(), count: toSubmit.length })
    console.log(JSON.stringify({ action: 'state-written', path: 'scripts/indexnow-state.json' }))
  }

  softExit(0, { action: 'success', status: result.status, count: toSubmit.length })
} catch (err) {
  softExit(1, {
    action: 'error',
    reason: 'indexnow-exception',
    message: String(err?.message || err),
    softFail: !STRICT,
  })
}
