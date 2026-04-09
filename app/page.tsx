import { client, urlFor } from '@/lib/sanity'

export const dynamic = 'force-dynamic'
import AnnouncementBar from '@/components/AnnouncementBar'
import Hero from '@/components/Hero'
import StatsBalk from '@/components/StatsBalk'
import ServicesGrid from '@/components/ServicesGrid'
import MembershipsSection from '@/components/MembershipsSection'
import FaqSection from '@/components/FaqSection'
import CtaBanner from '@/components/CtaBanner'
import Footer from '@/components/Footer'

async function getData() {
  const [settings, services, memberships, faqs] = await Promise.all([
    client.fetch(`*[_type == "siteSettings"][0]`),
    client.fetch(`*[_type == "service"] | order(order asc)`),
    client.fetch(`*[_type == "membership"] | order(order asc)`),
    client.fetch(`*[_type == "faq"] | order(order asc)`),
  ])
  return { settings, services, memberships, faqs }
}

export default async function HomePage() {
  const { settings, services, memberships, faqs } = await getData()

  const heroImageUrl = settings?.hero?.image
    ? urlFor(settings.hero.image).width(1600).auto('format').quality(80).url()
    : null

  return (
    <>
      {settings?.trialCtaLabel && settings?.trialCtaUrl && (
        <AnnouncementBar label={settings.trialCtaLabel} url={settings.trialCtaUrl} />
      )}

      <Hero
        heading={settings?.hero?.heading ?? 'Turn your resolutions into a routine.'}
        subheading={settings?.hero?.subheading ?? 'Whether you\'re a beginner or an athlete: we help you start strong and stay strong.'}
        ctaLabel={settings?.trialCtaLabel ?? 'Get 1 Week Free'}
        ctaUrl={settings?.trialCtaUrl ?? '#'}
        secondaryCtaLabel="Book a drop-in"
        secondaryCtaUrl={settings?.bookingUrl ?? '#'}
        imageUrl={heroImageUrl}
      />

      {settings?.stats?.length > 0 && <StatsBalk stats={settings.stats} />}

      {services?.length > 0 && <ServicesGrid services={services} />}

      {memberships?.length > 0 && (
        <MembershipsSection memberships={memberships} bookingUrl={settings?.bookingUrl ?? '#'} />
      )}

      {faqs?.length > 0 && <FaqSection items={faqs} />}

      <CtaBanner
        heading={settings?.ctaBanner?.heading}
        subheading={settings?.ctaBanner?.subheading}
        ctaLabel={settings?.trialCtaLabel ?? 'Gratis proefweek'}
        ctaUrl={settings?.trialCtaUrl ?? settings?.bookingUrl ?? '#'}
        siteName={settings?.siteName ?? 'VI Utrecht'}
      />

      <Footer
        email={settings?.email ?? 'info@viutrecht.nl'}
        address={settings?.address ?? 'Steenovenweg 1-A\n3532 AE Utrecht'}
        instagram={settings?.instagram ?? '#'}
      />
    </>
  )
}
