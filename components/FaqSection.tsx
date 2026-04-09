'use client'

import { useState } from 'react'

type FaqItem = {
  _id: string
  question: string
  answer: string
}

type Props = {
  items: FaqItem[]
}

export default function FaqSection({ items }: Props) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section className="bg-[#060911] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8c7df8] mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Veelgestelde vragen.
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-2xl bg-[#10141f] border border-white/5 overflow-hidden">
              <button
                onClick={() => setOpen(open === item._id ? null : item._id)}
                className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-white hover:text-[#bab1fa] transition-colors"
              >
                {item.question}
                <svg
                  className={`w-5 h-5 flex-shrink-0 ml-4 text-[#8c7df8] transition-transform duration-200 ${open === item._id ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {open === item._id && (
                <div className="px-6 pb-5 text-sm text-[#8b94a8] leading-relaxed">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
