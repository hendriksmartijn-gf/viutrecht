'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavItem = {
  _key: string
  label: string
  url: string
}

type Props = {
  navItems: NavItem[]
  ctaLabel: string
  ctaUrl: string
}

export default function MobileNav({ navItems, ctaLabel, ctaUrl }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
        aria-label="Menu openen"
      >
        <span className={`block h-0.5 w-6 bg-[#151c1f] transition-all duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-6 bg-[#151c1f] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-[#151c1f] transition-all duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-cream)] border-b border-[#151c1f]/5 px-6 py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item._key}
              href={item.url}
              onClick={() => setOpen(false)}
              className="text-lg font-semibold text-[#151c1f] hover:opacity-70 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={ctaUrl}
            onClick={() => setOpen(false)}
            className="mt-2 text-center rounded-[5px] bg-[var(--color-purple)] px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </>
  )
}
