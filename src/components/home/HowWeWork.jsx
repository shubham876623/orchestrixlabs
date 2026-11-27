const steps = [
  {
    number: '01',
    title: 'Discovery & Planning',
    description: 'We start by understanding your business needs, existing systems, and integration requirements. No generic proposals—we map your actual workflows.',
    duration: '1-2 weeks',
  },
  {
    number: '02',
    title: 'Architecture & Design',
    description: 'We design the system architecture, API contracts, and data flows. You get technical specifications and a clear integration roadmap before we write any code.',
    duration: '1-3 weeks',
  },
  {
    number: '03',
    title: 'Development & Integration',
    description: 'We build, test, and integrate with your existing systems. Regular demos keep you updated. We handle edge cases, error handling, and production readiness.',
    duration: '4-12 weeks',
  },
  {
    number: '04',
    title: 'Testing & Deployment',
    description: 'We deploy to your infrastructure (or ours), run load tests, monitor performance, and provide documentation. Post-launch support ensures smooth operations.',
    duration: '1-2 weeks',
  },
]

export default function HowWeWork() {
  return (
    <section className="section bg-paper-subtle">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="section-heading mb-4">How We Work</h2>
          <p className="section-subheading mx-auto">
            A structured process from discovery to deployment—built for teams with real constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-flat p-6 hover:border-cyan-accent transition-all duration-base"
            >
              {/* Step number */}
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-subtle flex items-center justify-center font-mono text-lg font-semibold text-cyan-accent">
                  {step.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-navy-primary mb-1">
                    {step.title}
                  </h3>
                  <span className="inline-block px-2 py-0.5 bg-paper-subtle text-navy-muted text-xs font-mono rounded">
                    {step.duration}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-navy-body leading-relaxed">
                {step.description}
              </p>

              {/* Connector line to next step (except last) */}
              {index < steps.length - 1 && index % 2 === 0 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-6 border-t-2 border-dashed border-border" aria-hidden="true"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
