const TONES = {
  voice: {
    from: 'from-cyan-500/25',
    via: 'via-slate-900',
    to: 'to-indigo-600/20',
  },
  crm: {
    from: 'from-teal-500/20',
    via: 'via-slate-900',
    to: 'to-sky-600/25',
  },
  agents: {
    from: 'from-violet-500/20',
    via: 'via-slate-900',
    to: 'to-fuchsia-600/15',
  },
  automation: {
    from: 'from-emerald-500/20',
    via: 'via-slate-900',
    to: 'to-cyan-600/20',
  },
  fullstack: {
    from: 'from-blue-500/20',
    via: 'via-slate-900',
    to: 'to-slate-700/40',
  },
  ml: {
    from: 'from-orange-500/15',
    via: 'via-slate-900',
    to: 'to-rose-600/15',
  },
}

export default function AbstractCover({ tone = 'fullstack', title, className = '' }) {
  const t = TONES[tone] || TONES.fullstack

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${t.from} ${t.via} ${t.to} ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08), transparent 45%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative flex h-full min-h-[10rem] flex-col justify-end p-5 sm:p-6">
        <p className="max-w-[18rem] font-display text-lg font-semibold leading-snug text-navy-primary/90 sm:text-xl">
          {title}
        </p>
      </div>
    </div>
  )
}
