import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FiSearch } from 'react-icons/fi'
import BrandLogo from './BrandLogo'
import BookCallLink from './BookCallLink'
import SiteSearch from './SiteSearch'

const navLinks = [
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio', also: ['/work-history'] },
  { name: 'Reviews', path: '/reviews' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

function isActive(link, pathname) {
  return [link.path, ...(link.also || [])].some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '')

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  // Ctrl/Cmd+K anywhere, or "/" when not typing, opens search.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
      if ((e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setMobileOpen(false)
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Mobile menu: Esc closes it and the page behind does not scroll.
  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200 ${
          scrolled || mobileOpen
            ? 'border-border bg-paper-elevated/95 shadow-xs backdrop-blur-md'
            : 'border-transparent bg-paper-base/80 backdrop-blur-sm'
        }`}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <BrandLogo variant="nav" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navLinks.map((link) => {
              const active = isActive(link, pathname)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-md px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent ${
                    active ? 'text-navy-primary' : 'text-navy-secondary hover:text-navy-primary'
                  }`}
                >
                  {link.name}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3.5 -bottom-[13px] h-0.5 rounded-full bg-cyan-hover transition-opacity duration-150 ${active ? 'opacity-100' : 'opacity-0'}`}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-border-strong bg-paper-elevated py-2 pl-3 pr-2 text-sm text-navy-secondary transition-colors hover:border-navy-primary hover:text-navy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent sm:inline-flex"
              aria-label="Search the site"
            >
              <FiSearch size={16} aria-hidden="true" />
              <span>Search</span>
              <kbd className="rounded border border-border bg-paper-subtle px-1.5 py-0.5 font-sans text-xs text-navy-muted">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2.5 text-navy-primary hover:bg-paper-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent sm:hidden"
              aria-label="Search the site"
            >
              <FiSearch size={20} aria-hidden="true" />
            </button>
            <div className="hidden lg:block">
              <BookCallLink className="btn-primary">Book a call</BookCallLink>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-lg p-2.5 text-navy-primary hover:bg-paper-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <HiX size={24} aria-hidden="true" /> : <HiMenuAlt3 size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-paper-elevated lg:hidden">
            <nav className="container flex flex-col py-4" aria-label="Mobile">
              {[{ name: 'Home', path: '/' }, ...navLinks].map((link) => {
                const active = link.path === '/' ? pathname === '/' : isActive(link, pathname)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[52px] items-center border-b border-border text-lg font-medium ${
                      active ? 'text-navy-primary' : 'text-navy-secondary'
                    }`}
                  >
                    {active && <span className="mr-3 h-5 w-0.5 rounded-full bg-cyan-hover" aria-hidden="true" />}
                    {link.name}
                  </Link>
                )
              })}
              <BookCallLink className="btn-primary btn-lg mt-6">Book a call</BookCallLink>
            </nav>
          </div>
        )}
      </header>
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
