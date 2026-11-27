import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = ''
        res.on('data', (c) => (body += c))
        res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }))
      })
      .on('error', reject)
  })
}

function pick(html, re) {
  const m = html.match(re)
  return m ? m[1].replace(/\s+/g, ' ').trim() : null
}

const pub = fs.readFileSync(path.join(root, 'src/data/portfolioApprovedProjects.js'), 'utf8')
const approved = (pub.match(/publicationApproved:\s*true/g) || []).length
const csTrue = (pub.match(/hasCaseStudy:\s*true/g) || []).length
const csFalse = (pub.match(/hasCaseStudy:\s*false/g) || []).length

const localHome = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8')
const localSm = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8')
const localRobots = fs.readFileSync(path.join(root, 'dist/robots.txt'), 'utf8')
const localPort = [...localSm.matchAll(/\/portfolio\/([^<\s"]+)/g)].map((m) => m[1])

const home = await get('https://orchestrixlabs.com/')
const sm = await get('https://orchestrixlabs.com/sitemap.xml')
const robots = await get('https://orchestrixlabs.com/robots.txt')
const prodPort = [...sm.body.matchAll(/\/portfolio\/([^<\s"]+)/g)].map((m) => m[1])

const out = {
  counts: { approved, hasCaseStudyTrue: csTrue, hasCaseStudyFalse: csFalse },
  prod: {
    status: home.status,
    title: pick(home.body, /<title>([^<]+)<\/title>/i),
    h1: pick(home.body, /<h1[^>]*>([\s\S]*?)<\/h1>/i)?.slice(0, 160),
    canonical: pick(home.body, /rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    description: pick(home.body, /name=["']description["'][^>]*content=["']([^"']*)["']/i)?.slice(0, 160),
    ogTitle: pick(home.body, /property=["']og:title["'][^>]*content=["']([^"']*)["']/i),
    portfolioSitemap: prodPort.length,
    robotsSample: robots.body.slice(0, 220),
  },
  local: {
    title: pick(localHome, /<title>([^<]+)<\/title>/i),
    h1: pick(localHome, /<h1[^>]*>([\s\S]*?)<\/h1>/i)?.slice(0, 160),
    canonical: pick(localHome, /rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    description: pick(localHome, /name=["']description["'][^>]*content=["']([^"']*)["']/i)?.slice(0, 160),
    ogTitle: pick(localHome, /property=["']og:title["'][^>]*content=["']([^"']*)["']/i),
    portfolioSitemap: localPort.length,
    portfolioSlugs: localPort,
    robotsSample: localRobots.slice(0, 220),
    sitemapTotal: [...localSm.matchAll(/<loc>/g)].length,
  },
}

console.log(JSON.stringify(out, null, 2))
fs.writeFileSync(path.join(root, 'tmp-phase81-compare.json'), JSON.stringify(out, null, 2))
