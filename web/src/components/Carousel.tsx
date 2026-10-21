"use client";

import { Children, useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  prevLabel: string;
  nextLabel: string;
  header?: React.ReactNode;
  // Rendered between the header and the track on phones only (e.g. the rating card).
  aside?: React.ReactNode;
};

// Horizontal scroll-snap track with prev/next buttons (tablet and up) and position dots
// (phones). The cards are server-rendered and stay reachable by swiping or keyboard scrolling.
export function Carousel({ children, prevLabel, nextLabel, header, aside }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const active = useSnapIndex(track);
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
        <div className="hidden gap-2.5 md:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label={prevLabel} className={`${button} border border-ink/15 bg-white hover:bg-coral`}>
            ←
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={nextLabel} className={`${button} bg-primary text-white hover:bg-coral hover:text-ink`}>
            →
          </button>
        </div>
      </div>
      {aside && <div className="md:hidden">{aside}</div>}
      <div className="flex flex-col gap-6">
        <ul
          ref={track}
          data-stagger
          className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </ul>
        <Dots count={Children.toArray(children).filter(Boolean).length} active={active} className="md:hidden" />
      </div>
    </>
  );
}

type SnapListProps = { children: React.ReactNode; className?: string; dotsClassName?: string };

// A list that is a swipeable row with dots on phones and whatever `className` makes it from
// `md` up (usually a grid). Used for the featured lesson cards.
export function SnapList({ children, className = "", dotsClassName = "" }: SnapListProps) {
  const track = useRef<HTMLUListElement>(null);
  const active = useSnapIndex(track);
  return (
    <>
      <ul
        ref={track}
        data-stagger
        className={`flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] max-md:scroll-px-5 [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </ul>
      <Dots count={Children.toArray(children).filter(Boolean).length} active={active} className={`md:hidden ${dotsClassName}`} />
    </>
  );
}

// Decorative position indicator; swiping is the interaction, so the dots stay out of the
// accessibility tree.
function Dots({ count, active, className = "" }: { count: number; active: number; className?: string }) {
  if (count < 2) return null;
  return (
    <div aria-hidden className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`h-1.5 rounded-[3px] transition-[width,background-color] duration-300 ${i === active ? "w-5 bg-ink" : "w-1.5 bg-ink/20"}`} />
      ))}
    </div>
  );
}

// Index of the card nearest the left edge of a scroll track.
function useSnapIndex(ref: React.RefObject<HTMLElement | null>) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      if (!cards.length) return;
      // At the far end the last card may never reach the left edge; count it as reached.
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) return setIndex(cards.length - 1);
      const left = el.getBoundingClientRect().left;
      let nearest = 0;
      cards.forEach((card, i) => {
        if (Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[nearest].getBoundingClientRect().left - left)) nearest = i;
      });
      setIndex(nearest);
    };
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [ref]);
  return index;
}
