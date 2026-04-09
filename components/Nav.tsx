import Link from 'next/link'
import { client } from '@/lib/sanity'
import MobileNav from './MobileNav'

type NavItem = {
  _key: string
  label: string
  url: string
}

type Settings = {
  siteName?: string
  navigation?: NavItem[]
  bookingUrl?: string
  trialCtaLabel?: string
  trialCtaUrl?: string
}

export default async function Nav() {
  const settings: Settings = await client.fetch(
    `*[_type == "siteSettings"][0]{ siteName, navigation, bookingUrl, trialCtaLabel, trialCtaUrl }`,
    {},
    { cache: 'no-store' }
  )

  const siteName = settings?.siteName ?? 'VI Utrecht'
  const navItems = settings?.navigation ?? []
  const ctaUrl = settings?.trialCtaUrl ?? settings?.bookingUrl ?? '#'
  const ctaLabel = settings?.trialCtaLabel ?? 'Gratis proefweek'

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0e1a]/90 backdrop-blur-md">
      <div className="relative mx-auto max-w-7xl px-6 flex h-16 items-center justify-between gap-8">
        <Link href="/" className="font-black text-xl tracking-tight text-white shrink-0">
          {siteName}
        </Link>

        {/* Desktop nav */}
        {navItems.length > 0 && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8b94a8]">
            {navItems.map((item) => (
              <Link
                key={item._key}
                href={item.url}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop CTA */}
        <a
          href={ctaUrl}
          target={ctaUrl.startsWith('http') ? '_blank' : undefined}
          rel={ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="hidden md:block shrink-0 rounded-full bg-[#8c7df8] px-5 py-2 text-sm font-bold text-white hover:bg-[#bab1fa] transition-colors"
        >
          {ctaLabel}
        </a>

        {/* Mobile nav */}
        <MobileNav navItems={navItems} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
      </div>
    </header>
  )
}
