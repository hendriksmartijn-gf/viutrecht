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
    <section className="bg-[#060911] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#8c7df8] mb-3">Wat we bieden</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-md">
              Voor beginners én gevorderden.
            </h2>
          </div>
          <a href="/classes" className="text-sm font-semibold text-[#8b94a8] hover:text-white transition-colors whitespace-nowrap">
            Alle klassen bekijken →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <a
              key={service._id}
              href={`/classes/${service.slug.current}`}
              className="group bg-[#10141f] rounded-2xl overflow-hidden border border-white/5 hover:border-[#8c7df8]/30 transition-all duration-300"
            >
              {service.image ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={urlFor(service.image).width(600).height(338).auto('format').quality(80).url()}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#8c7df8]/10 to-transparent flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#8c7df8]/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#8c7df8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                {service.description && (
                  <div className="text-sm text-[#8b94a8] leading-relaxed line-clamp-3">
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
