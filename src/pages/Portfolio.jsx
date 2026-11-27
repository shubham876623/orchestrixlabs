import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiSearch } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import DraftPreviewBanner from '../components/portfolio/DraftPreviewBanner'
import CategoryTabs from '../components/portfolio/CategoryTabs'
import ProjectCard from '../components/portfolio/ProjectCard'
import { SITE, SOCIAL, STATS } from '../lib/site'
import { getSeoPage } from '../lib/seoPages'
import ConsultationCTA from '../components/ConsultationCTA'
import {
  PORTFOLIO_CATEGORIES,
  getAllProjectCards,
  getHomepageFeaturedProjects,
  isDraftPortfolioMode,
} from '../data/publishedProjects'

const PAGE_SIZE = 12
const DEPTH_OPTIONS = [
  { id: 'all', label: 'All listings' },
  { id: 'case-studies', label: 'Full case studies' },
  { id: 'summaries', label: 'Engagement summaries' },
]

function countByCategory(projects) {
  const counts = { 'All Projects': projects.length }
  PORTFOLIO_CATEGORIES.forEach((c) => {
    if (c === 'All Projects') return
    counts[c] = projects.filter((p) => (p.categories || []).includes(c)).length
  })
  return counts
}

export default function Portfolio() {
  const reduceMotion = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  const categoryParam = searchParams.get('category') || 'All Projects'
  const category = PORTFOLIO_CATEGORIES.includes(categoryParam) ? categoryParam : 'All Projects'
  const query = searchParams.get('q') || ''
  const depthParam = searchParams.get('depth') || 'all'
  const depth = DEPTH_OPTIONS.some((d) => d.id === depthParam) ? depthParam : 'all'

  const setCategory = (next) => {
    setPage(1)
    const params = new URLSearchParams(searchParams)
    if (!next || next === 'All Projects') params.delete('category')
    else params.set('category', next)
    setSearchParams(params, { replace: true })
  }

  const setQuery = (next) => {
    setPage(1)
    const params = new URLSearchParams(searchParams)
    const value = next.trim()
    if (!value) params.delete('q')
    else params.set('q', value)
    setSearchParams(params, { replace: true })
  }

  const setDepth = (next) => {
    setPage(1)
    const params = new URLSearchParams(searchParams)
    if (!next || next === 'all') params.delete('depth')
    else params.set('depth', next)
    setSearchParams(params, { replace: true })
  }

  const allCards = useMemo(() => getAllProjectCards(), [])
  const featured = useMemo(() => {
    const bySlug = new Map(allCards.map((c) => [c.slug, c]))
    return getHomepageFeaturedProjects().map((p) => {
      const card = bySlug.get(p.slug)
      if (!card) return { ...p, hasCaseStudy: true }
      return {
        ...p,
        summary: card.summary || p.summary,
        deliveryStatus: card.deliveryStatus || p.deliveryStatus,
        techCandidates: card.techCandidates || p.techCandidates,
        demoOnly: card.demoOnly || p.demoOnly,
        hasCaseStudy: true,
      }
    })
  }, [allCards])
  const counts = useMemo(() => countByCategory(allCards), [allCards])

  const visibleCategories = useMemo(
    () => PORTFOLIO_CATEGORIES.filter((c) => c === 'All Projects' || (counts[c] || 0) > 0),
    [counts]
  )

  const activeCategory = visibleCategories.includes(category) ? category : 'All Projects'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allCards.filter((p) => {
      const cats = p.categories || []
      const catOk = activeCategory === 'All Projects' || cats.includes(activeCategory)
      const isCs = p.hasCaseStudy === true
      const depthOk =
        depth === 'all' || (depth === 'case-studies' && isCs) || (depth === 'summaries' && !isCs)
      const haystack = [
        p.title,
        p.subtitle,
        p.summary,
        ...(cats || []),
        ...(p.techCandidates || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const qOk = !q || haystack.includes(q)
      return catOk && depthOk && qOk
    })
  }, [activeCategory, query, allCards, depth])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const caseStudyCount = allCards.filter((p) => p.hasCaseStudy === true).length

  const fade = (delay = 0) =>
    reduceMotion
      ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.35 },
        }

  return (
    <>
      <SEOHead
        title={getSeoPage('/portfolio')?.title}
        description={getSeoPage('/portfolio')?.description}
        path="/portfolio"
        noindex={isDraftPortfolioMode()}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
        ]}
      />

      <DraftPreviewBanner />

      <section className="border-b border-line pb-10 pt-28 sm:pb-12 sm:pt-32">
        <div className="container">
          <motion.h1
            {...fade(0.04)}
            className="max-w-3xl font-display text-[2rem] font-semibold leading-[1.12] text-white sm:text-5xl"
          >
            Engineering case studies for AI systems that ship
          </motion.h1>
          <motion.p
            {...fade(0.08)}
            className="mt-4 max-w-2xl text-base leading-relaxed text-copy sm:mt-5 sm:text-lg"
          >
            {allCards.length} curated engagements across voice AI, agents, automation, SaaS, CRM, and data systems —
            including {caseStudyCount} full case studies. Nothing is published without editorial approval.
          </motion.p>
          <motion.div {...fade(0.12)} className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
            <Link to="/contact" className="btn-primary">
              Request Consultation <FiArrowRight />
            </Link>
            <Link to="/work-history" className="btn-outline">
              Browse Work History
            </Link>
          </motion.div>

          <motion.div
            {...fade(0.16)}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-sm text-mute"
          >
            <p>
              <span className="font-semibold text-white">Founder credentials</span>
              {' '}({SITE.founder}) — Top Rated on Upwork · {STATS.jss} Job Success · {SITE.founderExperienceYears}+ years engineering experience
            </p>
            <a
              href={SOCIAL.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-300 underline-offset-2 hover:underline"
            >
              Upwork profile
            </a>
          </motion.div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-b border-line py-8 sm:py-10">
          <div className="container">
            <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-white">Featured case study</h2>
            <button
                type="button"
                className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                onClick={() => setDepth('case-studies')}
              >
                View all case studies
            </button>
            </div>
            <div className="border-t border-line">
              <ProjectCard project={{ ...featured[0], hasCaseStudy: true }} variant="row" />
            </div>
          </div>
        </section>
      )}

      <section className="sticky top-[4.25rem] z-30 border-b border-line bg-ink py-4">
        <div className="container space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                All projects
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Filter by capability. Private Upwork contracts are never auto-published here.
              </p>
            </div>
          </div>
          <CategoryTabs
            categories={visibleCategories}
            active={activeCategory}
            counts={counts}
            onChange={setCategory}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="group"
              aria-label="Filter by case study depth"
              className="flex flex-wrap gap-2"
            >
              {DEPTH_OPTIONS.map((opt) => {
                const selected = depth === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setDepth(opt.id)}
                    className={[
                      'min-h-[40px] border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
                      selected
                        ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-300',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            <label className="relative block w-full max-w-md">
              <span className="sr-only">Search projects</span>
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, category, or technology"
                className="min-h-[44px] w-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:placeholder:text-slate-600"
              />
            </label>
          </div>
                </div>
      </section>

      <section className="py-10 sm:py-14" id="portfolio-panel" role="tabpanel" aria-labelledby="portfolio-tab-0">
        <div className="container">
          <p className="mb-6 text-sm text-slate-500">
            Showing <span className="font-medium text-slate-800 dark:text-slate-300">{filtered.length}</span> of {allCards.length} projects
            {activeCategory !== 'All Projects' ? ` in ${activeCategory}` : ''}
            {depth === 'case-studies' ? ' · full case studies' : ''}
            {depth === 'summaries' ? ' · engagement summaries' : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-white/10 dark:bg-dark-900/40">
              <p className="font-display text-xl text-slate-900 dark:text-white">No projects in this view</p>
              <button
                type="button"
                className="btn-outline mt-6"
                onClick={() => {
                  setCategory('All Projects')
                  setQuery('')
                  setDepth('all')
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col border-t border-line">
                {paged.map((project, i) => (
                  <motion.div
                  key={project.id}
                    {...(reduceMotion
                      ? { initial: false }
                      : {
                          initial: { opacity: 0, y: 14 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: Math.min(i * 0.03, 0.2), duration: 0.3 },
                        })}
                  >
                    <ProjectCard project={project} variant="row" />
                  </motion.div>
                ))}
              </div>

              {pageCount > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                    type="button"
                    className="btn-outline"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Page {safePage} of {pageCount}
                  </span>
                <button
                    type="button"
                    className="btn-outline"
                    disabled={safePage >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                Next
              </button>
            </div>
              )}
            </>
          )}

          <div className="mt-14 sm:mt-16">
            <ConsultationCTA variant="automation" />
          </div>
        </div>
      </section>
    </>
  )
}
