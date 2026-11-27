import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import BrandLogo from './BrandLogo'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <motion.header
      initial={false}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'py-3 bg-paper-elevated/95 backdrop-blur-sm border-b border-border shadow-sm'
          : 'py-4 bg-paper-elevated/80 backdrop-blur-sm'
      }`}
    >
      <div className="container flex items-center justify-between">
        <BrandLogo variant="nav" />

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
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'text-cyan-accent'
                    : 'text-navy-secondary hover:text-cyan-accent'
                }`}
              >
                {active && (
                  <span
                    className="absolute left-2 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-cyan-accent"
                    aria-hidden="true"
                  />
                )}
                <span className={active ? 'pl-1' : undefined}>{link.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link to="/contact" className="btn-primary text-sm">
            Book a call
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-navy-primary hover:text-cyan-accent transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-paper-elevated"
          >
            <nav className="container py-4 flex flex-col gap-2" aria-label="Mobile">
              {navLinks.map(link => {
                const active =
                  link.path === '/portfolio'
                    ? location.pathname.startsWith('/portfolio')
                    : location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex min-h-[44px] items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-cyan-subtle text-cyan-accent'
                        : 'text-navy-secondary hover:bg-paper-subtle hover:text-navy-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <Link to="/contact" className="btn-primary mt-2">
                Book a call
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
