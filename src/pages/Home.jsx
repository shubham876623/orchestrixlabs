import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FiArrowRight, FiCode, FiCpu, FiGlobe, FiZap, FiMic,
  FiCheckCircle, FiStar, FiCloud,
} from 'react-icons/fi'
import { SiPython, SiDjango, SiFastapi, SiReact, SiOpenai,
         SiDocker, SiPostgresql, SiTailwindcss } from 'react-icons/si'
import { useState, useEffect } from 'react'
import api from '../lib/axios'
import SEOHead from '../components/SEOHead'
import { services } from '../data/services'

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Section({ children, className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Service icon map ─────────────────────────────────────────────────────────
const serviceIcons = {
  voice: FiMic, brain: FiCpu, code: FiCode, globe: FiGlobe, workflow: FiZap,
}

const colorMap = {
  violet: 'from-violet-500/20 to-purple-600/5 border-violet-500/20 group-hover:border-violet-500/40',
  indigo: 'from-indigo-500/20 to-blue-600/5 border-indigo-500/20 group-hover:border-indigo-500/40',
  cyan:   'from-cyan-500/20 to-teal-600/5 border-cyan-500/20 group-hover:border-cyan-500/40',
  emerald:'from-emerald-500/20 to-green-600/5 border-emerald-500/20 group-hover:border-emerald-500/40',
  orange: 'from-orange-500/20 to-amber-600/5 border-orange-500/20 group-hover:border-orange-500/40',
}
const iconColorMap = {
  violet: 'text-violet-400', indigo: 'text-indigo-400',
  cyan: 'text-cyan-400', emerald: 'text-emerald-400', orange: 'text-orange-400',
}

const techStack = [
  { icon: SiPython,            label: 'Python' },
  { icon: SiDjango,            label: 'Django' },
  { icon: SiFastapi,           label: 'FastAPI' },
  { icon: SiReact,             label: 'React' },
  { icon: SiOpenai,            label: 'OpenAI' },
  { icon: FiCloud,             label: 'AWS' },
  { icon: SiDocker,            label: 'Docker' },
  { icon: SiPostgresql,        label: 'PostgreSQL' },
  { icon: SiTailwindcss,       label: 'Tailwind' },
]

function useSiteStats() {
  const defaults = { total_earnings: '$100K+', total_hours: 4828, total_jobs: 200, years_experience: 6, jss_score: 100 }
  const [s, setS] = useState(defaults)
  useEffect(() => {
    api.get('/api/site-stats/').then(r => {
      if (r.data && typeof r.data === 'object' && !Array.isArray(r.data))
        setS(prev => ({ ...prev, ...r.data }))
    }).catch(() => {})
  }, [])
  return s
}

// Fallback data — overridden by CMS API when available
const fallbackTestimonials = [
  { client_name: 'Verified Upwork Client', client_role: 'AI Framework Development', rating: 5, tags: ['Collaborative', 'Committed to Quality'], quote: 'Love working with Shubham, he\'s the best at what he does and he always tries his best! Thanks Shubham!' },
  { client_name: 'Verified Upwork Client', client_role: 'Qualitative Data Analysis', rating: 5, tags: ['Committed to Quality'], quote: 'Shubham delivered high-quality work on the qualitative analysis project. He had a strong understanding of qualitative research methods, provided well-structured and insightful analysis and ensured that all deliverables were aligned with the project requirements.' },
  { client_name: 'Verified Upwork Client', client_role: 'Web Scraping & Data Collection', rating: 5, tags: ['Reliable', 'Committed to Quality', 'Solution Oriented'], quote: 'He was excellent to work with and would highly recommend. Fast, reliable, and did great work.' },
  { client_name: 'Verified Upwork Client', client_role: 'AI & Full-Stack Development', rating: 5, tags: ['Clear Communicator', 'Collaborative'], quote: 'Experienced coder for AI related projects offering full stack development, great communicator and cooperator.' },
]

const fallbackBadges = [
  { label: 'Collaborative', count: 28 },
  { label: 'Clear Communicator', count: 24 },
  { label: 'Committed to Quality', count: 23 },
  { label: 'Reliable', count: 18 },
  { label: 'Solution Oriented', count: 15 },
  { label: 'Accountable for Outcomes', count: 8 },
]

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  const siteStats = useSiteStats()
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient grid-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-950" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="section-tag">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for new projects
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white mb-6"
        >
          Build Smarter.{' '}
          <br className="hidden sm:block" />
          Scale Faster.{' '}
          <br className="hidden sm:block" />
          <span className="gradient-text">With AI.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Orchestrix Labs builds production-ready AI systems, voice bots,
          automation pipelines, and full-stack applications — delivered by
          a specialized team with 6+ years of Python & AI expertise.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link to="/portfolio" className="btn-primary text-base px-8 py-3.5">
            See Our Work <FiArrowRight />
          </Link>
          <Link to="/contact" className="btn-outline text-base px-8 py-3.5">
            Start a Project
          </Link>
        </motion.div>

        {/* ── Stats strip — visible immediately in hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {/* Top Rated */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14a800]/10 border border-[#14a800]/25">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#14a800"><path d="M11.5 2C6.26 2 2 6.26 2 11.5S6.26 21 11.5 21 21 16.74 21 11.5 16.74 2 11.5 2zm-2 15.5-4-4 1.41-1.41L9.5 14.67l7.59-7.59L18.5 8.5l-9 9z"/></svg>
            <span className="text-[#14a800] font-bold text-xs">Top Rated</span>
          </div>
          {/* JSS */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <FiCheckCircle className="text-primary-400" size={13} />
            <span className="text-white font-bold text-xs">100% Job Success</span>
          </div>
          {[
            { v: `${siteStats.total_jobs}+`, l: 'Projects Delivered' },
            { v: siteStats.total_hours.toLocaleString(), l: 'Engineering Hours' },
            { v: siteStats.total_earnings, l: 'Revenue Generated' },
          ].map(({ v, l }) => (
            <div key={l} className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <span className="text-white font-bold text-xs">{v}</span>
              <span className="text-slate-500 text-xs ml-1.5">{l}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {['Python', 'Django', 'FastAPI', 'React', 'OpenAI GPT-4', 'LangChain', 'Twilio', 'AWS', 'Selenium'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs font-medium bg-white/[0.04] border border-white/[0.08] rounded-full text-slate-500"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-slate-600 text-xs">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}


function ServicesPreview() {
  return (
    <Section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
            What We Do
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            End-to-end expertise across<br className="hidden sm:block" />
            <span className="gradient-text"> the AI stack</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="section-sub mx-auto">
            From intelligent voice agents to web automation pipelines — we build
            the systems that give your business an unfair advantage.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const Icon = serviceIcons[svc.icon]
            return (
              <motion.div
                key={svc.id}
                custom={i}
                variants={fadeUp}
                className={`group relative card bg-gradient-to-br ${colorMap[svc.accent]} border hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 ${iconColorMap[svc.accent]}`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{svc.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{svc.tagline}</p>
                <ul className="space-y-1.5">
                  {svc.features.slice(0, 3).map(f => (
                    <li key={f} className="flex items-start gap-2 text-slate-500 text-xs">
                      <FiCheckCircle className="mt-0.5 text-emerald-500 flex-shrink-0" size={12} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={fadeUp} custom={6} className="text-center mt-10">
          <Link to="/services" className="btn-outline">
            View All Services <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}

function FeaturedWork() {
  const [featuredProjects, setFeaturedProjects] = useState([])

  useEffect(() => {
    api.get('/api/projects/?featured=true').then(res => {
      if (Array.isArray(res.data)) setFeaturedProjects(res.data)
    }).catch(() => {})
  }, [])

  return (
    <Section className="py-24 bg-dark-900/30">
      <div className="container">
        <div className="text-center mb-16">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
            Featured Work
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            Projects that ship to{' '}
            <span className="gradient-text">production</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="section-sub mx-auto">
            Real systems, real impact. Every project is built production-ready —
            deployed, monitored, and delivering value.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              custom={i}
              variants={fadeUp}
              className="group card hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium">
                  {project.category}
                </span>
              </div>

              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                {project.summary}
              </p>

              {/* Impact */}
              <div className="mb-4 space-y-1.5">
                {project.impact.slice(0, 2).map(imp => (
                  <div key={imp} className="flex items-center gap-2 text-xs text-emerald-400">
                    <FiCheckCircle size={12} />
                    {imp}
                  </div>
                ))}
              </div>

              {/* Tech */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.05]">
                {project.tech.slice(0, 5).map(t => (
                  <span key={t} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-slate-500 text-xs">
                    {t}
                  </span>
                ))}
                {project.tech.length > 5 && (
                  <span className="px-2 py-0.5 text-slate-600 text-xs">+{project.tech.length - 5}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} custom={8} className="text-center mt-10">
          <Link to="/portfolio" className="btn-primary">
            View All Projects <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}

function TechStackSection() {
  return (
    <Section className="py-20">
      <div className="container">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
          <span className="section-tag mb-4 inline-flex">Tech Stack</span>
          <h2 className="section-heading mb-3">
            Built with the <span className="gradient-text">right tools</span>
          </h2>
          <p className="text-slate-500 text-base">
            Industry-standard technologies, chosen for reliability and performance.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4"
        >
          {techStack.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-primary-500/30 hover:bg-primary-500/5 transition-all duration-200 group"
            >
              <Icon className="text-slate-400 group-hover:text-primary-400 transition-colors" size={28} />
              <span className="text-slate-600 text-xs text-center group-hover:text-slate-400 transition-colors">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

function ProcessSection() {
  const steps = [
    { step: '01', title: 'Discovery Call', desc: 'We understand your goals, stack, and constraints. You get a clear project plan and timeline — no surprises.' },
    { step: '02', title: 'Architecture', desc: 'We design the technical solution, choose the right stack, and break it into clear milestones.' },
    { step: '03', title: 'Build & Iterate', desc: 'We build fast and show progress regularly. Working demos at every milestone with feedback loops built in.' },
    { step: '04', title: 'Deploy & Support', desc: 'Deployed to production with monitoring, SSL, and full documentation. Ongoing support always available.' },
  ]
  return (
    <Section className="py-24 bg-dark-900/30">
      <div className="container">
        <div className="text-center mb-16">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">How It Works</motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            From idea to <span className="gradient-text">production</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.step} custom={i} variants={fadeUp} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary-500/30 to-transparent z-10" />
              )}
              <div className="card h-full">
                <span className="text-4xl font-black gradient-text mb-4 block">{s.step}</span>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Testimonials() {
  const siteStats = useSiteStats()
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [insightBadges, setInsightBadges] = useState(fallbackBadges)

  useEffect(() => {
    api.get('/api/testimonials/').then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setTestimonials(r.data)
    }).catch(() => {})
    api.get('/api/badges/').then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) setInsightBadges(r.data)
    }).catch(() => {})
  }, [])
  return (
    <Section className="py-24 bg-dark-900/30">
      <div className="container">

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
            Client Reviews
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            Trusted by clients <span className="gradient-text">worldwide</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="section-sub mx-auto">
            {siteStats.total_jobs}+ projects delivered. {siteStats.jss_score}% Job Success Score. Top Rated on Upwork.
          </motion.p>
        </div>

        {/* ── Layer 1: Upwork social proof bar ── */}
        <motion.div
          variants={fadeUp} custom={3}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          {/* Top Rated badge */}
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#14a800]/10 border border-[#14a800]/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#14a800">
              <path d="M11.5 2C6.26 2 2 6.26 2 11.5S6.26 21 11.5 21 21 16.74 21 11.5 16.74 2 11.5 2zm-2 15.5-4-4 1.41-1.41L9.5 14.67l7.59-7.59L18.5 8.5l-9 9z"/>
            </svg>
            <span className="text-[#14a800] font-bold text-sm">Top Rated</span>
          </div>
          {/* JSS */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500/10 border border-primary-500/20">
            <FiCheckCircle className="text-primary-400" size={16} />
            <span className="text-white font-bold text-sm">100% Job Success</span>
          </div>
          {/* Jobs */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <span className="text-slate-300 text-sm"><span className="font-bold text-white">{siteStats.total_jobs}</span> Projects Delivered</span>
          </div>
          {/* Hours */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <span className="text-slate-300 text-sm"><span className="font-bold text-white">{siteStats.total_hours.toLocaleString()}</span> Engineering Hours</span>
          </div>
          {/* Earnings */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <span className="text-slate-300 text-sm"><span className="font-bold text-white">{siteStats.total_earnings}</span> Revenue Generated</span>
          </div>
        </motion.div>

        {/* ── Layer 2: Skill insight badges ── */}
        <motion.div
          variants={fadeUp} custom={4}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {insightBadges.map(({ label, count }) => (
            <span
              key={label}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-400 text-xs font-medium"
            >
              <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {count}
              </span>
              {label}
            </span>
          ))}
        </motion.div>

        {/* ── Layer 3: Review cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {testimonials.map((t, i) => (
            <motion.div key={i} custom={i + 5} variants={fadeUp} className="card flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(Math.round(Number(t.rating || t.stars || 5)))].map((_, j) => (
                  <FiStar key={j} className="text-amber-400" style={{ fill: '#FBBF24' }} size={13} />
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-4 italic">
                "{t.quote || t.text}"
              </p>
              {/* Skill tags */}
              {t.tags && t.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Author */}
              <div className="pt-3 border-t border-white/[0.05] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-400 text-xs font-bold">
                    {(t.client_name || t.name || 'V').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-xs">{t.client_name || t.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t.client_role || t.role} · {t.source || 'Upwork'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Layer 4: Upwork CTA ── */}
        <motion.div variants={fadeUp} custom={9} className="text-center">
          <a
            href="https://www.upwork.com/agencies/1464061503601672192/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#14a800]/10 border border-[#14a800]/30 text-[#14a800] font-semibold text-sm hover:bg-[#14a800]/20 transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.545-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
            </svg>
            View all {siteStats.total_jobs} reviews on Upwork
          </a>
        </motion.div>

      </div>
    </Section>
  )
}

function CTABanner() {
  return (
    <Section className="py-24">
      <div className="container">
        <motion.div
          variants={fadeUp}
          custom={0}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600/20 via-dark-900 to-secondary-600/20 border border-white/[0.08] p-12 text-center"
        >
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Ready to build something{' '}
              <span className="gradient-text">exceptional?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              Tell us about your project. We'll respond within 24 hours with a
              clear plan and honest assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="btn-primary text-base px-8 py-3.5">
                Start Your Project <FiArrowRight />
              </Link>
              <Link to="/portfolio" className="btn-outline text-base px-8 py-3.5">
                See Our Work
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <SEOHead
        description="Orchestrix Labs is a top-rated AI development agency. We build voice AI agents, automation pipelines, full-stack web apps & ML solutions. 200+ projects delivered worldwide with 100% job success."
        path="/"
      />
      <Hero />
      <ServicesPreview />
      <FeaturedWork />
      <TechStackSection />
      <ProcessSection />
      <Testimonials />
      <CTABanner />
    </>
  )
}
