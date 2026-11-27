import { SITE } from '../../lib/site'

export default function FounderSection() {
  return (
    <section className="section bg-paper-subtle">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
            {/* Founder photo placeholder */}
            <div className="mx-auto md:mx-0">
              <div className="w-48 h-48 rounded-lg bg-paper-elevated border border-border flex items-center justify-center">
                <span className="text-sm text-navy-muted">Photo</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-navy-primary mb-2">
                {SITE.founder}
              </h2>
              <p className="text-navy-secondary mb-6">{SITE.founderTitle}</p>
              
              <div className="space-y-4 text-navy-body leading-relaxed">
                <p>
                  I've been building software for {SITE.founderExperienceYears}+ years—starting with freelance projects 
                  and growing into full-stack AI integrations for B2B companies.
                </p>
                <p>
                  Most of my work involves taking AI prototypes and turning them into production systems 
                  that handle real user load, integrate with existing infrastructure, and actually ship on time.
                </p>
                <p>
                  I work directly with clients—no account managers, no sales team. You get technical 
                  conversations from day one and clear timelines based on actual development constraints.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/shubham-saini-ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-subtle text-sm font-medium"
                >
                  LinkedIn
                </a>
                <span className="text-border">•</span>
                <a 
                  href="https://github.com/orchestrixlabs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-subtle text-sm font-medium"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
