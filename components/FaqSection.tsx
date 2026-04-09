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
    <section className="bg-[#fdf8ee] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-[#10131c] text-center mb-12"
          style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}>
          Everything You Need to Know.
        </h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id} className="bg-[#ebe7dc] rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === item._id ? null : item._id)}
                className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-[#10131c]"
              >
                {item.question}
                <span className="text-xl ml-4 text-[#8c7df8]">{open === item._id ? '−' : '+'}</span>
              </button>
              {open === item._id && (
                <div className="px-6 pb-5 text-[#514941] text-sm leading-relaxed">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
