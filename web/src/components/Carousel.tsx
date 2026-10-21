"use client";

import { useRef } from "react";

type Props = { children: React.ReactNode; prevLabel: string; nextLabel: string; header?: React.ReactNode };

// Horizontal scroll-snap track with prev/next buttons. The cards are server-rendered and
// stay reachable by swiping or keyboard scrolling without these buttons.
export function Carousel({ children, prevLabel, nextLabel, header }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };
  const button = "flex size-[52px] items-center justify-center rounded-full text-[18px] font-medium transition-colors";
  return (
    <>
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        {header}
        <div className="flex gap-2.5">
          <button type="button" onClick={() => scroll(-1)} aria-label={prevLabel} className={`${button} border border-ink/15 bg-white hover:bg-coral`}>
            ←
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={nextLabel} className={`${button} bg-primary text-white hover:bg-coral hover:text-ink`}>
            →
          </button>
        </div>
      </div>
      <ul
        ref={track}
        data-stagger
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </>
  );
}
