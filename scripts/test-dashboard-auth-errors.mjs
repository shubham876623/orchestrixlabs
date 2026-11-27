// Verifies the dashboard sign-in error copy, including the rate-limited (429) case.
import { signInErrorMessage } from '../src/lib/dashboardAuthErrors.js'

const LOCKED = 'Incorrect password — or this IP is temporarily locked after too many failed attempts. Wait 15 minutes, then retry with DASHBOARD_SECRET from Railway.'
const PROXY_DOWN = 'API proxy is down (HTML instead of JSON). Wait for redeploy, then hard-refresh.'
let failures = 0

function check(label, actual, predicate) {
  if (predicate(actual)) {
    console.log(`  ok   ${label}`)
  } else {
    failures += 1
    console.log(`  FAIL ${label} (got: ${JSON.stringify(actual)})`)
  }
}

check('429 with Retry-After 1800 gives minutes', signInErrorMessage(429, 1800), (m) => m.includes('Try again in 30 minutes'))
check('429 with Retry-After as header string', signInErrorMessage(429, '90'), (m) => m.includes('Try again in 2 minutes'))
check('429 without Retry-After says later', signInErrorMessage(429, null), (m) => m.includes('Try again later'))
check('401 keeps today\'s copy', signInErrorMessage(401), (m) => m === LOCKED)
check('403 keeps today\'s copy', signInErrorMessage(403), (m) => m === LOCKED)
check('502 keeps today\'s copy', signInErrorMessage(502), (m) => m === PROXY_DOWN)
check('other status is generic', signInErrorMessage(500), (m) => m === 'Sign-in failed (500). Try again.')

console.log(failures ? `FAIL (${failures})` : 'PASS')
process.exit(failures ? 1 : 0)
