export const SITE = {
  name: 'Orchestrix Labs',
  legalName: 'Orchestrix Labs',
  tagline: 'AI-Powered Software Development',
  /** Primary brand slogan — locked 2026-11-13 */
  slogan: 'Engineering Intelligence. Automating Growth.',
  /** Supporting positioning — use sparingly; do not stack with slogan everywhere */
  positioning: 'AI Engineering. Built for Real-World Operations.',
  url: 'https://orchestrixlabs.com',
  email: 'contact@orchestrixlabs.com',
  /** Privacy / data-rights requests — founder-designated contact */
  privacyEmail: 'shubham@orchestrixlabs.com',
  founder: 'Shubham Saini',
  founderTitle: 'Founder & CEO',
  founderExperienceYears: 6,
  timezone: 'Asia/Kolkata (IST)',
  businessHours: 'Mon–Fri, 9:00 AM – 6:00 PM IST',
  responseTime: '24 hours',
  address: {
    street: 'C157, Phase 7, Industrial Area',
    city: 'Mohali',
    region: 'Punjab',
    postalCode: '',
    country: 'IN',
    countryName: 'India',
    formatted: 'C157, Phase 7, Industrial Area, Mohali, Punjab, India',
  },
  jurisdiction: 'Mohali, Punjab, India',
  founded: '2019',
  ogImage: 'https://orchestrixlabs.com/og-image.jpg',
  /** Official dark mark — Organization schema / SEO */
  logo: 'https://orchestrixlabs.com/brand/logo-mark-dark.png',
  logoWordmark: 'https://orchestrixlabs.com/brand/logo-wordmark-dark.png',
}

export const SOCIAL = {
  linkedin: 'https://linkedin.com/company/orchestrix-labs',
  github: 'https://github.com/orchestrixlabs',
  upwork: 'https://www.upwork.com/agencies/1464061503601672192/',
  instagram: 'https://www.instagram.com/orchestrixlabs',
  instagramHandle: '@orchestrixlabs',
}

/** Open Google Maps in a new tab (search by formatted address). */
export function mapsOpenUrl(addressFormatted = SITE.address.formatted) {
  return `https://maps.google.com/?q=${encodeURIComponent(addressFormatted)}`
}

/** Lazy iframe embed — no API key required. */
export function mapsEmbedUrl(addressFormatted = SITE.address.formatted) {
  const q = encodeURIComponent(addressFormatted)
  return `https://maps.google.com/maps?q=${q}&output=embed`
}

export const BOOKING = {
  durationLabel: '30-min call',
  eventLabel: 'Discovery call',
}

export const SECURE_BOOKING = {
  durationLabel: '15-min private call',
  eventLabel: 'Confidential meeting',
}

/** Public Cal.com event URL from Vite env; empty when unset. */
export function getCalComBookingUrl() {
  const raw =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_CALCOM_BOOKING_URL
      : undefined
  return typeof raw === 'string' && raw.trim() ? raw.trim() : ''
}

export function hasCalComBooking() {
  return getCalComBookingUrl().length > 0
}

/** Hidden / confidential Cal.com event (not listed in nav). */
export function getCalComSecureBookingUrl() {
  const raw =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_CALCOM_SECURE_BOOKING_URL
      : undefined
  return typeof raw === 'string' && raw.trim() ? raw.trim() : ''
}

export function hasCalComSecureBooking() {
  return getCalComSecureBookingUrl().length > 0
}

/** iframe-friendly Cal.com URL. */
export function calComEmbedUrl(bookingUrl = getCalComBookingUrl()) {
  if (!bookingUrl) return ''
  try {
    const u = new URL(bookingUrl)
    u.searchParams.set('embed', 'true')
    return u.toString()
  } catch {
    return ''
  }
}

export const BOOKING_PATH = '/book'

/** Primary “book a call” route — dedicated scheduling page when Cal is configured. */
export function contactBookHref() {
  return hasCalComBooking() ? BOOKING_PATH : '/contact'
}

/**
 * Public stats policy (2026-11-12):
 * - Do not publish unverified project/review headcounts (200+ / 143 / 133+ conflict).
 * - Prefer qualitative Upwork claims until founder verifies a single live figure.
 * - CMS `/api/site-stats/` may still store numbers for dashboard; marketing UI must not invent counts.
 */
export const STATS = {
  jss: '100%',
  years: '6+',
  response: '24h',
}

export const SERVICES_SEO = [
  'Voice AI & Conversational Agents',
  'Machine Learning & AI Solutions',
  'Full-Stack Web Development',
  'Web Scraping & Data Automation',
  'Workflow & Business Automation',
]

export const FAQ = [
  {
    q: 'What services does Orchestrix Labs offer?',
    a: 'Orchestrix Labs specializes in voice AI agents, machine learning, full-stack web development (Python, Django, React), web scraping, and workflow automation. We deliver production-ready systems for startups and enterprises worldwide.',
  },
  {
    q: 'How long does a typical AI project take?',
    a: 'Automation bots typically take 1–2 weeks, voice AI systems 2–4 weeks, and full-stack platforms 4–8 weeks. Every project starts with a discovery call and a detailed timeline before work begins.',
  },
  {
    q: 'Is Orchestrix Labs a top-rated agency on Upwork?',
    a: 'Yes. Orchestrix Labs is Top Rated on Upwork with a 100% Job Success Score and verified client feedback on our Upwork agency profile.',
  },
  {
    q: 'What technologies does Orchestrix Labs use?',
    a: 'Our core stack includes Python, Django, FastAPI, React, OpenAI GPT-4, LangChain, Twilio, PostgreSQL, Docker, and AWS. We choose tools based on reliability and long-term maintainability.',
  },
  {
    q: 'How do I hire Orchestrix Labs for my project?',
    a: 'Use Request Consultation at orchestrixlabs.com/contact or email contact@orchestrixlabs.com. We aim to respond within 24 hours with an honest assessment and a clear next step.',
  },
  {
    q: 'Does Orchestrix Labs provide post-launch support?',
    a: 'Yes. We offer bug fixes, feature additions, and ongoing maintenance. Most projects include a complimentary 2-week post-launch support window.',
  },
]

export const ROUTES = [
  { path: '/', title: 'Home', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', title: 'Services', changefreq: 'monthly', priority: '0.9' },
  { path: '/portfolio', title: 'Portfolio', changefreq: 'weekly', priority: '0.9' },
  { path: '/work-history', title: 'Work History', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', title: 'About', changefreq: 'monthly', priority: '0.8' },
  { path: '/reviews', title: 'Reviews', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', title: 'Contact', changefreq: 'monthly', priority: '0.9' },
  { path: '/book', title: 'Book a call', changefreq: 'monthly', priority: '0.85' },
  { path: '/privacy-policy', title: 'Privacy Policy', changefreq: 'yearly', priority: '0.5' },
]
