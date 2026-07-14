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

function CheckIcon({ light }: { light?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center shrink-0 w-[22px] h-[22px] rounded-full border ${
        light ? 'border-white' : 'border-[#151c1f]'
      }`}
    >
      <svg className="w-3 h-3" viewBox="0 0 12 10" fill="none">
        <path
          d="M1 5L4.5 8.5L11 1"
          stroke={light ? '#ffffff' : '#151c1f'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function ArrowIcon({ color }: { color: string }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7M17 7H8M17 7V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MembershipsSection({ memberships, bookingUrl }: Props) {
  return (
    <section className="bg-[var(--color-cream)] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-heading text-4xl md:text-[62px] tracking-[-1.86px] text-[#151c1f] mb-3">
            Your Perfect Plan
          </h2>
          <p className="text-lg text-[#151c1f]">Affordable and scalable options for everyone.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {memberships.map((m) => (
            <div
              key={m._id}
              className={`rounded-[20px] p-10 flex flex-col gap-10 ${
                m.highlighted ? 'bg-[var(--color-purple)]' : 'bg-white'
              }`}
            >
              <div className="flex flex-col gap-5">
                <span
                  className={`inline-flex self-start rounded-full px-3 py-1.5 text-xs font-medium ${
                    m.highlighted ? 'bg-[var(--color-yellow)] text-[var(--color-purple)]' : 'bg-[var(--color-purple)] text-white'
                  }`}
                >
                  {m.title}
                </span>

                <div className="flex flex-col gap-5">
                  <p className={m.highlighted ? 'text-white' : 'text-[#151c1f]'}>
                    <span className="font-heading font-medium text-4xl md:text-[55px]">€{m.price}</span>
                    <span className={`font-heading font-medium text-2xl md:text-[38px] ${m.highlighted ? 'text-white/90' : 'text-[#151c1f]'}`}>
                      /mo
                    </span>
                  </p>
                  <p className={`text-base font-medium ${m.highlighted ? 'text-white/50' : 'text-[#717171]'}`}>
                    What&rsquo;s included
                  </p>
                </div>

                {m.features && m.features.length > 0 && (
                  <ul className="flex flex-col gap-[15px]">
                    {m.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <CheckIcon light={m.highlighted} />
                        <span className={`text-lg font-medium ${m.highlighted ? 'text-[#e9e6fa]' : 'text-[#151c1f]'}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <a
                href={bookingUrl}
                className={`flex items-center justify-center gap-2.5 rounded-2xl py-4 font-heading font-medium text-base transition-opacity hover:opacity-90 ${
                  m.highlighted ? 'bg-white text-[#573cff]' : 'bg-[var(--color-yellow)] text-[#151c1f]'
                }`}
              >
                Become a member
                <ArrowIcon color={m.highlighted ? '#573cff' : '#151c1f'} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
