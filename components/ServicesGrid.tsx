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
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            From first-timers to seasoned pro's, we've got you.
          </h2>
          <a href="/classes" className="text-sm font-semibold underline text-gray-700 whitespace-nowrap ml-8">
            Explore all classes
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <a
              key={service._id}
              href={`/classes/${service.slug.current}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              {service.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={urlFor(service.image).width(600).height(338).url()}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                {service.description && (
                  <div className="text-gray-500 text-sm">
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
