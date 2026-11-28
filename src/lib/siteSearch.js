/**
 * Client-side site search over pages, services and published projects.
 * Only publication-approved projects are indexed (same source as the Portfolio page).
 */
import { services } from '../data/services.js'
import { getVisiblePublishedProjects } from '../data/publishedProjects.js'

const PAGES = [
  { title: 'Home', path: '/', text: 'AI integrations that ship to production' },
  { title: 'Services', path: '/services', text: 'voice AI machine learning full-stack scraping automation' },
  { title: 'Portfolio', path: '/portfolio', text: 'case studies projects work' },
  { title: 'Work history', path: '/work-history', text: 'Upwork projects history' },
  { title: 'Client reviews', path: '/reviews', text: 'testimonials feedback Upwork reviews' },
  { title: 'About', path: '/about', text: 'team founder company' },
  { title: 'Contact', path: '/contact', text: 'project brief consultation email upload requirements' },
  { title: 'Book a call', path: '/book', text: 'schedule meeting calendar 30 minute call' },
  { title: 'Privacy policy', path: '/privacy-policy', text: 'privacy data cookies GDPR rights' },
]

let index = null

function normalize(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
}

export function buildIndex() {
  if (index) return index
  const entries = []
  for (const page of PAGES) {
    entries.push({ kind: 'Page', title: page.title, path: page.path, hint: '', haystack: normalize(`${page.title} ${page.text}`) })
  }
  for (const s of services) {
    entries.push({
      kind: 'Service',
      title: s.title,
      path: '/services',
      hint: s.tagline || '',
      haystack: normalize([s.title, s.tagline, s.description, ...(s.features || []), ...(s.tools || [])].join(' ')),
    })
  }
  for (const p of getVisiblePublishedProjects()) {
    entries.push({
      kind: p.hasCaseStudy ? 'Case study' : 'Project',
      title: p.title,
      path: `/portfolio/${p.slug}`,
      hint: (p.techCandidates || []).slice(0, 3).join(', '),
      haystack: normalize([p.title, p.subtitle, p.summary, p.primaryCategory, ...(p.categories || []),
        ...(p.techCandidates || [])].join(' ')),
    })
  }
  index = entries
  return index
}

/** Every query word must appear; title hits rank above body hits. Returns at most `limit` results. */
export function searchSite(query, limit = 8) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const results = []
  for (const entry of buildIndex()) {
    if (!words.every((w) => entry.haystack.includes(w))) continue
    const title = normalize(entry.title)
    let score = 0
    for (const w of words) score += title.startsWith(w) ? 6 : title.includes(w) ? 4 : 1
    if (entry.kind === 'Page') score += 1
    results.push({ ...entry, score })
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit)
}
