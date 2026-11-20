import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiMail, FiInstagram, FiMapPin } from 'react-icons/fi'
import { SiUpwork } from 'react-icons/si'
import { SITE, SOCIAL } from '../lib/site'
import { openPrivacyPreferences } from '../lib/analyticsConsent'
import BrandLogo from './BrandLogo'

const footerLinks = {
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Work History', path: '/work-history' },
    { name: 'Client Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ],
  Services: [
    { name: 'Voice AI & Chatbots', path: '/services#voice-ai' },
    { name: 'Machine Learning & AI', path: '/services#ml-ai' },
    { name: 'Full-Stack Development', path: '/services#fullstack' },
    { name: 'Web Scraping & Automation', path: '/services#scraping' },
    { name: 'Workflow Automation', path: '/services#automation' },
  ],
}

const socials = [
  { icon: FiLinkedin, href: SOCIAL.linkedin, label: 'LinkedIn' },
  { icon: FiGithub, href: SOCIAL.github, label: 'GitHub' },
  { icon: SiUpwork, href: SOCIAL.upwork, label: 'Upwork' },
  { icon: FiInstagram, href: SOCIAL.instagram, label: 'Instagram' },
  { icon: FiMail, href: `mailto:${SITE.email}`, label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-dark-950">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <BrandLogo variant="nav" className="mb-4" imgClassName="h-9" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {SITE.positioning} Voice AI, automation, custom software, and integrations—
              delivered with production discipline.
            </p>
            <div className="mt-4 space-y-2">
              <a href={`mailto:${SITE.email}`} className="text-slate-400 hover:text-white text-sm transition-colors block">
                {SITE.email}
              </a>
              <p className="flex items-start gap-2 text-slate-400 text-xs leading-relaxed max-w-sm">
                <FiMapPin className="flex-shrink-0 mt-0.5" size={12} aria-hidden="true" focusable="false" />
                {SITE.address.formatted}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/40 hover:bg-primary-500/10 transition-all duration-200"
                >
                  <Icon size={15} aria-hidden="true" focusable="false" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-white font-semibold text-sm mb-5">{heading}</p>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
            </p>
            <p className="text-slate-400 text-xs mt-1">{SITE.jurisdiction}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={openPrivacyPreferences}
              className="text-xs text-slate-400 hover:text-white transition-colors font-medium"
            >
              Cookie Settings
            </button>
            <span className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for new projects
            </span>
            <Link to="/contact" className="text-xs text-primary-400 hover:text-white transition-colors font-medium">
              Request Consultation →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
