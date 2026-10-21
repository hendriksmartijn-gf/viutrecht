"use client";

import { useEffect, useRef, useState } from "react";

type Props = { className: string; children: React.ReactNode };

// The header starts below the announcement bar (absolute, over the hero). Once the page scrolls
// past that bar it is pinned to the top (data-pinned), and a little further it turns solid
// (data-solid) so it stays readable over any section. See .site-header in globals.css.
export function StickyHeader({ className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState({ pinned: false, solid: false });

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    // Measured while still absolute: where it sits on the page, i.e. below the announcement bar.
    const offset = header.getBoundingClientRect().top + window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setState((prev) => {
        const next = { pinned: y >= offset, solid: y >= offset + 24 };
        return prev.pinned === next.pinned && prev.solid === next.solid ? prev : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={ref} data-pinned={state.pinned || undefined} data-solid={state.solid || undefined} className={className}>
      {children}
    </header>
  );
}
