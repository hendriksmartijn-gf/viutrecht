"use client";

import Link from "next/link";
import { useState } from "react";
import { pathFor, POST_TYPES, UI, type Language } from "@/sanity/i18n";
import { Button } from "./Button";
import { SanityImage } from "./SanityImage";
import { PostCard, PostMeta, PostThumb, type PostCardData } from "./PostCard";

type Post = PostCardData;

const PAGE_SIZE = 6;

// The news page: the newest post featured, filters per kind of post (only the kinds that have
// posts), and the rest as cards, six at a time. Every post is in the server-rendered HTML.
export function NewsOverview({ posts, lang }: { posts: Post[]; lang: Language }) {
  const t = UI[lang];
  const types = POST_TYPES[lang];
  const [filter, setFilter] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (!posts.length) return <p className="text-[17px] text-ink/60">{t.noPosts}</p>;

  const kinds = Object.keys(types).filter((kind) => posts.some((p) => p.postType === kind));
  const [featured, ...rest] = posts;
  const list = filter ? posts.filter((p) => p.postType === filter) : rest;
  const shown = list.slice(0, visible);
  const choose = (kind: string | null) => {
    setFilter(kind);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-6">
      {kinds.length > 1 && (
        <div role="group" aria-label={t.newsFilters} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
          <FilterButton active={!filter} onClick={() => choose(null)}>
            {t.newsAll} <span className={`font-mono text-[11px] font-medium ${!filter ? "text-white/70" : "text-ink/45"}`}>{posts.length}</span>
          </FilterButton>
          {kinds.map((kind) => (
            <FilterButton key={kind} active={filter === kind} onClick={() => choose(kind)}>
              {types[kind]}
            </FilterButton>
          ))}
        </div>
      )}

      {!filter && <FeaturedPost post={featured} lang={lang} />}

      {list.length > 0 && (
        <div className="flex flex-col gap-10 pt-6 md:pt-12">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-ink/55">{filter ? types[filter] : t.latestArticles}</p>
            <p className="text-[14px] font-medium text-ink/60">{t.newestFirst}</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((post) => (
              <li key={post._id}>
                <PostCard post={post} lang={lang} />
              </li>
            ))}
          </ul>
          {list.length > visible && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="group inline-flex items-center gap-3.5 rounded-full border border-ink/25 py-[7px] pl-[22px] pr-[7px] text-[15px] font-semibold tracking-[-0.01em] transition-[translate,box-shadow,background-color,border-color] duration-300 hover:border-coral hover:bg-coral hover:shadow-[0_12px_32px_-10px_rgba(248,105,87,0.8)] motion-safe:hover:-translate-y-0.5"
              >
                {t.loadMore}
                <span aria-hidden className="flex size-[30px] items-center justify-center rounded-full bg-lilac text-[13px] transition-colors group-hover:bg-white">
                  <span className="leading-none motion-safe:group-hover:animate-wiggle">👇</span>
                </span>
              </button>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-ink/45">
                {t.shownOf.replace("{shown}", String(shown.length)).replace("{total}", String(list.length))}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full px-[18px] py-2.5 text-[14px] font-semibold leading-[normal] transition-colors ${
        active ? "bg-primary text-white" : "border border-ink/12 bg-white hover:border-coral hover:bg-coral"
      }`}
    >
      {children}
    </button>
  );
}

function FeaturedPost({ post, lang }: { post: Post; lang: Language }) {
  const t = UI[lang];
  const href = pathFor("post", post.language, post.slug);
  return (
    <article className="group flex flex-col gap-3 rounded-[32px] border border-ink/7 bg-white p-3 md:rounded-[40px] lg:flex-row">
      <div className="relative lg:w-[700px] lg:shrink-0">
        <PostThumb post={post} width={1400} height={960} sizes="(min-width: 1024px) 700px, 100vw" className="h-[260px] rounded-[24px] md:h-[380px] md:rounded-[32px] lg:h-[480px]" />
        <span aria-hidden className="absolute left-4 top-4 flex size-20 rotate-[10deg] items-center justify-center rounded-full bg-sun text-[17px] font-bold tracking-[-0.03em] md:left-6 md:top-6 md:size-24 md:text-[20px]">
          {t.newBadge}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-[22px] p-4 md:p-10">
        <PostMeta post={post} lang={lang} long />
        <h2 className="text-[clamp(30px,3.1vw,44px)] font-bold leading-[1.02] tracking-[-0.035em]">
          <Link href={href} className="transition-colors hover:text-primary">
            {post.title}
          </Link>
        </h2>
        {post.summary && <p className="text-[17px] leading-[1.55] text-ink/70">{post.summary}</p>}
        {post.author?.name && (
          <div className="flex items-center gap-3">
            {post.author.photo?.asset && <SanityImage image={post.author.photo} width={88} height={88} sizes="44px" className="size-11 rounded-full object-cover" />}
            <div className="flex flex-col gap-0.5 leading-[normal]">
              <span className="text-[15px] font-semibold">{post.author.name}</span>
              {post.author.role && <span className="font-mono text-[9px] font-medium uppercase tracking-[0.03em] text-ink/55">{post.author.role}</span>}
            </div>
          </div>
        )}
        <div>
          <Button href={href} label={t.readStory} emoji="📖" />
        </div>
      </div>
    </article>
  );
}

