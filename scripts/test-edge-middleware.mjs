// Verifies the Vercel edge middleware strips client-supplied identity headers and
// stamps the authenticated client IP only when EDGE_PROXY_SECRET is configured.
import middleware from '../middleware.js'

const SECRET = 'e'.repeat(40)
const BACKEND_URL = 'https://orchestrixlabsbackend-production.up.railway.app/api/contact/?a=1'
let failures = 0

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ok   ${label}`)
  } else {
    failures += 1
    console.log(`  FAIL ${label}${detail ? ` (${detail})` : ''}`)
  }
}

async function forward(env, headers) {
  let captured = null
  globalThis.fetch = async (url, init) => {
    captured = { url, headers: new Headers(init.headers) }
    return new Response('{}', { status: 200 })
  }
  if (env === undefined) delete process.env.EDGE_PROXY_SECRET
  else process.env.EDGE_PROXY_SECRET = env
  await middleware(new Request('https://orchestrixlabs.com/api/contact/?a=1', { headers }))
  return captured
}

const spoofed = {
  'x-vercel-forwarded-for': '192.0.2.44, 10.0.0.1',
  'x-orx-client-ip': '6.6.6.6',
  'x-orx-edge-token': 'forged',
}

console.log('Case 1: secret configured')
const withSecret = await forward(SECRET, spoofed)
check('forwards to the Railway backend with path and query', withSecret?.url === BACKEND_URL, withSecret?.url)
check('stamps the first x-vercel-forwarded-for entry', withSecret?.headers.get('x-orx-client-ip') === '192.0.2.44',
  withSecret?.headers.get('x-orx-client-ip'))
check('sends the configured edge token', withSecret?.headers.get('x-orx-edge-token') === SECRET)

console.log('Case 2: secret unset')
const noSecret = await forward(undefined, spoofed)
check('drops client-supplied x-orx-client-ip', noSecret?.headers.get('x-orx-client-ip') === null,
  noSecret?.headers.get('x-orx-client-ip'))
check('drops client-supplied x-orx-edge-token', noSecret?.headers.get('x-orx-edge-token') === null)

console.log('Case 3: secret configured, edge header is not an IP')
const junk = await forward(SECRET, { 'x-vercel-forwarded-for': 'not-an-ip', 'x-orx-client-ip': '6.6.6.6' })
check('does not stamp a non-IP value', junk?.headers.get('x-orx-client-ip') === null, junk?.headers.get('x-orx-client-ip'))
check('does not send the token without a stamp', junk?.headers.get('x-orx-edge-token') === null)

console.log(failures ? `FAIL (${failures})` : 'PASS')
process.exit(failures ? 1 : 0)
