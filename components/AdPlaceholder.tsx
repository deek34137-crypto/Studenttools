interface AdPlaceholderProps {
  slot: 'top-banner' | 'in-content' | 'bottom-content'
  className?: string
}

export function AdPlaceholder({ slot, className = '' }: AdPlaceholderProps) {
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim()
  const adsenseClient =
    rawClient && rawClient.startsWith('pub-') ? `ca-${rawClient}` : rawClient
  const isValidClient = Boolean(adsenseClient && /^ca-pub-\d+$/.test(adsenseClient))

  // If AdSense is explicitly enabled and valid client ID is configured, render official AdSense container
  if (adsenseEnabled && isValidClient && adsenseClient) {
    return (
      <div
        className={`w-full overflow-hidden my-6 flex justify-center items-center bg-slate-50 border border-slate-200 rounded-lg min-h-[90px] ${className}`}
        aria-label="Advertisement"
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseClient}
          data-ad-slot="auto"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // Otherwise render a clean, non-intrusive placeholder container that reserves layout dimensions to prevent Cumulative Layout Shift (CLS)
  return (
    <aside
      className={`w-full my-6 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center text-center transition-colors min-h-[90px] ${className}`}
      aria-label="Sponsored Space"
    >
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
        Advertisement Space
      </span>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">
        Reserved ad slot for future verified partner placements.
      </p>
    </aside>
  )
}
