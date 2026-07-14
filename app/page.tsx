import { sanityFetch } from '@/lib/live'
import Hero from '@/components/Hero'
import PhotoGallery from '@/components/PhotoGallery'
import StatsBalk from '@/components/StatsBalk'
import ServicesGrid from '@/components/ServicesGrid'
import MembershipsSection from '@/components/MembershipsSection'
import FaqSection from '@/components/FaqSection'
import CtaBanner from '@/components/CtaBanner'
import Footer from '@/components/Footer'

export default async function HomePage() {
  const [
    { data: settings },
    { data: services },
    { data: memberships },
    { data: faqs },
  ] = await Promise.all([
    sanityFetch({ query: `*[_type == "siteSettings"][0]` }),
    sanityFetch({ query: `*[_type == "service"] | order(order asc)` }),
    sanityFetch({ query: `*[_type == "membership"] | order(order asc)` }),
    sanityFetch({ query: `*[_type == "faq"] | order(order asc)` }),
  ])

  return (
    <>
      <Hero
        heading={settings?.hero?.heading ?? 'The grand opening, September 20th 2025'}
        subheading={settings?.hero?.subheading ?? 'You can find us at xxx adres in Utrecht, right next to the Douwe Egberts factory.'}
        ctaLabel={settings?.trialCtaLabel ?? 'Join from day one'}
        ctaUrl={settings?.trialCtaUrl ?? '#'}
        secondaryCtaLabel="Check our roster"
        secondaryCtaUrl={settings?.bookingUrl ?? '#'}
      />

      <PhotoGallery />

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
