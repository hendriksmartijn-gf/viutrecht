import { urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

type Service = {
  _id: string
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
  slug: { current: string }
}

type Props = {
  services: Service[]
}

export default function ServicesGrid({ services }: Props) {
  return (
    <section className="bg-[#fdf8ee] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2 className="text-4xl font-bold text-[#10131c] max-w-md leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}>
            From first-timers to seasoned pro&apos;s, we&apos;ve got you.
          </h2>
          <a href="/classes" className="text-sm font-semibold text-[#10131c] underline underline-offset-4 whitespace-nowrap">
            Explore all classes
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <a
              key={service._id}
              href={`/classes/${service.slug.current}`}
              className="bg-[#ebe7dc] rounded-2xl overflow-hidden hover:scale-[1.02] transition duration-300 group"
            >
              {service.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={urlFor(service.image).width(600).height(338).url()}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#10131c] mb-2">{service.title}</h3>
                {service.description && (
                  <div className="text-[#514941] text-sm leading-relaxed">
                    <PortableText value={service.description} />
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
