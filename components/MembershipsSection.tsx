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
    <section className="bg-[#0a0e1a] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8c7df8] mb-3">Word lid</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Kies jouw lidmaatschap.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {memberships.map((m) => (
            <div
              key={m._id}
              className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 ${
                m.highlighted
                  ? 'bg-[#8c7df8] border-[#8c7df8] text-white'
                  : 'bg-[#10141f] border-white/5 hover:border-white/20 text-white'
              }`}
            >
              {m.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0a0e1a] px-4 py-1 text-xs font-bold text-[#8c7df8] whitespace-nowrap">
                  Meest gekozen
                </span>
              )}
              <h3 className="text-xl font-black mb-2">{m.title}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-black">€{m.price}</span>
                <span className={`text-sm font-medium ${m.highlighted ? 'text-white/60' : 'text-[#8b94a8]'}`}>
                  / maand
                </span>
              </div>
              {m.credits && (
                <p className={`text-sm font-semibold mb-4 ${m.highlighted ? 'text-white/70' : 'text-[#8b94a8]'}`}>
                  {m.credits} credits per maand
                </p>
              )}
              {m.description && (
                <p className={`text-sm mb-6 leading-relaxed ${m.highlighted ? 'text-white/70' : 'text-[#8b94a8]'}`}>
                  {m.description}
                </p>
              )}
              {m.features && m.features.length > 0 && (
                <ul className="space-y-2 mb-8 flex-1">
                  {m.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`mt-0.5 w-4 h-4 flex-shrink-0 ${m.highlighted ? 'text-white' : 'text-[#8c7df8]'}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className={m.highlighted ? 'text-white' : 'text-[#e2e8f0]'}>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={bookingUrl}
                className={`mt-auto text-center py-3 px-6 rounded-full font-bold text-sm transition-colors ${
                  m.highlighted
                    ? 'bg-[#0a0e1a] text-[#8c7df8] hover:bg-[#10141f]'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                Aanmelden
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
