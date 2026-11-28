import { Link } from 'react-router-dom'
import ProjectMedia from '../portfolio/ProjectMedia'

/**
 * Home-page case study card, built from the published project record:
 * businessChallenge (problem), summary (what we built), techCandidates (stack),
 * deliveryStatus (shown as-is; never assumed to be "live"), images (approved screenshots only).
 */
export default function CaseStudyCard({ project }) {
  const stack = project.techPendingVerification ? [] : (project.techCandidates || []).slice(0, 5)

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-paper-elevated transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-md">
      <ProjectMedia project={project} className="aspect-[16/10] rounded-none border-0 border-b" />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold leading-snug text-navy-primary">
          <Link to={`/portfolio/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:underline">
            {project.title}
          </Link>
        </h3>

        {project.businessChallenge && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-body">
            <span className="font-medium text-navy-primary">Problem: </span>
            {project.businessChallenge}
          </p>
        )}
        {project.summary && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-secondary">{project.summary}</p>
        )}

        {stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technology">
            {stack.map((tech) => (
              <li key={tech} className="rounded-full border border-border bg-paper-subtle px-2.5 py-0.5 text-xs text-navy-secondary">
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          {project.deliveryStatus ? (
            <span className="rounded-full border border-border bg-paper-subtle px-2.5 py-0.5 text-xs font-medium text-navy-secondary">
              {project.deliveryStatus}
            </span>
          ) : <span />}
          <span className="text-sm font-semibold text-cyan-hover">Read the case study</span>
        </div>
      </div>
    </article>
  )
}
