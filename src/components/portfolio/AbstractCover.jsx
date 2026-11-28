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
  const nodes = stack.filter(Boolean).slice(0, 4)

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-5 sm:p-6 ${className}`}
      style={{ backgroundColor: t.bg }}
      role="img"
      aria-label={nodes.length ? `${title}: built with ${nodes.join(', ')}` : title}
    >
      <p className="text-sm font-medium" style={{ color: t.ink }}>{t.label}</p>

      {nodes.length > 1 ? (
        <ol className="my-5 flex flex-wrap items-center gap-y-3" aria-hidden="true">
          {nodes.map((node, i) => (
            <li key={node} className="flex items-center">
              <span
                className="rounded-md border bg-white px-2.5 py-1.5 text-sm font-semibold text-navy-primary shadow-xs"
                style={{ borderColor: t.line }}
              >
                {node}
              </span>
              {i < nodes.length - 1 && (
                <span className="mx-1.5 flex items-center" style={{ color: t.line }}>
                  <span className="block h-px w-4 sm:w-6" style={{ backgroundColor: t.line }} />
                  <svg width="6" height="8" viewBox="0 0 6 8" fill="currentColor"><path d="M0 0l6 4-6 4z" /></svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <div className="my-5" />
      )}

      <p className="max-w-[20rem] text-lg font-semibold leading-snug text-navy-primary sm:text-xl" aria-hidden="true">
        {title}
      </p>
    </div>
  )
}
