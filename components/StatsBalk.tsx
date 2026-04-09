type Stat = {
  _key: string
  value: string
  label: string
}

type Props = {
  stats: Stat[]
}

export default function StatsBalk({ stats }: Props) {
  if (!stats?.length) return null

  return (
    <div className="border-y border-white/5 bg-[#060911]">
      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/5">
        {stats.map((stat) => (
          <div key={stat._key} className="text-center md:px-8">
            <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
            <p className="text-sm text-[#8b94a8] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
