import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronDown } from 'react-icons/fi'
import { FAQ as defaultFaq } from '../lib/site'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
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

function FaqItem({ item, index, open, onToggle }) {
  return (
    <motion.div variants={fadeUp} custom={index} className="card overflow-hidden !p-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="text-white font-semibold text-sm sm:text-base">{item.q}</span>
        <FiChevronDown
          className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          size={18}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/[0.05] pt-4">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection({ items = defaultFaq, className = 'py-24' }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section className={className}>
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
            FAQ
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            Common <span className="gradient-text">questions</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="section-sub mx-auto">
            Everything you need to know before starting a project with us.
          </motion.p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i + 3}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
