import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { FAQ as defaultFaq } from '../lib/site'

function FaqItem({ item, open, onToggle }) {
  return (
    <li className="border-t border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-navy-primary sm:text-base">{item.q}</span>
        <FiChevronDown
          className={`flex-shrink-0 text-navy-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          size={18}
          aria-hidden="true"
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-navy-body">{item.a}</p>
      )}
    </li>
  )
}

export default function FAQSection({ items = defaultFaq, className = 'section-shell' }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className={className}>
      <div className="container max-w-3xl">
        <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight text-navy-primary sm:text-3xl">
          Common questions
        </h2>
        <ul className="border-b border-border">
          {items.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
