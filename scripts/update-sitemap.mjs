import { writeFileSync } from 'node:fs'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'

const caseStudies = APPROVED_PUBLIC_PROJECTS.filter((p) => p.hasCaseStudy === true)
const urls = [
  ['https://orchestrixlabs.com/', 'weekly', '1.0'],
  ['https://orchestrixlabs.com/services', 'monthly', '0.9'],
  ['https://orchestrixlabs.com/portfolio', 'weekly', '0.9'],
  ['https://orchestrixlabs.com/work-history', 'weekly', '0.9'],
  ...caseStudies.map((p) => [`https://orchestrixlabs.com/portfolio/${p.slug}`, 'monthly', '0.8']),
  ['https://orchestrixlabs.com/about', 'monthly', '0.8'],
  ['https://orchestrixlabs.com/reviews', 'monthly', '0.8'],
  ['https://orchestrixlabs.com/contact', 'monthly', '0.9'],
]

const body =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      ([loc, cf, pr]) =>
        `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`
    )
    .join('\n') +
  `\n</urlset>\n`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), body)
console.log('sitemap urls', urls.length, 'case studies', caseStudies.length)
