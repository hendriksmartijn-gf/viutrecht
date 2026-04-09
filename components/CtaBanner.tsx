type Props = {
  heading?: string
  subheading?: string
  ctaLabel: string
  ctaUrl: string
  siteName: string
}

export default function CtaBanner({ heading, subheading, ctaLabel, ctaUrl, siteName }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-[#8c7df8] px-8 py-16 md:px-16 text-center">
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#0a0e1a]/10 blur-3xl" />
        <h2 className="relative text-3xl md:text-5xl font-black text-white mb-4">
          {heading ?? `Klaar om te starten?`}
        </h2>
        <p className="relative text-white/70 mb-10 text-lg max-w-lg mx-auto">
          {subheading ?? `Doe een gratis proefweek en ervaar zelf wat ${siteName} te bieden heeft.`}
        </p>
        <a
          href={ctaUrl}
          target={ctaUrl.startsWith('http') ? '_blank' : undefined}
          rel={ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="relative inline-flex items-center gap-2 rounded-full bg-[#0a0e1a] px-8 py-4 text-sm font-bold text-white hover:bg-[#10141f] transition-colors"
        >
          {ctaLabel}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </section>
  )
}
