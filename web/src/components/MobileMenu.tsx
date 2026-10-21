"use client";

import { useEffect, useId, useState } from "react";

type Props = { label: string; openLabel: string; closeLabel: string; children: React.ReactNode };

// The menu button below `lg` and the full-screen panel it opens. The links themselves are
// server-rendered (children); this only adds the open state, Escape, scroll lock and closing
// after a link is followed.
export function MobileMenu({ label, openLabel, closeLabel, children }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={openLabel}
        onClick={() => setOpen(true)}
        className="flex size-11 flex-col items-center justify-center gap-1 rounded-full border border-current/28 bg-white/14 backdrop-blur-md transition-colors hover:bg-coral hover:text-ink lg:hidden"
      >
        <span aria-hidden className="h-[1.5px] w-4 bg-current" />
        <span aria-hidden className="h-[1.5px] w-4 bg-current" />
        <span aria-hidden className="h-[1.5px] w-4 bg-current" />
      </button>
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        hidden={!open}
        // Following a link (soft navigation) keeps this component mounted, so close it here.
        onClick={(event) => (event.target as Element).closest("a") && setOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto bg-paper text-ink lg:hidden"
      >
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-1.5 flex size-11 items-center justify-center rounded-full border border-ink/15 bg-white text-[22px] leading-none transition-colors hover:bg-coral"
        >
          <span aria-hidden>×</span>
        </button>
        {children}
      </div>
    </>
  );
}
