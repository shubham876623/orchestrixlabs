/**
 * Single source of truth for public, indexable page SEO.
 * Used by SEOHead (client) and scripts/prerender-routes.mjs (build-time HTML).
 * Do not include /dashboard or other private/noindex routes here.
 */
import { SITE } from './site.js'

export const HOME_META_DESCRIPTION =
  'Orchestrix Labs builds AI agents, automation, and custom software for real-world operations—voice AI, integrations, and full-stack delivery.'

/** @typedef {{ path: string, title: string, description: string, h1: string, lead: string, image?: string }} SeoPage */

/** @type {SeoPage[]} */
export const PUBLIC_SEO_PAGES = [
  {
    path: '/',
    title: `Orchestrix Labs — ${SITE.slogan}`,
    description: HOME_META_DESCRIPTION,
    h1: `Orchestrix Labs — AI automation and custom software. ${SITE.slogan}`,
    lead:
      'Voice AI, business automation, custom software, and enterprise integrations delivered with production discipline for teams worldwide.',
  },
  {
    path: '/services',
    title: 'Services',
    description:
      'Orchestrix Labs delivers voice AI, machine learning, full-stack platforms, data automation, and workflow integrations for real operations.',
    h1: 'Capabilities that turn operations into dependable software systems',
    lead:
      'Voice AI, automation, custom platforms, and integrations—scoped for real business constraints and delivered with clear milestones.',
  },
  {
    path: '/portfolio',
    title: 'Portfolio',
    description:
      'Explore verified Orchestrix Labs case studies spanning voice AI, agents, automation, full-stack platforms, CRM, and data systems.',
    h1: 'Verified AI engineering and software case studies',
    lead:
      'Selected engagements across voice AI, agents, automation, CRM, full-stack platforms, and data systems. Case studies publish only after approval.',
  },
  {
    path: '/work-history',
    title: 'Work History',
    description:
      'Archive of Orchestrix Labs software and AI engagements with verified Upwork feedback—separate from premium Portfolio case studies.',
    h1: 'Real delivery history. Verified client feedback.',
    lead:
      'An archive of completed and in-progress engagements with ratings and reviews. Premium narrative case studies live on Portfolio.',
  },
  {
    path: '/about',
    title: 'About',
    description:
      'Meet Orchestrix Labs, a boutique AI engineering company building voice AI, automation, and custom software for teams worldwide.',
    h1: 'We turn complex problems into intelligent software',
    lead:
      'Orchestrix Labs bridges cutting-edge AI capabilities with practical business implementation—led by founder Shubham Saini.',
  },
  {
    path: '/reviews',
    title: 'Client Reviews',
    description:
      'Verified client feedback for Orchestrix Labs on Upwork—Top Rated delivery across AI agents, automation, and custom software projects.',
    h1: 'Trusted by clients worldwide',
    lead:
      'Read verified Upwork feedback about working with Orchestrix Labs on AI, automation, and custom software engagements.',
  },
  {
    path: '/contact',
    title: 'Request Consultation',
    description:
      'Request a technical consultation with Orchestrix Labs for voice AI, automation, or custom software. We aim to reply within 24 hours.',
    h1: 'Tell us what you need to ship next',
    lead: `Share a short brief. We reply within ${SITE.responseTime} with an honest assessment and a practical next step.`,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description:
      'How Orchestrix Labs collects, uses, shares, and protects personal data from website enquiries, Meta lead forms, and client work.',
    h1: 'Privacy Policy',
    lead:
      'This Privacy Policy explains how Orchestrix Labs handles personal information from website visits, enquiries, Meta lead forms, and client engagements.',
  },
]

const byPath = new Map(PUBLIC_SEO_PAGES.map((page) => [page.path, page]))

export function getSeoPage(path) {
  if (!path) return byPath.get('/')
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return byPath.get(normalized) || null
}

/** Truncate meta descriptions at a word boundary when summaries run long. */
export function clipMetaDescription(text, max = 158) {
  const raw = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (raw.length <= max) return raw
  const sliced = raw.slice(0, max - 1)
  const at = sliced.lastIndexOf(' ')
  return `${(at > 80 ? sliced.slice(0, at) : sliced).trim()}…`
}

/**
 * Build SEO entry for a publication-approved portfolio case study.
 * @param {{ slug: string, title: string, summary?: string, subtitle?: string }} project
 */
export function caseStudySeoPage(project) {
  const path = `/portfolio/${project.slug}`
  let description = String(
    project.summary || `${project.title} — AI and software engagement.`
  )
    .replace(/\s+/g, ' ')
    .trim()

  if (description.length < 120 && !/orchestrix labs/i.test(description)) {
    description = `${description.replace(/\.$/, '')}. Case study by Orchestrix Labs.`
  }

  return {
    path,
    title: project.title,
    description: clipMetaDescription(description),
    h1: project.title,
    lead:
      project.subtitle ||
      project.summary ||
      'Publication-approved case study from Orchestrix Labs.',
  }
}
