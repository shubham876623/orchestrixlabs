import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMail, FiSend, FiCheckCircle, FiLinkedin, FiGithub } from 'react-icons/fi'
import { SiUpwork } from 'react-icons/si'
import axios from 'axios'
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

const services = [
  'Voice AI & Chatbots',
  'Machine Learning & AI',
  'Full-Stack Development',
  'Web Scraping & Automation',
  'Workflow Automation',
  'Other / Not sure yet',
]

const contactInfo = [
  { icon: FiMail, label: 'Email', value: 'contact@orchestrixlabs.com', href: 'mailto:contact@orchestrixlabs.com' },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com/company/orchestrix-labs', href: 'https://linkedin.com/company/orchestrix-labs' },
  { icon: SiUpwork, label: 'Upwork', value: 'upwork.com/agencies/orchestrixlabs', href: 'https://www.upwork.com/agencies/1464061503601672192/' },
  { icon: FiGithub, label: 'GitHub', value: 'github.com/orchestrixlabs', href: 'https://github.com/orchestrixlabs' },
]

const initialForm = { name: '', email: '', service: '', budget: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    try {
      await axios.post('/api/contact/', form)
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  const inputClass = (field) =>
    `w-full bg-white/[0.03] border ${errors[field] ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none focus:border-primary-500/60 focus:bg-primary-500/5 transition-all duration-200`

  return (
    <>
      <SEOHead
        title="Contact"
        description="Get a free consultation from Orchestrix Labs. Hire expert AI developers for voice AI, automation, web scraping, Django, React & full-stack projects. 24-hour response guaranteed."
        path="/contact"
      />

      {/* Hero */}
      <section className="relative pt-36 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-950" />
        <div className="container relative z-10">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-tag mb-5 inline-flex">
            Contact
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-heading mb-4">
            Let's build something<br /><span className="gradient-text">great together</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-sub mx-auto">
            Tell us about your project. We'll reply within 24 hours with honest feedback and a clear plan.
          </motion.p>
        </div>
      </section>

      {/* Main */}
      <Section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <motion.div variants={fadeUp} custom={0} className="card p-8">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                      <FiCheckCircle className="text-emerald-400" size={32} />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Message sent!</h3>
                    <p className="text-slate-400 text-sm">
                      Thanks for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <h2 className="text-white font-bold text-xl mb-6">Send us a message</h2>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                          Your Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text" name="name" placeholder=""
                          value={form.name} onChange={handleChange}
                          className={inputClass('name')}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email" name="email" placeholder=""
                          value={form.email} onChange={handleChange}
                          className={inputClass('email')}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Service */}
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1.5 block">Service Needed</label>
                      <select
                        name="service" value={form.service} onChange={handleChange}
                        className={`${inputClass('service')} appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-dark-900">Select a service...</option>
                        {services.map(s => (
                          <option key={s} value={s} className="bg-dark-900">{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1.5 block">Estimated Budget</label>
                      <select
                        name="budget" value={form.budget} onChange={handleChange}
                        className={`${inputClass('budget')} appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-dark-900">Select budget range...</option>
                        {['Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000+', 'Not sure yet'].map(b => (
                          <option key={b} value={b} className="bg-dark-900">{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                        Tell us about your project <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="message" rows={5}
                        placeholder=""
                        value={form.message} onChange={handleChange}
                        className={`${inputClass('message')} resize-none`}
                      />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                    </div>

                    {status === 'error' && (
                      <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                        Something went wrong. Please email us directly at contact@orchestrixlabs.com
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <><FiSend /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5">
              {/* Contact Info */}
              <motion.div variants={fadeUp} custom={1} className="card p-6">
                <h3 className="text-white font-bold text-base mb-5">Other ways to reach us</h3>
                <div className="space-y-4">
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                        <Icon className="text-primary-400" size={16} />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">{label}</p>
                        <p className="text-slate-300 text-sm group-hover:text-white transition-colors">{value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Response time */}
              <motion.div variants={fadeUp} custom={2} className="card p-6 bg-gradient-to-br from-primary-500/10 to-dark-900 border-primary-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-semibold">Quick Response</span>
                </div>
                <p className="text-white font-semibold text-base mb-1">24-hour response guaranteed</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We review every message personally and always respond with a clear, honest assessment — no auto-replies.
                </p>
              </motion.div>

              {/* What to expect */}
              <motion.div variants={fadeUp} custom={3} className="card p-6">
                <h3 className="text-white font-bold text-sm mb-4">What happens next?</h3>
                <ol className="space-y-3">
                  {[
                    'We review your message within 24 hours',
                    'We schedule a 30-min discovery call',
                    'You receive a detailed project proposal',
                    'We start building',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-400 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
