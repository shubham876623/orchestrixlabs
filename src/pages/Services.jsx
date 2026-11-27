import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SEOHead from '../components/SEOHead'
import api from '../lib/axios'
import { services, process } from '../data/services'
import { getSeoPage } from '../lib/seoPages'

const SERVICE_PORTFOLIO_LINKS = {
  voice: '/portfolio?category=Voice%20AI',
  brain: '/portfolio?category=AI%20Agents',
  code: '/portfolio?category=Full-Stack%20Development',
  globe: '/portfolio?category=Data%20%26%20Analytics',
  workflow: '/portfolio?category=Automation',
}

const fallbackFaq = [
  { question: 'How long does a typical project take?', answer: 'Depends on scope — automation bots take 1–2 weeks, voice AI systems 2–4 weeks, full-stack platforms 4–8 weeks. You\'ll get a detailed estimate before we start.' },
  { question: 'Do you work on fixed-price or hourly contracts?', answer: 'Both. For well-defined projects, fixed-price works great. For evolving or research-heavy work, hourly with weekly milestones keeps things transparent.' },
  { question: 'What\'s your tech stack preference?', answer: 'Python-first backend (Django, FastAPI, Flask), React frontend, PostgreSQL or Supabase for databases, AWS/DigitalOcean for deployment.' },
  { question: 'Do you provide post-launch support?', answer: 'Yes. We offer bug fixes, feature additions, and maintenance. Most projects include a free 2-week post-launch support window.' },
  { question: 'Can you work with our existing codebase?', answer: 'Absolutely. We\'ve migrated legacy systems, added features to existing apps, and extended third-party platforms. We always read the code before touching it.' },
]

function Label({ children }) {
  return <h3 className="text-navy-secondary text-xs font-medium mb-3">{children}</h3>
}

export default function Services() {
  const { hash } = useLocation()
  const [faq, setFaq] = useState(fallbackFaq)

  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [hash])

  useEffect(() => {
    api.get('/api/faqs/').then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setFaq(r.data)
    }).catch(() => {})
  }, [])

  return (
    <>
      <SEOHead
        title={getSeoPage('/services')?.title}
        description={getSeoPage('/services')?.description}
        path="/services"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />

      <section className="pt-36 pb-14">
        <div className="container">
          <h1 className="section-heading mb-5">Services</h1>
          <p className="section-sub">
            Voice AI, automation, custom platforms, and integrations—scoped for real business
            constraints and delivered with clear milestones.
          </p>
        </div>
      </section>

      <section className="pb-10">
        <div className="container">
          {services.map(svc => (
            <article key={svc.id} id={svc.id} className="border-t border-border py-10">
              <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-8">
                <div>
                  <h2 className="text-white font-display font-semibold text-xl mb-4">{svc.title}</h2>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/contact" className="btn-primary text-sm">Discuss this</Link>
                    <Link to={SERVICE_PORTFOLIO_LINKS[svc.icon] || '/portfolio'} className="btn-outline text-sm">
                      Related work
                    </Link>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <Label>Problem</Label>
                    <p className="text-white text-lg leading-snug">{svc.tagline}</p>
                  </div>
                  <div>
                    <Label>What we build</Label>
                    <p className="text-navy-body text-sm leading-relaxed mb-4">{svc.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {svc.features.map(f => (
                        <li key={f} className="text-navy-body text-sm leading-relaxed">{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label>Fit</Label>
                    <p className="text-navy-secondary text-sm leading-relaxed">{svc.tools.join(' · ')}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <h2 className="text-white font-display font-semibold text-2xl mb-8">How we work</h2>
          <ol>
            {process.map(p => (
              <li key={p.step} className="border-t border-border py-6 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-2 lg:gap-8">
                <h3 className="text-white font-semibold text-base">
                  <span className="text-navy-secondary font-normal mr-3">{p.step}</span>{p.title}
                </h3>
                <p className="text-navy-body text-sm leading-relaxed">{p.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <h2 className="text-white font-display font-semibold text-2xl mb-8">Common questions</h2>
          <div>
            {faq.map((item, i) => (
              <div key={i} className="border-t border-border py-6 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-2 lg:gap-8">
                <h3 className="text-white font-semibold text-base">{item.question}</h3>
                <p className="text-navy-body text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container border-t border-border pt-10">
          <h2 className="text-white font-display font-semibold text-2xl mb-3">Not sure where to start?</h2>
          <p className="text-navy-body mb-6 max-w-xl">
            Describe the workflow you want to improve. We will recommend a practical path—no commitment
            required to start the conversation.
          </p>
          <Link to="/contact" className="btn-primary">Discuss this</Link>
        </div>
      </section>
    </>
  )
}
