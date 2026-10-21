import Link from "next/link";
import { pathFor } from "@/sanity/i18n";

export type LinkValue = {
  label?: string | null;
  linkType?: string | null;
  url?: string | null;
  emoji?: string | null;
  internal?: { _type: string; language?: string | null; slug?: string | null; emoji?: string | null } | null;
} | null | undefined;

// The emoji in a button: set on the link, else the target lesson's own, else by intent.
export function emojiFor(link: LinkValue, href: string | null): string {
  if (link?.emoji) return link.emoji;
  if (link?.internal?.emoji) return link.internal.emoji;
  if (link?.linkType === "trial") return "🎁";
  if (href?.startsWith("mailto:") || href?.startsWith("tel:")) return "💬";
  return "👉";
}

export function hrefFor(link: LinkValue, trialUrl?: string | null): string | null {
  if (!link) return null;
  if (link.linkType === "trial") return trialUrl ?? null;
  if (link.linkType === "external") return link.url ?? null;
  if (link.internal) return pathFor(link.internal._type, link.internal.language, link.internal.slug);
  return null;
}

export function CtaLink({ link, trialUrl, className }: { link: LinkValue; trialUrl?: string | null; className?: string }) {
  const href = hrefFor(link, trialUrl);
  if (!href || !link?.label) return null;
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {link.label}
    </Link>
  ) : (
    <a href={href} className={className} rel="noopener">
      {link.label}
    </a>
  );
}
