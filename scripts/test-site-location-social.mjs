import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const sitePath = path.join(root, 'src/lib/site.js')
const siteSrc = fs.readFileSync(sitePath, 'utf8')

const failures = []
function must(cond, msg) {
  if (!cond) failures.push(msg)
}

must(
  siteSrc.includes("instagram: 'https://www.instagram.com/orchestrixlabs'"),
  'SOCIAL.instagram must be https://www.instagram.com/orchestrixlabs',
)
must(
  siteSrc.includes("instagramHandle: '@orchestrixlabs'"),
  'SOCIAL must define instagramHandle @orchestrixlabs',
)
must(siteSrc.includes('export function mapsOpenUrl'), 'site.js must export mapsOpenUrl')
must(siteSrc.includes('export function mapsEmbedUrl'), 'site.js must export mapsEmbedUrl')
must(!siteSrc.includes('orchestrix_labs__ai_dev_agency'), 'remove old Instagram handle URL from site.js')

if (failures.length) {
  console.error('test-site-location-social FAILED:\n' + failures.map((f) => `  - ${f}`).join('\n'))
  process.exit(1)
}

const siteFileUrl = new URL(`../src/lib/site.js`, import.meta.url).href
const { SITE, SOCIAL, mapsOpenUrl, mapsEmbedUrl } = await import(siteFileUrl)

must(
  mapsOpenUrl() === `https://maps.google.com/?q=${encodeURIComponent(SITE.address.formatted)}`,
  'mapsOpenUrl must match google search URL',
)
must(mapsEmbedUrl().includes('output=embed'), 'mapsEmbedUrl must use output=embed')
must(
  mapsEmbedUrl().includes(encodeURIComponent(SITE.address.formatted)),
  'mapsEmbedUrl must encode formatted address',
)
must(SOCIAL.instagram === 'https://www.instagram.com/orchestrixlabs', 'runtime SOCIAL.instagram mismatch')

const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const llms = fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8')

must(
  indexHtml.includes('https://www.instagram.com/orchestrixlabs'),
  'index.html sameAs must list new Instagram URL',
)
must(!indexHtml.includes('orchestrix_labs__ai_dev_agency'), 'index.html must not contain old Instagram URL')
must(llms.includes('https://www.instagram.com/orchestrixlabs'), 'public/llms.txt must list new Instagram URL')
must(!llms.includes('orchestrix_labs__ai_dev_agency'), 'public/llms.txt must not contain old Instagram URL')

console.log('test-site-location-social OK')