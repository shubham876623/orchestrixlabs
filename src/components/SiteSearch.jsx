import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { searchSite } from '../lib/siteSearch'

const SUGGESTIONS = ['Voice AI', 'CRM', 'HubSpot', 'RAG', 'Scraping', 'Pricing']

/** Search dialog: Ctrl/Cmd+K or "/" opens it; arrows move, Enter opens, Esc closes. */
export default function SiteSearch({ open, onClose }) {
  const uid = useId()
  const navigate = useNavigate()
  const input = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const results = useMemo(() => searchSite(query), [query])

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    setActive(0)
    const previous = document.activeElement
    const scrollY = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => input.current?.focus())
    return () => {
      document.body.style.overflow = scrollY
      previous?.focus?.()
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  if (!open) return null

  const go = (result) => {
    if (!result) return
    onClose()
    navigate(result.path)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose() }
    else if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    else if (event.key === 'Enter') { event.preventDefault(); go(results[active]) }
    else if (event.key === 'Tab') { event.preventDefault() } // keep focus in the dialog
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKeyDown}>
      <button type="button" aria-label="Close search" className="absolute inset-0 cursor-default bg-navy-primary/30 backdrop-blur-[2px]" onClick={onClose} tabIndex={-1} />
      <div role="dialog" aria-modal="true" aria-label="Search the site" className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border-strong bg-paper-elevated shadow-xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <FiSearch className="shrink-0 text-navy-muted" size={18} aria-hidden="true" />
          <input
            ref={input}
            type="text"
            inputMode="search"
            enterKeyHint="go"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, case studies, technologies"
            className="h-14 w-full bg-transparent text-base text-navy-primary placeholder:text-navy-muted focus:outline-none"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={`${uid}-list`}
            aria-activedescendant={results[active] ? `${uid}-opt-${active}` : undefined}
            aria-autocomplete="list"
          />
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-navy-muted hover:bg-paper-subtle hover:text-navy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent" aria-label="Close search">
            <FiX size={18} aria-hidden="true" />
          </button>
        </div>

        {query.trim() === '' ? (
          <div className="px-4 py-5">
            <p className="text-sm text-navy-muted">Try</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full border border-border-strong px-3 py-1 text-sm text-navy-body hover:border-navy-primary">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="px-4 py-8 text-center text-navy-secondary">
            Nothing matches “{query}”. Try a technology such as Twilio or FastAPI.
          </p>
        ) : (
          <ul id={`${uid}-list`} role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
            {results.map((r, i) => (
              <li
                key={`${r.kind}-${r.path}-${r.title}`}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`mx-2 flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 ${i === active ? 'bg-cyan-subtle' : ''}`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-navy-primary">{r.title}</span>
                  {r.hint && <span className="block truncate text-sm text-navy-muted">{r.hint}</span>}
                </span>
                <span className="shrink-0 text-xs text-navy-secondary">{r.kind}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="hidden border-t border-border px-4 py-2 text-xs text-navy-muted sm:block">
          Arrow keys to move, Enter to open, Esc to close
        </p>
      </div>
    </div>
  )
}
