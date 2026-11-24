/**
 * After Vite build: inject modulepreload hints for homepage critical chunks
 * so Home JS starts downloading in parallel with the main bundle.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const assets = path.join(dist, 'assets')

function findAsset(prefix) {
  if (!fs.existsSync(assets)) return null
  const hit = fs.readdirSync(assets).find((f) => f.startsWith(prefix) && f.endsWith('.js'))
  return hit ? `/assets/${hit}` : null
}

const home = findAsset('Home-')
const published = findAsset('publishedProjects-')
const projectCard = findAsset('ProjectCard-')
const seo = findAsset('SEOHead-')

const hrefs = [home, published, projectCard, seo].filter(Boolean)
if (!hrefs.length) {
  console.warn('inject-homepage-preloads: no homepage chunks found — skip')
  process.exit(0)
}

const tags = hrefs.map((href) => `<link rel="modulepreload" crossorigin href="${href}" />`).join('\n    ')
const marker = '<!-- homepage-modulepreloads -->'

function inject(html) {
  if (html.includes(marker)) {
    return html.replace(/<!-- homepage-modulepreloads -->[\s\S]*?<!-- \/homepage-modulepreloads -->/, `${marker}\n    ${tags}\n    <!-- /homepage-modulepreloads -->`)
  }
  if (html.includes('</head>')) {
    return html.replace(
      '</head>',
      `    ${marker}\n    ${tags}\n    <!-- /homepage-modulepreloads -->\n  </head>`
    )
  }
  return html
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) {
      if (name === 'assets') continue
      walk(full)
      continue
    }
    if (!name.endsWith('.html')) continue
    const next = inject(fs.readFileSync(full, 'utf8'))
    fs.writeFileSync(full, next)
  }
}

walk(dist)
console.log(`inject-homepage-preloads: ${hrefs.length} tags → ${hrefs.join(', ')}`)
