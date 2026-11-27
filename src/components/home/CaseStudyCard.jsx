import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

export default function CaseStudyCard({ project }) {
  const techStack = project.techStack || []
  const status = project.status || 'live'
  
  const statusConfig = {
    live: { label: 'Live in production', className: 'status-live' },
    development: { label: 'In development', className: 'status-development' },
    archived: { label: 'Archived', className: 'status-archived' },
  }

  const currentStatus = statusConfig[status] || statusConfig.live

  return (
    <article className="card p-0 overflow-hidden group">
      {/* Project screenshot placeholder */}
      {project.coverImage ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={project.coverImage}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-paper-subtle flex items-center justify-center">
          <span className="text-navy-muted text-sm">Screenshot coming soon</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title and tech stack */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-navy-primary mb-3 group-hover:text-cyan-accent transition-colors">
            {project.title}
          </h3>
          
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.slice(0, 4).map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Problem statement */}
        {project.problem && (
          <div className="mb-3">
            <span className="text-xs font-semibold text-navy-muted uppercase tracking-wide">Problem</span>
            <p className="text-sm text-navy-body mt-1 leading-relaxed">{project.problem}</p>
          </div>
        )}

        {/* What we built */}
        {project.summary && (
          <div className="mb-3">
            <span className="text-xs font-semibold text-navy-muted uppercase tracking-wide">Built</span>
            <p className="text-sm text-navy-body mt-1 leading-relaxed">{project.summary}</p>
          </div>
        )}

        {/* Stack */}
        {project.stack && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-navy-muted uppercase tracking-wide">Stack</span>
            <p className="text-sm text-navy-secondary mt-1 font-mono">{project.stack}</p>
          </div>
        )}

        {/* Status and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
          <span className={currentStatus.className}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
            {currentStatus.label}
          </span>
          
          <Link 
            to={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-cyan-accent hover:text-cyan-hover transition-colors"
          >
            View case study <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
