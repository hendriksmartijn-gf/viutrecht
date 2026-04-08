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
    <section className="bg-white py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">{heading}</h1>
        <p className="text-xl text-gray-600 mb-10">{subheading}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaUrl}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel && secondaryCtaUrl && (
            <a
              href={secondaryCtaUrl}
              className="border border-black text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              {secondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
