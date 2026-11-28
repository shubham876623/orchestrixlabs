/**
 * Project cover for work without approved screenshots: the project's real stack drawn as a
 * small pipeline (e.g. SynthFlow -> FastAPI -> HubSpot), tinted by capability. Honest by design:
 * it shows what was integrated, never an invented screenshot.
 */
const TONES = {
  voice: { bg: '#ECFEFF', ink: '#0E7490', line: '#67C6D6', label: 'Voice AI' },
  crm: { bg: '#F0FDFA', ink: '#0F766E', line: '#5EC4B6', label: 'CRM integration' },
  agents: { bg: '#F5F3FF', ink: '#6D28D9', line: '#B4A1EE', label: 'AI agents' },
  automation: { bg: '#ECFDF5', ink: '#047857', line: '#7CCBA8', label: 'Automation' },
  fullstack: { bg: '#EFF6FF', ink: '#1D4ED8', line: '#93B4EE', label: 'Full-stack' },
  ml: { bg: '#FFF7ED', ink: '#C2410C', line: '#F0B088', label: 'Machine learning' },
}

export default function AbstractCover({ tone = 'fullstack', title, stack = [], className = '' }) {
  const t = TONES[tone] || TONES.fullstack
  const all = stack.filter(Boolean)
  const nodes = all.slice(0, 3)
  const more = all.length - nodes.length

  return (
    <div
      className={`relative flex flex-col gap-6 overflow-hidden rounded-xl border border-border p-5 sm:p-6 ${className}`}
      style={{ backgroundColor: t.bg }}
      role="img"
      aria-label={all.length ? `${title}: built with ${all.join(', ')}` : title}
    >
      <p className="text-sm font-medium" style={{ color: t.ink }}>{t.label}</p>

      {nodes.length > 1 ? (
        <ol className="mt-auto flex flex-col items-start" aria-hidden="true">
          {nodes.map((node, i) => (
            <li key={node} className="flex flex-col items-start">
              <span className="flex items-center gap-2">
                <span
                  className="rounded-md border bg-white px-2.5 py-1 text-sm font-semibold text-navy-primary shadow-xs"
                  style={{ borderColor: t.line }}
                >
                  {node}
                </span>
                {i === nodes.length - 1 && more > 0 && (
                  <span className="text-sm font-medium" style={{ color: t.ink }}>+{more} more</span>
                )}
              </span>
              {i < nodes.length - 1 && (
                <span className="ml-5 flex flex-col items-center" style={{ color: t.line }}>
                  <span className="block h-2.5 w-px" style={{ backgroundColor: t.line }} />
                  <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M0 0h8L4 5z" /></svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-auto max-w-[20rem] text-lg font-semibold leading-snug text-navy-primary" aria-hidden="true">{title}</p>
      )}

    </div>
  )
}
