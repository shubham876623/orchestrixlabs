import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import DraftPreviewBanner from '../components/portfolio/DraftPreviewBanner'
import AbstractCover from '../components/portfolio/AbstractCover'
import ProjectCard from '../components/portfolio/ProjectCard'
import ConsultationCTA from '../components/ConsultationCTA'
import { caseStudySeoPage } from '../lib/seoPages'
import {
  getPublishedProjectBySlug,
  getRelatedProjects,
  isDraftPortfolioMode,
  projectHasFullCaseStudy,
} from '../data/publishedProjects'

const CASE_NAV = [
  { id: 'business-challenge', label: 'Challenge' },
  { id: 'solution-overview', label: 'Solution' },
  { id: 'technical-architecture', label: 'Architecture' },
  { id: 'engineering-responsibilities', label: 'Engineering' },
  { id: 'technologies', label: 'Tech' },
  { id: 'verified-outcomes', label: 'Outcomes' },
]

function Section({ title, children, id }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-line py-8 first:border-t-0 first:pt-0"
    >
      <h2 className="font-display text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-copy sm:text-base">
        {children}
      </div>
    </section>
  )
}

function PendingBlock({ title, note }) {
  return (
    <div className="border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{note}</p>
    </div>
  )
}

function OutcomeList({ items, tone = 'emerald' }) {
  const icon =
    tone === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' : 'text-emerald-600 dark:text-emerald-400'
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
          <FiCheckCircle className={`mt-0.5 shrink-0 ${icon}`} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PortfolioCaseStudy() {
  const { slug } = useParams()
  const project = getPublishedProjectBySlug(slug)

  if (!project) {
    return (
      <>
        <SEOHead
          title="Case study not found"
          description="The requested portfolio case study could not be found."
          path={`/portfolio/${slug || ''}`}
          noindex
        />
        <DraftPreviewBanner />
        <section className="container py-32 text-center">
          <h1 className="font-display text-3xl font-semibold text-slate-900 dark:text-white">
            Case study not found
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            This project is unpublished, removed, or the link is incorrect.
          </p>
          <Link to="/portfolio" className="btn-primary mt-8 inline-flex">
            <FiArrowLeft /> Back to portfolio
          </Link>
        </section>
      </>
    )
  }

  const fullCaseStudy = projectHasFullCaseStudy(project)
  const related = getRelatedProjects(project, 3)
  const tech = project.techCandidates || []
  const seo = caseStudySeoPage(project)
  // Card-only approved projects: visible in listing, not sitemap-indexed as case studies
  const noindex = isDraftPortfolioMode() || !fullCaseStudy

  const engineeringApproach =
    project.architectureSummary ||
    (project.responsibilities?.length
      ? project.responsibilities.join(' ')
      : null)

  const verifiedOutcomes =
    project.verifiedOutcomes?.length > 0
      ? project.verifiedOutcomes
      : project.qualitativeOutcomes?.length > 0
        ? project.qualitativeOutcomes
        : []

  const outcomesAreVerifiedScores = project.verifiedOutcomes?.length > 0

  return (
    <>
      <SEOHead
        title={fullCaseStudy ? seo.title : `${project.title} — Portfolio`}
        description={seo.description}
        path={seo.path}
        noindex={noindex}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: project.title, path: seo.path },
        ]}
        extraSchemas={
          fullCaseStudy
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'CreativeWork',
                  name: project.title,
                  description: seo.description,
                  creator: { '@type': 'Organization', name: 'Orchestrix Labs' },
                  about: project.categories,
                  keywords: [...(project.categories || []), ...tech.slice(0, 8)].join(', '),
                },
              ]
            : []
        }
      />

      <DraftPreviewBanner />

      <article className="pb-20">
        <section className="border-b border-slate-200/80 pt-28 dark:border-white/[0.06] sm:pt-32">
          <div className="container pb-10">
            <Link
              to="/portfolio"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-slate-400 dark:hover:text-white"
            >
              <FiArrowLeft /> All projects
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.categories.map((c) => (
                    <span
                      key={c}
                      className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                  {fullCaseStudy ? (
                    <span className="border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-400/25 dark:text-emerald-200">
                      Full case study
                    </span>
                  ) : (
                    <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/10 dark:text-slate-400">
                      Summary only
                    </span>
                  )}
                  {project.conditional && (
                    <span className="border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-200">
                      Conditional
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
                    {project.subtitle}
                  </p>
                )}
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                  {project.summary}
                </p>
                <p className="mt-4 text-sm text-slate-500">{project.engagementLabel}</p>
                {project.deliveryStatus && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Delivery status:</span>{' '}
                    {project.deliveryStatus}
                  </p>
                )}
              </div>

              {project.images?.[0] ? (
                <img
                  src={project.images[0]}
                  alt={`Visual for ${project.title}`}
                  className="w-full border border-slate-200 object-cover dark:border-white/10"
                />
              ) : (
                <AbstractCover
                  tone={project.coverTone}
                  title={project.title}
                  className="min-h-[14rem] border border-slate-200 dark:border-white/10"
                />
              )}
            </div>
          </div>
        </section>

        {!fullCaseStudy ? (
          <section className="container mt-10 max-w-3xl space-y-6">
            <PendingBlock
              title="Full case study not published"
              note="This engagement is listed in the curated portfolio. A long-form case study has not been approved for public indexing. Request a consultation to discuss a similar build."
            />
            {tech.length > 0 && (
              <Section title="Technologies" id="technologies">
                <div className="flex flex-wrap gap-2">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}
            <ConsultationCTA
              variant="similar"
              href={`/contact?ref=${project.slug}`}
            />
          </section>
        ) : (
          <>
            <div className="container mt-8 gap-10 lg:grid lg:grid-cols-[12rem_1fr]">
              <nav
                aria-label="Case study sections"
                className="flex gap-4 overflow-x-auto border-b border-line pb-3 scrollbar-hide lg:sticky lg:top-28 lg:flex-col lg:gap-1 lg:self-start lg:overflow-visible lg:border-b-0 lg:border-l lg:pb-0"
              >
                {CASE_NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="shrink-0 py-1 text-sm text-mute transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 lg:-ml-px lg:border-l lg:border-transparent lg:py-1.5 lg:pl-4 lg:hover:border-cyan-300"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <section className="mt-6 grid gap-10 lg:mt-0 lg:grid-cols-[1fr_0.7fr]">
              <div>
                <Section title="Business challenge" id="business-challenge">
                  <p>{project.businessChallenge || project.summary}</p>
                </Section>

                <Section title="Solution overview" id="solution-overview">
                  <p>{project.solution}</p>
                </Section>

                {engineeringApproach ? (
                  <Section title="Technical architecture" id="technical-architecture">
                    <p>{project.architectureSummary}</p>
                    {project.modules?.length > 0 && (
                      <div className="mt-6 grid gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Engagement modules
                        </p>
                        {project.modules.map((mod) => (
                          <div
                            key={mod.id}
                            className="border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                                {mod.id}. {mod.title}
                              </span>
                              <span className="border border-cyan-600/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:border-cyan-400/20 dark:text-cyan-200">
                                {mod.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                              {mod.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Section>
                ) : null}

                {project.responsibilities?.length > 0 ? (
                  <Section title="Engineering responsibilities" id="engineering-responsibilities">
                    <OutcomeList items={project.responsibilities} tone="cyan" />
                  </Section>
                ) : null}

                {project.features?.length > 0 ? (
                  <Section title="Delivered capabilities" id="capabilities">
                    <OutcomeList items={project.features} tone="cyan" />
                  </Section>
                ) : (
                  <PendingBlock
                    title="Delivered capabilities"
                    note={project.featuresNote || 'Awaiting founder verification of implemented features.'}
                  />
                )}

                {verifiedOutcomes.length > 0 ? (
                  <Section
                    title={outcomesAreVerifiedScores ? 'Verified outcomes' : 'Observed outcomes'}
                    id="verified-outcomes"
                  >
                    {project.outcomesNote && (
                      <p className="mb-2 text-xs leading-relaxed text-slate-500">{project.outcomesNote}</p>
                    )}
                    {!outcomesAreVerifiedScores && (
                      <p className="mb-2 text-xs leading-relaxed text-slate-500">
                        Qualitative outcomes from verified delivery notes. Invented metrics are not published.
                      </p>
                    )}
                    <OutcomeList items={verifiedOutcomes} />
                  </Section>
                ) : (
                  <PendingBlock
                    title="Verified outcomes"
                    note="No independently verified outcomes are approved for publication yet. Unverified percentages and financial claims are withheld."
                  />
                )}
              </div>

              <aside className="lg:self-start">
                <Section title="Technologies" id="technologies">
                  {project.techConflictNote && (
                    <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200/90">
                      {project.techConflictNote}
                    </p>
                  )}
                  {tech.length > 0 ? (
                    <>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {tech.map((t) => (
                          <span
                            key={t}
                            className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.technologyRoles?.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {project.technologyRoles.map((role) => (
                            <li key={role} className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              {role}
                            </li>
                          ))}
                        </ul>
                      )}
                      {project.techPendingVerification && (
                        <p className="mt-3 text-xs text-slate-500">
                          Listed as candidates from source materials — pending verification.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">Technology list withheld until conflicts are resolved.</p>
                  )}
                </Section>

                <Section title="Integrations" id="integrations">
                  {project.integrations?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.integrations.map((t) => (
                        <span
                          key={t}
                          className="border border-slate-200 px-3 py-1.5 text-xs text-slate-700 dark:border-white/10 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Integrations pending confirmation.</p>
                  )}
                  {project.integrationsNote && (
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">{project.integrationsNote}</p>
                  )}
                </Section>

                <ConsultationCTA
                  variant={
                    (project.categories || []).some((c) => /voice/i.test(c))
                      ? 'voice'
                      : 'similar'
                  }
                  href={`/contact?ref=${project.slug}`}
                />
              </aside>
              </section>
            </div>
          </>
        )}

        {related.length > 0 && (
          <section className="container mt-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cyan-800 dark:text-cyan-300/80">
                  Related work
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                  Related projects
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="text-sm font-semibold text-cyan-800 dark:text-cyan-300"
              >
                Browse full portfolio
              </Link>
            </div>
            <div className="flex flex-col border-t border-line">
              {related.map((p) => (
                <ProjectCard key={p.id} variant="row" project={{ ...p, hasCaseStudy: p.hasCaseStudy === true }} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
