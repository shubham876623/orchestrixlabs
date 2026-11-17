import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { SiUpwork } from 'react-icons/si'
import { FiArrowRight, FiMoon, FiSun } from 'react-icons/fi'
import BrandLogo from './BrandLogo'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Work History', path: '/work-history' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

function useThemeMode() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('orchestrix-theme')
    const dark = stored ? stored === 'dark' : true
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('orchestrix-theme', next ? 'dark' : 'light')
      return next
    })
  }

  return { isDark, toggle }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isDark, toggle } = useThemeMode()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-dark-950/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-xl shadow-black/20'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        <BrandLogo variant="nav" imgClassName="drop-shadow-[0_0_18px_rgba(0,239,253,0.18)]" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const active =
              link.path === '/portfolio'
                ? location.pathname.startsWith('/portfolio')
                : location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.name}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/[0.08]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
          <a
            href="https://www.upwork.com/agencies/1464061503601672192/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#14a800]/40 text-[#14a800] hover:bg-[#14a800]/10 hover:border-[#14a800]/70 transition-all duration-200"
          >
            <SiUpwork size={15} />
            Upwork
          </a>
          <Link to="/contact" className="btn-primary text-sm py-2.5 px-5">
            Request Consultation <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-dark-950/95 backdrop-blur-2xl border-b border-white/[0.05]"
          >
            <nav className="container py-5 flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map(link => {
                const active =
                  link.path === '/portfolio'
                    ? location.pathname.startsWith('/portfolio')
                    : location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`min-h-[44px] px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'text-white bg-white/[0.07]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <div className="pt-3 border-t border-white/[0.06] mt-2 flex flex-col gap-3">
                <a
                  href="https://www.upwork.com/agencies/1464061503601672192/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border border-[#14a800]/40 text-[#14a800] hover:bg-[#14a800]/10 transition-all duration-200"
                >
                  <SiUpwork size={15} />
                  View Upwork Profile
                </a>
                <Link to="/contact" className="btn-primary w-full justify-center text-sm">
                  Request Consultation
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
