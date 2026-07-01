import { FiShield, FiAward, FiClock, FiGlobe } from 'react-icons/fi'
import { STATS } from '../lib/site'

const badges = [
  { icon: FiAward, label: 'Top Rated on Upwork', color: 'text-[#14a800]' },
  { icon: FiShield, label: `${STATS.jss} Job Success`, color: 'text-primary-400' },
  { icon: FiClock, label: '24h Response Time', color: 'text-emerald-400' },
  { icon: FiGlobe, label: 'Clients Worldwide', color: 'text-secondary-400' },
]

export default function TrustBar() {
  return (
    <div className="border-y border-white/[0.06] bg-dark-900/50 backdrop-blur-sm">
      <div className="container py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {badges.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className={color} size={16} />
              <span className="text-slate-300 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
