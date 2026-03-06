import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi'
import { SiUpwork } from 'react-icons/si'

const footerLinks = {
  Company: [
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
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
  { icon: FiLinkedin, href: 'https://linkedin.com/company/orchestrix-labs', label: 'LinkedIn' },
  { icon: FiGithub, href: 'https://github.com/orchestrix-labs', label: 'GitHub' },
  { icon: SiUpwork, href: 'https://www.upwork.com/freelancers/djangodeveloper', label: 'Upwork' },
  { icon: FiMail, href: 'mailto:hello@orchestrixlabs.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-dark-950">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">OL</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Orchestrix<span className="gradient-text"> Labs</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              We build intelligent AI systems, voice bots, and automation tools
              that help businesses scale. Production-ready solutions, delivered with expertise.
            </p>
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
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-5">{heading}</h4>
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

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Orchestrix Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for new projects
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
