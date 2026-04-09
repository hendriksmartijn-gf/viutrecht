type Props = {
  heading: string
  subheading: string
  ctaLabel: string
  ctaUrl: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  imageUrl?: string | null
  googleReviews?: { rating?: number; count?: number; url?: string } | null
}

export default function Hero({ heading, subheading, ctaLabel, ctaUrl, secondaryCtaLabel, secondaryCtaUrl, imageUrl, googleReviews }: Props) {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-[#0a0e1a]">
      {/* Background image */}
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a] via-[#0a0e1a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
        </>
      )}

      {/* Glow (alleen zonder afbeelding) */}
      {!imageUrl && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[#8c7df8]/10 blur-[140px]" />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#8c7df8]/6 blur-[120px]" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-6 py-28 w-full">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8c7df8]/30 bg-[#8c7df8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#bab1fa]">
            Utrecht
          </p>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.93] tracking-tight text-white mb-8">
            {heading}
          </h1>
          <p className="text-lg md:text-xl text-[#8b94a8] max-w-lg leading-relaxed mb-12">
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
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>

          {googleReviews?.rating && (
            <a
              href={googleReviews.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-[#FBBC04]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-white">{googleReviews.rating}</span>
                {googleReviews.count && (
                  <span className="text-[#8b94a8] ml-1">({googleReviews.count} reviews)</span>
                )}
                <span className="text-[#8b94a8] ml-1">· Google</span>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
