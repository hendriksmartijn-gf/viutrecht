"use client";

import { useEffect, useRef } from "react";

// The mega menu opens with CSS (hover, keyboard focus). After a link in it is clicked the header
// stays mounted (soft navigation) and the mouse is often still over the panel, so it would stay
// open. This marks the menu closed (data-closed) until the pointer leaves it.
export function MegaMenuCloser() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const menu = ref.current?.parentElement;
    if (!menu) return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target as Element).closest("a")) return;
      menu.dataset.closed = "";
      (document.activeElement as HTMLElement | null)?.blur();
    };
    const onLeave = () => delete menu.dataset.closed;
    menu.addEventListener("click", onClick);
    menu.addEventListener("pointerleave", onLeave);
    return () => {
      menu.removeEventListener("click", onClick);
      menu.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <span ref={ref} hidden />;
}
