import { Link } from 'react-router-dom'
import { BOOKING, contactBookHref } from '../lib/site'

export default function BookCallLink({ className = 'btn-primary', children }) {
  const label = children ?? `Book a ${BOOKING.durationLabel}`
  return (
    <Link to={contactBookHref()} className={className}>
      {label}
    </Link>
  )
}