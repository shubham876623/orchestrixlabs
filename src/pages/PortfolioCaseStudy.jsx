import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import DraftPreviewBanner from '../components/portfolio/DraftPreviewBanner'
import AbstractCover from '../components/portfolio/AbstractCover'
import ProjectCard from '../components/portfolio/ProjectCard'
import { caseStudySeoPage } from '../lib/seoPages'
import {
  getPublishedProjectBySlug,
  getRelatedProjects,
  isDraftPortfolioMode,
} from '../data/publishedProjects'

function PendingBlock({ title, note }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-5">
      <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{note}</p>
    </div>
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
          <h1 className="font-display text-3xl font-semibold text-white">Case study not found</h1>
          <p className="mt-3 text-slate-400">This project is unpublished, removed, or the link is incorrect.</p>
          <Link to="/portfolio" className="btn-primary mt-8 inline-flex">
            <FiArrowLeft /> Back to portfolio
          </Link>
        </section>
      </>
    )
  }

  const related = getRelatedProjects(project)
  const tech = project.techCandidates || []
  const seo = caseStudySeoPage(project)

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        noindex={isDraftPortfolioMode()}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: project.title, path: seo.path },
        ]}
        extraSchemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: seo.description,
            creator: { '@type': 'Organization', name: 'Orchestrix Labs' },
            about: project.categories,
          },
        ]}
      />

      <DraftPreviewBanner />

      <article className="pb-20">
        <section className="border-b border-white/[0.06] pt-28 sm:pt-32">
          <div className="container pb-10">
            <Link
              to="/portfolio"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <FiArrowLeft /> All projects
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                  {project.conditional && (
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-200">
                      Conditional
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg">
                    {project.subtitle}
                  </p>
                )}
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                  {project.summary}
                </p>
                <p className="mt-4 text-sm text-slate-500">{project.engagementLabel}</p>
                {project.deliveryStatus && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    <span className="font-semibold text-slate-400">Delivery status:</span> {project.deliveryStatus}
                  </p>
                )}
              </div>

              {project.images?.[0] ? (
                <img
                  src={project.images[0]}
                  alt={`Visual for ${project.title}`}
                  className="w-full rounded-2xl border border-white/10 object-cover"
                />
              ) : (
                <AbstractCover
                  tone={project.coverTone}
                  title={project.title}
                  className="min-h-[14rem] rounded-2xl border border-white/10"
                />
              )}
            </div>
          </div>
        </section>

        <section className="container mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-white">Business problem</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                {project.businessChallenge || project.summary}
              </p>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-white">Solution approach</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{project.solution}</p>
            </section>

            {project.responsibilities?.length > 0 && (
              <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-white">Engineering responsibilities</h2>
                <ul className="mt-4 space-y-3">
                  {project.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-300">
                      <FiCheckCircle className="mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.modules?.length > 0 && (
              <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-white">Engagement modules</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Six linked workstreams under one engagement — delivery status is explicit for each module.
                </p>
                <div className="mt-5 grid gap-3 sm:gap-4">
                  {project.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
                    >
                      <div className="flex flex-wrap items-center gap-2 gap-y-2">
                        <span className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                          {mod.id}. {mod.title}
                        </span>
                        <span className="rounded-md border border-cyan-600/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-800 dark:border-cyan-400/20 dark:text-cyan-200">
                          {mod.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{mod.summary}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.features?.length > 0 ? (
              <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-white">Delivered capabilities</h2>
                <ul className="mt-4 space-y-3">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-slate-300">
                      <FiCheckCircle className="mt-0.5 shrink-0 text-cyan-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <PendingBlock
                title="Delivered capabilities"
                note={project.featuresNote || 'Awaiting founder verification of implemented features.'}
              />
            )}

            {project.qualitativeOutcomes?.length > 0 ? (
              <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-white">Outcomes</h2>
                {project.outcomesNote && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{project.outcomesNote}</p>
                )}
                <ul className="mt-4 space-y-3">
                  {project.qualitativeOutcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-sm text-slate-300">
                      <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : project.verifiedOutcomes?.length > 0 ? (
              <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-white">Verified outcomes</h2>
                <ul className="mt-4 space-y-3">
                  {project.verifiedOutcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-sm text-slate-300">
                      <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <PendingBlock
                title="Verified outcomes"
                note="No independently verified outcomes are approved for publication yet. Unverified percentages and financial claims are withheld."
              />
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-white">Architecture</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {project.architectureSummary}
              </p>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-white">Technologies</h2>
              {project.techConflictNote && (
                <p className="mt-3 text-sm leading-relaxed text-amber-200/90">{project.techConflictNote}</p>
              )}
              {tech.length > 0 ? (
                <>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {project.technologyRoles?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {project.technologyRoles.map((role) => (
                        <li key={role} className="text-xs leading-relaxed text-slate-400">
                          {role}
                        </li>
                      ))}
                    </ul>
                  )}
                  {project.techPendingVerification && (
                    <p className="mt-3 text-xs text-slate-500">Listed as candidates from source materials — pending verification.</p>
                  )}
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-400">Technology list withheld until conflicts are resolved.</p>
              )}
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-white">Integrations</h2>
              {project.integrations?.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.integrations.map((t) => (
                    <span key={t} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">Integrations pending confirmation.</p>
              )}
              {project.integrationsNote && (
                <p className="mt-3 text-xs leading-relaxed text-slate-500">{project.integrationsNote}</p>
              )}
            </section>

            <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-white">Build something similar</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {project.closingText ||
                  'Share your workflow constraints and target stack. We will respond with a practical delivery plan.'}
              </p>
              <Link
                to={`/contact?ref=${project.slug}`}
                className="btn-primary mt-5"
              >
                {project.closingCta || 'Book a consultation'} <FiArrowRight />
              </Link>
            </section>
          </aside>
        </section>

        {related.length > 0 && (
          <section className="container mt-16">
            <h2 className="font-display text-2xl font-semibold text-white">Related projects</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
