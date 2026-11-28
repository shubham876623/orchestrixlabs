import { isDraftPortfolioMode, PORTFOLIO_PUBLISH_MODE } from '../../data/publishedProjects'

export default function DraftPreviewBanner() {
  if (!isDraftPortfolioMode()) return null

  return (
    <div
      role="status"
      className="border-b border-status-warning/40 bg-status-warning-bg text-status-warning"
    >
      <div className="container py-2.5 text-xs leading-relaxed sm:py-3 sm:text-sm">
        <strong className="font-semibold text-status-warning">Local content review only.</strong>{' '}
        <span className="text-status-warning">
          Mode <code className="rounded bg-black/20 px-1.5 py-0.5 text-[11px] sm:text-xs">{PORTFOLIO_PUBLISH_MODE}</code>.
          Draft case studies are visible for founder review. Production mode still requires{' '}
          <code className="rounded bg-black/20 px-1.5 py-0.5 text-[11px] sm:text-xs">approved_public</code> and
          per-project publication approval. Client identities anonymized; unverified metrics withheld.
        </span>
      </div>
    </div>
  )
}
