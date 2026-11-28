import { useId, useRef } from 'react'

export default function CategoryTabs({ categories, active, counts, onChange }) {
  const listId = useId()
  const tabRefs = useRef([])

  const focusTab = (index) => {
    const el = tabRefs.current[index]
    if (el) el.focus()
  }

  const onKeyDown = (e, index) => {
    const last = categories.length - 1
    let next = null
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    onChange(categories[next])
    focusTab(next)
  }

  return (
    <div className="relative">
      <div
        role="tablist"
        aria-label="Filter projects by category"
        id={listId}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide touch-pan-x"
      >
        {categories.map((category, index) => {
          const selected = category === active
          const count = counts?.[category] ?? 0
          const disabled = category !== 'All Projects' && count === 0

          return (
            <button
              key={category}
              ref={(el) => { tabRefs.current[index] = el }}
              type="button"
              role="tab"
              id={`portfolio-tab-${index}`}
              aria-selected={selected}
              aria-controls="portfolio-panel"
              tabIndex={selected ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(category)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={[
                'min-h-[44px] shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white ',
                disabled
                  ? 'cursor-not-allowed border-slate-200 text-navy-secondary '
                  : selected
                    ? 'border-cyan-600/40 bg-cyan-50 text-cyan-900 '
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 ',
              ].join(' ')}
            >
              {category}
              {!disabled && (
                <span className={`ml-2 text-xs ${selected ? 'text-cyan-700 ' : 'text-navy-muted'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
