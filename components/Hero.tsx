type Props = {
  heading: string
  subheading: string
  ctaLabel: string
  ctaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

export default function Hero({ heading, subheading, ctaLabel, ctaUrl, secondaryCtaLabel, secondaryCtaUrl }: Props) {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center bg-[#0a0e1a]">
      {/* Glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[#8c7df8]/10 blur-[140px]" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#8c7df8]/6 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-28 w-full">
        <div className="max-w-4xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8c7df8]/30 bg-[#8c7df8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#bab1fa]">
            Utrecht
          </p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-white mb-8">
            {heading}
          </h1>
          <p className="text-lg md:text-xl text-[#8b94a8] max-w-xl leading-relaxed mb-12">
            {subheading}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#8c7df8] px-8 py-4 text-sm font-bold text-white hover:bg-[#bab1fa] transition-colors"
            >
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            {secondaryCtaLabel && secondaryCtaUrl && (
              <a
                href={secondaryCtaUrl}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-bold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
