"use client";

import { useState, useSyncExternalStore } from "react";

type Props = { url: string; title: string; labels: { share: string; copy: string; copied: string; more: string } };

// Copy link, WhatsApp, and the phone's own share sheet where there is one (that is also the way
// to Instagram, which has no share link for the web).
export function ShareButtons({ url, title, labels }: Props) {
  const [copied, setCopied] = useState(false);
  // False on the server and during hydration, then whether this browser has a share sheet.
  const canShare = useSyncExternalStore(noSubscribe, () => "share" in navigator, () => false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. no permission): nothing to do, the address bar still works.
    }
  };
  const chip = "rounded-full border border-ink/12 bg-white px-3.5 py-2 text-[13px] font-medium leading-[normal] transition-colors hover:border-coral hover:bg-coral";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-ink/50">{labels.share}</p>
      <button type="button" onClick={copy} className={chip} aria-live="polite">
        {copied ? labels.copied : labels.copy}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener" className={chip}>
        WhatsApp
      </a>
      {canShare && (
        <button type="button" onClick={() => navigator.share({ title, url }).catch(() => {})} className={chip}>
          {labels.more}
        </button>
      )}
    </div>
  );
}

const noSubscribe = () => () => {};
