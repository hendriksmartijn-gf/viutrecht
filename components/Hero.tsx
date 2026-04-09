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
    <section className="bg-[#10131c] py-32 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
        >
          {heading}
        </h1>
        <p className="text-lg text-[#d5dbe6] mb-10 max-w-xl mx-auto leading-relaxed">
          {subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaUrl}
            className="bg-[#8c7df8] text-[#10131c] px-8 py-3 rounded-full font-semibold hover:bg-[#bab1fa] transition"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel && secondaryCtaUrl && (
            <a
              href={secondaryCtaUrl}
              className="border border-[#d5dbe6]/30 text-white px-8 py-3 rounded-full font-semibold hover:border-white/60 transition"
            >
              {secondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
