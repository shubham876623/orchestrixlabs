import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const sitePath = path.join(root, 'src/lib/site.js')
const siteSrc = fs.readFileSync(sitePath, 'utf8')
const envExamplePath = path.join(root, '.env.example')

const failures = []
function must(cond, msg) {
  if (!cond) failures.push(msg)
}

must(siteSrc.includes('export function getCalComBookingUrl'), 'site.js must export getCalComBookingUrl')
must(siteSrc.includes('export function calComEmbedUrl'), 'site.js must export calComEmbedUrl')
must(siteSrc.includes('export function contactBookHref'), 'site.js must export contactBookHref')
must(fs.existsSync(envExamplePath), '.env.example must exist')
const envExample = fs.readFileSync(envExamplePath, 'utf8')
must(envExample.includes('VITE_CALCOM_BOOKING_URL='), '.env.example must document VITE_CALCOM_BOOKING_URL')
must(envExample.includes('VITE_CALCOM_SECURE_BOOKING_URL='), '.env.example must document VITE_CALCOM_SECURE_BOOKING_URL')
must(siteSrc.includes('getCalComSecureBookingUrl'), 'site.js must export getCalComSecureBookingUrl')
must(
  !/https:\/\/cal\.com\/[a-z0-9-]+\/[a-z0-9-]+/i.test(siteSrc),
  'do not hardcode a real cal.com URL in site.js (use import.meta.env only)',
)

if (failures.length) {
  console.error('test-site-booking FAILED:\n' + failures.map((f) => `  - ${f}`).join('\n'))
  process.exit(1)
}

const { calComEmbedUrl, contactBookHref } = await import(new URL('../src/lib/site.js', import.meta.url).href)

const sample = 'https://cal.com/orchestrixlabs/discovery'
const embed = calComEmbedUrl(sample)
must(embed.includes('embed=true'), 'calComEmbedUrl must set embed=true')
must(embed.startsWith('https://cal.com/'), 'embed must preserve cal.com host')
must(siteSrc.includes("BOOKING_PATH = '/book'"), 'site.js must define BOOKING_PATH /book')
must(typeof contactBookHref() === 'string' && contactBookHref().startsWith('/contact'), 'contactBookHref falls back to /contact when env unset')

console.log('test-site-booking OK')