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
    <section className="bg-[var(--color-cream)] px-6 pt-16 pb-8 md:pt-20">
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-5">
          <h1 className="text-[32px] md:text-[50px] leading-[1.1] tracking-[-2px] text-[#151c1f]">
            {heading}
          </h1>
          <p className="text-sm tracking-[-0.56px] text-[#151c1f]">
            {subheading}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={ctaUrl}
            className="rounded-[5px] bg-[var(--color-purple)] px-6 py-3.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel && secondaryCtaUrl && (
            <a
              href={secondaryCtaUrl}
              className="rounded-[5px] bg-[var(--color-purple-soft)] px-6 py-3.5 text-sm font-medium text-[#151c1f] hover:opacity-80 transition-opacity"
            >
              {secondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
