import Link from "next/link";
import { pathFor, POST_TYPES, UI, type Language } from "@/sanity/i18n";
import { SanityImage } from "./SanityImage";
import type { Section } from "./Sections";

// Shared by the news overview and the article page (no hooks, so usable on both sides).
export type PostCardData = NonNullable<Extract<Section, { _type: "newsSection" }>["items"]>[number];

// The emoji on a post without photo, and on "Lees verder".
export const TYPE_EMOJI: Record<string, string> = { news: "📣", event: "🎉", change: "🗓️", community: "🤝", training: "💪", nutrition: "🥗" };

export const postDate = (iso: string, lang: Language) =>
  new Date(iso).toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Amsterdam" });
// About 1,200 characters a minute.
export const readingMinutes = (post: { textLength?: number | null }) => Math.max(1, Math.round((post.textLength ?? 0) / 1200));


export function PostMeta({ post, lang, long }: { post: Pick<PostCardData, "postType" | "publishedAt" | "textLength">; lang: Language; long?: boolean }) {
  const t = UI[lang];
  const label = post.postType ? POST_TYPES[lang][post.postType] : null;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {label && (
        <span className="rounded-full bg-lilac px-3 py-1.5 font-mono text-[10px] font-medium uppercase leading-[normal] tracking-[0.03em] text-ink/90">{label}</span>
      )}
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.03em] text-ink/55">
        {post.publishedAt && <time dateTime={post.publishedAt}>{postDate(post.publishedAt, lang)}</time>} · {readingMinutes(post)} {long ? t.minRead : t.minutes}
      </span>
    </div>
  );
}

export function PostThumb({ post, className, sizes, width, height }: { post: PostCardData; className: string; sizes: string; width: number; height: number }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-sand ${className}`}>
      {post.heroImage?.asset ? (
        <SanityImage image={post.heroImage} width={width} height={height} sizes={sizes} className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
      ) : (
        <span aria-hidden className="text-[56px]">{TYPE_EMOJI[post.postType ?? ""] ?? "📣"}</span>
      )}
    </div>
  );
}

export function PostCard({ post, lang }: { post: PostCardData; lang: Language }) {
  const t = UI[lang];
  return (
    <article className="group relative flex h-full flex-col rounded-[28px] border border-ink/7 bg-white p-2 transition-[translate,box-shadow] duration-300 hover:shadow-[0_20px_40px_-24px_rgba(13,13,15,0.35)] motion-safe:hover:-translate-y-1">
      <PostThumb post={post} width={728} height={480} sizes="(min-width: 1024px) 364px, (min-width: 768px) 50vw, 100vw" className="h-60 rounded-[24px]" />
      <div className="flex flex-1 flex-col items-start gap-3 px-4 py-[18px]">
        <PostMeta post={post} lang={lang} />
        <h3 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] transition-colors group-hover:text-primary">
          {/* The whole card is the link. */}
          <Link href={pathFor("post", post.language, post.slug)} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        {post.summary && <p className="line-clamp-3 text-[15px] leading-[1.5] text-ink/68">{post.summary}</p>}
        <span aria-hidden className="mt-auto flex items-center gap-2 pt-1 text-[14px] font-semibold text-primary">
          {t.readOn}
          <span className="flex size-7 items-center justify-center rounded-full bg-lilac text-[12px] transition-colors group-hover:bg-coral">
            <span className="leading-none motion-safe:group-hover:animate-wiggle">{TYPE_EMOJI[post.postType ?? ""] ?? "📖"}</span>
          </span>
        </span>
      </div>
    </article>
  );
}
