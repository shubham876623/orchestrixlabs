import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import DraftPreviewBanner from '../components/portfolio/DraftPreviewBanner'
import ProjectMedia from '../components/portfolio/ProjectMedia'
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
      className="scroll-mt-28 border-t border-border py-8 first:border-t-0 first:pt-0"
    >
      <h2 className="font-display text-xl font-semibold tracking-tight text-navy-primary">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-navy-body sm:text-base">
        {children}
      </div>
    </section>
  )
}

function PendingBlock({ title, note }) {
  return (
    <div className="border border-dashed border-slate-300 bg-slate-50 p-5 ">
      <h2 className="font-display text-lg font-semibold text-slate-900 ">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-muted ">{note}</p>
    </div>
  )
}

function OutcomeList({ items, tone = 'emerald' }) {
  const icon =
    tone === 'cyan' ? 'text-cyan-600 ' : 'text-emerald-600 '
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-slate-700 ">
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
          <h1 className="font-display text-3xl font-semibold text-slate-900 ">
            Case study not found
          </h1>
          <p className="mt-3 text-slate-600 ">
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
        <section className="border-b border-slate-200/80 pt-28 sm:pt-32">
          <div className="container pb-10">
            <Link
              to="/portfolio"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-navy-muted transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 "
            >
              <FiArrowLeft /> All projects
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.categories.map((c) => (
                    <span
                      key={c}
                      className="border border-slate-200 bg-slate-50 rounded-full px-2.5 py-0.5 text-xs font-semibold text-slate-700 "
                    >
                      {c}
                    </span>
                  ))}
                  {fullCaseStudy ? (
                    <span className="border border-status-success/40 bg-status-success-bg rounded-full px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ">
                      Full case study
                    </span>
                  ) : (
                    <span className="border border-slate-200 bg-slate-50 rounded-full px-2.5 py-0.5 text-xs font-semibold text-slate-600 ">
                      Summary only
                    </span>
                  )}
                  {project.conditional && (
                    <span className="border border-status-warning/40 bg-status-warning-bg rounded-full px-2.5 py-0.5 text-xs font-semibold text-amber-800 ">
                      Conditional
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
                    {project.subtitle}
                  </p>
                )}
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {project.summary}
                </p>
                <p className="mt-4 text-sm text-navy-muted">{project.engagementLabel}</p>
                {project.deliveryStatus && (
                  <p className="mt-2 text-xs leading-relaxed text-navy-muted">
                    <span className="font-semibold text-slate-600 ">Delivery status:</span>{' '}
                    {project.deliveryStatus}
                  </p>
                )}
              </div>

              <ProjectMedia project={project} className="aspect-[16/10] min-h-[14rem]" />
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
                      className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 "
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
                className="flex gap-4 overflow-x-auto border-b border-border pb-3 scrollbar-hide lg:sticky lg:top-28 lg:flex-col lg:gap-1 lg:self-start lg:overflow-visible lg:border-b-0 lg:border-l lg:pb-0"
              >
                {CASE_NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="shrink-0 py-1 text-sm text-navy-muted transition-colors hover:text-navy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 lg:-ml-px lg:border-l lg:border-transparent lg:py-1.5 lg:pl-4 lg:hover:border-cyan-accent"
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
                        <p className="text-xs font-semibold text-navy-muted">
                          Engagement modules
                        </p>
                        {project.modules.map((mod) => (
                          <div
                            key={mod.id}
                            className="border border-slate-200 bg-slate-50 p-4 "
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-sm font-semibold text-slate-900 ">
                                {mod.id}. {mod.title}
                              </span>
                              <span className="border border-cyan-600/25 bg-cyan-subtle px-2 py-0.5 text-xs font-semiboldr text-cyan-800 ">
                                {mod.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 ">
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
                      <p className="mb-2 text-xs leading-relaxed text-navy-muted">{project.outcomesNote}</p>
                    )}
                    {!outcomesAreVerifiedScores && (
                      <p className="mb-2 text-xs leading-relaxed text-navy-muted">
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
                    <p className="text-sm leading-relaxed text-amber-800 ">
                      {project.techConflictNote}
                    </p>
                  )}
                  {tech.length > 0 ? (
                    <>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {tech.map((t) => (
                          <span
                            key={t}
                            className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 "
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.technologyRoles?.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {project.technologyRoles.map((role) => (
                            <li key={role} className="text-xs leading-relaxed text-navy-muted ">
                              {role}
                            </li>
                          ))}
                        </ul>
                      )}
                      {project.techPendingVerification && (
                        <p className="mt-3 text-xs text-navy-muted">
                          Listed as candidates from source materials — pending verification.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-navy-muted">Technology list withheld until conflicts are resolved.</p>
                  )}
                </Section>

                <Section title="Integrations" id="integrations">
                  {project.integrations?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.integrations.map((t) => (
                        <span
                          key={t}
                          className="border border-slate-200 px-3 py-1.5 text-xs text-slate-700 "
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-navy-muted">Integrations pending confirmation.</p>
                  )}
                  {project.integrationsNote && (
                    <p className="mt-3 text-xs leading-relaxed text-navy-muted">{project.integrationsNote}</p>
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
                <p className="font-display text-xs font-semibold text-cyan-800 ">
                  Related work
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 ">
                  Related projects
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="text-sm font-semibold text-cyan-800 "
              >
                Browse full portfolio
              </Link>
            </div>
            <div className="flex flex-col border-t border-border">
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
