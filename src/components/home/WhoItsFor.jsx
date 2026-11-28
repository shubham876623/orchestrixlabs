import BookCallLink from '../BookCallLink'
import { FiCheck } from 'react-icons/fi'

const targetClients = [
  {
    type: 'B2B SaaS Companies',
    description: 'Adding AI features to existing products—voice assistants, smart search, automated workflows.',
    examples: [
      'AI-powered customer support chatbots',
      'Voice-based CRM data entry',
      'Automated document processing',
    ],
  },
  {
    type: 'Field Operations Teams',
    description: 'Mobile tools for teams working on-site—inspection apps, offline-first systems, real-time sync.',
    examples: [
      'Field technician scheduling systems',
      'Offline data collection apps',
      'Real-time job tracking dashboards',
    ],
  },
  {
    type: 'Growing Tech Teams',
    description: 'Engineering bandwidth for strategic projects when your core team is at capacity.',
    examples: [
      'API integrations with third-party services',
      'Database migrations and optimization',
      'Prototype-to-production development',
    ],
  },
]

export default function WhoItsFor() {
  return (
    <section className="section">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="section-heading mb-4">Who It's For</h2>
          <p className="section-subheading mx-auto">
            We work with companies that need production-ready systems, not demos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {targetClients.map((client) => (
            <div key={client.type} className="card p-6">
              <h3 className="text-lg font-semibold text-navy-primary mb-3">
                {client.type}
              </h3>
              <p className="text-sm text-navy-body leading-relaxed mb-4">
                {client.description}
              </p>
              <div className="space-y-2">
                {client.examples.map((example) => (
                  <div key={example} className="flex items-start gap-2">
                    <FiCheck className="flex-shrink-0 text-cyan-accent mt-0.5" size={16} aria-hidden="true" />
                    <span className="text-sm text-navy-secondary">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-navy-secondary mb-4">
            Not sure if we're a fit? Let's talk.
          </p>
          <BookCallLink />
        </div>
      </div>
    </section>
  )
}
