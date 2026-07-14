import Link from 'next/link'
import { client } from '@/lib/sanity'
import AnnouncementBar from './AnnouncementBar'
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
  const bookingUrl = settings?.bookingUrl ?? '#'
  const ctaUrl = settings?.trialCtaUrl ?? bookingUrl
  const ctaLabel = settings?.trialCtaLabel ?? 'Become a member'

  return (
    <header className="sticky top-0 z-50">
      {ctaLabel && ctaUrl && <AnnouncementBar label={`${ctaLabel} to unlock a 20% on the first year`} url={ctaUrl} />}

      <div className="border-b border-[#151c1f]/5 bg-[var(--color-cream)]/95 backdrop-blur-md">
        <div className="relative mx-auto max-w-7xl px-6 flex h-20 items-center justify-between gap-8">
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-[#151c1f] shrink-0">
              {navItems.map((item) => (
                <Link key={item._key} href={item.url} className="px-2.5 py-2 hover:opacity-70 transition-opacity">
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <Link href="/" className="font-black text-xl tracking-tight text-[#151c1f] shrink-0 mx-auto md:mx-0">
            {siteName}
          </Link>

          <div className="hidden md:flex items-center gap-6 shrink-0">
            <span className="text-sm font-medium text-[#151c1f]">
              <span className="text-[#151c1f]/50">NL</span>{' | ENG'}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={bookingUrl}
                target={bookingUrl.startsWith('http') ? '_blank' : undefined}
                rel={bookingUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="rounded-[5px] bg-[var(--color-purple-soft)] px-6 py-3.5 text-sm font-medium text-[#151c1f] hover:opacity-80 transition-opacity"
              >
                Book a tour
              </a>
              <a
                href={ctaUrl}
                target={ctaUrl.startsWith('http') ? '_blank' : undefined}
                rel={ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="rounded-[5px] bg-[var(--color-purple)] px-6 py-3.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Become a member
              </a>
            </div>
          </div>

          <MobileNav navItems={navItems} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
        </div>
      </div>
    </header>
  )
}
