import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FiArrowRight, FiCheck,
  FiMic, FiCpu, FiCode, FiGlobe, FiZap, FiCloud,
} from 'react-icons/fi'
import {
  SiPython, SiDjango, SiFastapi, SiFlask, SiReact,
  SiOpenai, SiDocker, SiPostgresql,
  SiMysql, SiSelenium, SiTailwindcss,
} from 'react-icons/si'
import SEOHead from '../components/SEOHead'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
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

const values = [
  { icon: FiCheck, title: 'Production-First', desc: 'We don\'t ship demos. Every project is built with scalability, error handling, and real-world edge cases in mind.' },
  { icon: FiCheck, title: 'Transparent Communication', desc: 'Weekly updates, clear milestones, and honest assessments. You always know where your project stands.' },
  { icon: FiCheck, title: 'Deep Specialization', desc: 'Six-plus years focused on Python, AI, and automation — not a generalist agency. We go deep in our domains.' },
  { icon: FiCheck, title: 'Results-Driven', desc: 'We measure success by your outcomes: hours saved, errors reduced, revenue generated. Not lines of code written.' },
]

const expertise = [
  { category: 'AI & Machine Learning', icon: FiCpu, color: 'indigo', items: ['Voice AI (Twilio, Retell.ai, SynthFlow)', 'RAG Systems (LangChain + FAISS)', 'Computer Vision (U-2-Net, OpenCV)', 'Multi-agent AI Orchestration', 'GPT-4, Claude, open-source LLMs'] },
  { category: 'Full-Stack Development', icon: FiCode, color: 'cyan', items: ['Django, FastAPI, Flask backends', 'React + Vite + Tailwind frontends', 'REST API design and documentation', 'Database design (PostgreSQL, MySQL)', 'Real-time systems (WebSockets, Supabase)'] },
  { category: 'Automation & Scraping', icon: FiGlobe, color: 'emerald', items: ['Selenium, Playwright, Scrapy', 'CAPTCHA bypass and proxy rotation', 'n8n and Zapier workflow design', 'ETL pipelines and data transformation', 'Form automation for web systems'] },
  { category: 'DevOps & Deployment', icon: FiZap, color: 'orange', items: ['AWS EC2, Azure App Service, DigitalOcean', 'Nginx, SSL/TLS, reverse proxy setup', 'Docker containerization', 'CI/CD pipeline configuration', 'Monitoring and error alerting'] },
]

const colorMap = {
  indigo:  { border: 'border-indigo-500/20',  icon: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
  cyan:    { border: 'border-cyan-500/20',    icon: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  emerald: { border: 'border-emerald-500/20', icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  orange:  { border: 'border-orange-500/20',  icon: 'text-orange-400',  bg: 'bg-orange-500/10'  },
}

const stack = [
  { icon: SiPython,            label: 'Python' },
  { icon: SiDjango,            label: 'Django' },
  { icon: SiFastapi,           label: 'FastAPI' },
  { icon: SiFlask,             label: 'Flask' },
  { icon: SiReact,             label: 'React' },
  { icon: SiOpenai,            label: 'OpenAI' },
  { icon: FiCloud,             label: 'AWS' },
  { icon: SiDocker,            label: 'Docker' },
  { icon: SiPostgresql,        label: 'PostgreSQL' },
  { icon: SiMysql,             label: 'MySQL' },
  { icon: SiSelenium,          label: 'Selenium' },
  { icon: SiTailwindcss,       label: 'Tailwind' },
]

export default function About() {
  return (
    <>
      <SEOHead
        title="About"
        description="Orchestrix Labs is a Python & AI development company with 6+ years experience. We build voice AI, automation systems, and full-stack applications that deliver real business outcomes."
        path="/about"
      />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-950" />
        <div className="container relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="section-tag mb-5 inline-flex"
          >
            About Us
          </motion.span>
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="section-heading mb-6"
            >
              We turn complex problems into{' '}
              <span className="gradient-text">intelligent software</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed"
            >
              Orchestrix Labs is a boutique AI & software development company founded to bridge
              the gap between cutting-edge AI capabilities and practical business implementation.
              We don't just write code — we build systems that save time, reduce errors, and
              unlock new revenue streams.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story */}
      <Section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span variants={fadeUp} custom={0} className="section-tag mb-5 inline-flex">Our Story</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black text-white mb-6">
                From freelancer to<br /><span className="gradient-text">full AI company</span>
              </motion.h2>
              <div className="space-y-4 text-slate-400 text-base leading-relaxed">
                <motion.p variants={fadeUp} custom={2}>
                  Orchestrix Labs grew out of 6+ years of hands-on work as a top-rated Python
                  developer and AI specialist. Starting with automation scripts and web scrapers,
                  the work evolved into complex voice AI pipelines, multi-agent systems, and
                  production-grade full-stack platforms.
                </motion.p>
                <motion.p variants={fadeUp} custom={3}>
                  Having delivered 16+ projects across industries — from healthcare AI assistants
                  to restaurant voice ordering systems — we formalized as Orchestrix Labs to bring
                  that expertise to a wider range of businesses with a structured, reliable process.
                </motion.p>
                <motion.p variants={fadeUp} custom={4}>
                  Today, Orchestrix Labs serves startups and growing businesses worldwide, helping
                  them harness AI and automation to operate faster, smarter, and at scale.
                </motion.p>
              </div>
            </div>

            {/* Stats card */}
            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 gap-4">
              {[
                { v: '100%',   l: 'Job Success Score' },
                { v: '143+',   l: 'Jobs Completed' },
                { v: '$100K+', l: 'Earned on Upwork' },
                { v: '4,824',  l: 'Hours Worked' },
              ].map(({ v, l }) => (
                <div key={l} className="card text-center py-8">
                  <div className="text-4xl font-black gradient-text mb-2">{v}</div>
                  <p className="text-slate-500 text-sm">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="py-20 bg-dark-900/40">
        <div className="container">
          <div className="text-center mb-14">
            <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">Our Values</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-heading">
              How we <span className="gradient-text">operate</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} custom={i} variants={fadeUp} className="card flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="text-primary-400" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1.5">{v.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Expertise */}
      <Section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">Expertise</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-heading">
              Deep skills across the<br /><span className="gradient-text">full AI stack</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {expertise.map((area, i) => {
              const Icon = area.icon
              const c = colorMap[area.color]
              return (
                <motion.div key={area.category} custom={i} variants={fadeUp} className={`card border ${c.border}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                      <Icon className={c.icon} size={18} />
                    </div>
                    <h3 className="text-white font-bold text-base">{area.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {area.items.map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-slate-400 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full ${c.bg.replace('/10', '/50')} flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Tech Stack */}
      <Section className="py-20 bg-dark-900/40">
        <div className="container">
          <div className="text-center mb-12">
            <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">Tech Stack</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-heading">
              Our <span className="gradient-text">toolbox</span>
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} custom={2} className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {stack.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-primary-500/30 hover:bg-primary-500/5 transition-all duration-200 group">
                <Icon className="text-slate-400 group-hover:text-primary-400 transition-colors" size={28} />
                <span className="text-slate-600 text-xs text-center group-hover:text-slate-400 transition-colors">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-20">
        <div className="container text-center">
          <motion.h2 variants={fadeUp} custom={0} className="section-heading mb-4">
            Ready to work together?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="section-sub mx-auto mb-8">
            Let's discuss your project and see if we're a good fit.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary text-base px-8 py-3.5">
              Get in Touch <FiArrowRight />
            </Link>
            <Link to="/portfolio" className="btn-outline text-base px-8 py-3.5">
              See Our Work
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
