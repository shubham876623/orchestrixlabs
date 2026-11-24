import { FiShield, FiAward, FiClock, FiGlobe } from 'react-icons/fi'
import { STATS } from '../lib/site'

const badges = [
  { icon: FiAward, label: 'Top Rated on Upwork' },
  { icon: FiShield, label: `${STATS.jss} Job Success` },
  { icon: FiClock, label: '24h Response Time' },
  { icon: FiGlobe, label: 'Clients Worldwide' },
]

export default function TrustBar() {
  return (
    <div className="border-y border-line bg-panel">
      <div className="container py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="text-mute" size={16} aria-hidden="true" />
              <span className="text-copy text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
