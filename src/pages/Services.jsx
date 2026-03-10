import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiCheck, FiMic, FiCpu, FiCode, FiGlobe, FiZap } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import { services, process } from '../data/services'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Section({ children, className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.section>
  )
}

const iconMap = { voice: FiMic, brain: FiCpu, code: FiCode, globe: FiGlobe, workflow: FiZap }

const gradients = {
  violet:  { card: 'from-violet-500/10  to-dark-900',  badge: 'bg-violet-500/10  border-violet-500/20  text-violet-400',  icon: 'bg-violet-500/15  text-violet-400'  },
  indigo:  { card: 'from-indigo-500/10  to-dark-900',  badge: 'bg-indigo-500/10  border-indigo-500/20  text-indigo-400',  icon: 'bg-indigo-500/15  text-indigo-400'  },
  cyan:    { card: 'from-cyan-500/10    to-dark-900',  badge: 'bg-cyan-500/10    border-cyan-500/20    text-cyan-400',    icon: 'bg-cyan-500/15    text-cyan-400'    },
  emerald: { card: 'from-emerald-500/10 to-dark-900',  badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: 'bg-emerald-500/15 text-emerald-400' },
  orange:  { card: 'from-orange-500/10  to-dark-900',  badge: 'bg-orange-500/10  border-orange-500/20  text-orange-400',  icon: 'bg-orange-500/15  text-orange-400'  },
}

const faq = [
  { q: 'How long does a typical project take?', a: 'Depends on scope — automation bots take 1–2 weeks, voice AI systems 2–4 weeks, full-stack platforms 4–8 weeks. You\'ll get a detailed estimate before we start.' },
  { q: 'Do you work on fixed-price or hourly contracts?', a: 'Both. For well-defined projects, fixed-price works great. For evolving or research-heavy work, hourly with weekly milestones keeps things transparent.' },
  { q: 'What\'s your tech stack preference?', a: 'Python-first backend (Django, FastAPI, Flask), React frontend, PostgreSQL or Supabase for databases, AWS/DigitalOcean for deployment.' },
  { q: 'Do you provide post-launch support?', a: 'Yes. We offer bug fixes, feature additions, and maintenance. Most projects include a free 2-week post-launch support window.' },
  { q: 'Can you work with our existing codebase?', a: 'Absolutely. We\'ve migrated legacy systems, added features to existing apps, and extended third-party platforms. We always read the code before touching it.' },
]

export default function Services() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [hash])

  return (
    <>
      <SEOHead
        title="Services"
        description="Expert AI development services: Voice AI agents, machine learning, full-stack web development, web scraping, and workflow automation. Hire top-rated Python & AI developers at Orchestrix Labs."
        path="/services"
      />

      {/* Hero */}
      <section className="relative pt-36 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-950" />
        <div className="container relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="section-tag mb-5 inline-flex"
          >
            Our Services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="section-heading mb-5"
          >
            Everything you need to build<br />
            <span className="gradient-text">an intelligent business</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="section-sub mx-auto"
          >
            From AI voice agents to end-to-end web platforms — we cover the full spectrum
            of modern software development with a specialisation in AI integration.
          </motion.p>
        </div>
      </section>

      {/* Service Cards */}
      <Section className="py-20">
        <div className="container space-y-8">
          {services.map((svc, i) => {
            const Icon = iconMap[svc.icon]
            const g = gradients[svc.accent]
            return (
              <motion.div
                key={svc.id}
                id={svc.id}
                custom={i}
                variants={fadeUp}
                className={`relative rounded-3xl bg-gradient-to-br ${g.card} border border-white/[0.07] p-8 lg:p-10 hover:border-white/[0.12] transition-all duration-300`}
              >
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Left */}
                  <div className="lg:w-2/5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${g.icon}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold mb-4 ${g.badge}`}>
                      {svc.title}
                    </span>
                    <h2 className="text-white font-bold text-2xl lg:text-3xl mb-3 leading-tight">
                      {svc.tagline}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {svc.description}
                    </p>
                    <Link to="/contact" className="btn-primary text-sm">
                      Get Started <FiArrowRight />
                    </Link>
                  </div>

                  {/* Right */}
                  <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {svc.features.map(f => (
                      <div key={f} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiCheck size={10} className="text-emerald-400" />
                        </div>
                        <span className="text-slate-300 text-sm leading-relaxed">{f}</span>
                      </div>
                    ))}

                    {/* Tools */}
                    <div className="sm:col-span-2 pt-4 border-t border-white/[0.06] mt-2">
                      <p className="text-slate-600 text-xs mb-2 uppercase tracking-wider">Tools & Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {svc.tools.map(t => (
                          <span key={t} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-400 text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* Process */}
      <Section className="py-24 bg-dark-900/40">
        <div className="container">
          <div className="text-center mb-14">
            <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">Our Process</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
              How we work with <span className="gradient-text">you</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <motion.div key={p.step} custom={i} variants={fadeUp} className="card text-center">
                <span className="text-5xl font-black gradient-text block mb-4">{p.step}</span>
                <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-24">
        <div className="container max-w-3xl">
          <div className="text-center mb-14">
            <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">FAQ</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-heading">
              Common <span className="gradient-text">questions</span>
            </motion.h2>
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} className="card">
                <h3 className="text-white font-semibold text-base mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-20">
        <div className="container text-center">
          <motion.div variants={fadeUp} custom={0} className="glass p-12 rounded-3xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-4">
              Not sure which service fits?
            </h2>
            <p className="text-slate-400 mb-8">
              Tell us your problem. We'll figure out the right solution together — no commitment required.
            </p>
            <Link to="/contact" className="btn-primary">
              Book a Free Discovery Call <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
