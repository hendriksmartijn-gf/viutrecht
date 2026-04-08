type Membership = {
  _id: string
  title: string
  price: number
  credits?: number
  description?: string
  features?: string[]
  highlighted?: boolean
}

type Props = {
  memberships: Membership[]
  bookingUrl: string
}

export default function MembershipsSection({ memberships, bookingUrl }: Props) {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
          Flexible plans for Everyone.
        </h2>
        <p className="text-gray-500 text-center mb-12">Choose a plan that fits your goals.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memberships.map((m) => (
            <div
              key={m._id}
              className={`rounded-2xl p-8 flex flex-col ${
                m.highlighted
                  ? 'bg-black text-white shadow-xl scale-105'
                  : 'bg-gray-50 text-gray-900'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{m.title}</h3>
              <div className="text-4xl font-bold mb-1">
                €{m.price}
                <span className={`text-base font-normal ${m.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                  /maand
                </span>
              </div>
              {m.credits && (
                <p className={`text-sm mb-4 ${m.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                  {m.credits} credits per maand
                </p>
              )}
              {m.description && (
                <p className={`text-sm mb-6 ${m.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                  {m.description}
                </p>
              )}
              {m.features && m.features.length > 0 && (
                <ul className="space-y-2 mb-8 flex-1">
                  {m.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={bookingUrl}
                className={`mt-auto text-center py-3 px-6 rounded-full font-semibold transition ${
                  m.highlighted
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
