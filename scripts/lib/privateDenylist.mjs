/**
 * Confidential client names and tokens the privacy gates check for, kept out of the public repo.
 *
 * The data lives in scripts/private-denylist.local.json (git-ignored), or in the
 * ORX_PRIVATE_DENYLIST_JSON environment variable on other machines. It maps a key
 * ("<script>#<n>", one per original inline list) to one of:
 *   ["name", ...]                                  -> privateList(key)
 *   {"patterns": [[source, flags, label], ...]}    -> privatePatternPairs(key)
 *   {"regex": [source, flags]}                      -> privateRegex(key)
 * Each gate therefore checks exactly the list it checked before the names moved here.
 * A missing file or key fails loudly, so a gate can never pass by checking nothing.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const LOCAL_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'private-denylist.local.json')

let cache = null

function data() {
  if (cache) return cache
  const raw = process.env.ORX_PRIVATE_DENYLIST_JSON || (existsSync(LOCAL_FILE) ? readFileSync(LOCAL_FILE, 'utf8') : '')
  if (!raw) {
    throw new Error(
      'Private denylist missing: restore scripts/private-denylist.local.json or set ORX_PRIVATE_DENYLIST_JSON. ' +
        'It is git-ignored on purpose; never commit it.',
    )
  }
  cache = JSON.parse(raw)
  return cache
}

function entry(key) {
  const value = data()[key]
  if (value === undefined) throw new Error(`Private denylist has no entry "${key}"; regenerate the local file.`)
  return value
}

export function privateList(key) {
  const value = entry(key)
  if (!Array.isArray(value) || value.length === 0) throw new Error(`Private denylist "${key}" must be a non-empty array.`)
  return value
}

export function privatePatternPairs(key) {
  const { patterns } = entry(key)
  if (!Array.isArray(patterns) || patterns.length === 0) throw new Error(`Private denylist "${key}" has no patterns.`)
  return patterns.map(([source, flags, label]) => [new RegExp(source, flags), label])
}

export function privateRegex(key) {
  const { regex } = entry(key)
  if (!Array.isArray(regex)) throw new Error(`Private denylist "${key}" has no regex.`)
  return new RegExp(regex[0], regex[1])
}
