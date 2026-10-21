"use client";

import { useEffect, useState } from "react";

type Props = { items: { id: string; title: string }[]; label: string };

// "In dit artikel": sticky next to the text, with the section you are reading highlighted.
export function ArticleToc({ items, label }: Props) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!headings.length) return;
    // The active section is the last heading that has scrolled past the top third of the screen.
    const update = () => {
      const line = window.innerHeight / 3;
      const passed = headings.filter((h) => h.getBoundingClientRect().top < line);
      setActive((passed.at(-1) ?? headings[0]).id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [items]);

  if (items.length < 2) return null;
  return (
    <nav aria-label={label} className="flex flex-col gap-1.5 lg:sticky lg:top-28">
      <p className="eyebrow pb-1 text-[11px] text-ink/55">{label}</p>
      <ol className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={`block rounded-xl px-3 py-2.5 text-[15px] leading-[normal] transition-colors ${
                active === item.id ? "bg-lilac font-semibold text-primary" : "font-medium text-ink/65 hover:bg-sand hover:text-ink"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
