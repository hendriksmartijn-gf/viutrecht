import Link from "next/link";
import type { POST_QUERY_RESULT } from "../../sanity.types";
import { absoluteUrl, pathFor, POST_TYPES, UI, type Language } from "@/sanity/i18n";
import { ArticleToc } from "./ArticleToc";
import { Button } from "./Button";
import { PostCard, PostMeta, type PostCardData } from "./PostCard";
import { RichText, tableOfContents } from "./RichText";
import { SanityImage } from "./SanityImage";
import { CtaPanel, INSET, type Section } from "./Sections";
import { ShareButtons } from "./ShareButtons";

type Props = {
  doc: NonNullable<POST_QUERY_RESULT>;
  lang: Language;
  // The news overview page, when it exists, for the breadcrumb and "Alle nieuws".
  overviewPath: string | null;
  cta: Extract<Section, { _type: "ctaSection" }> | null;
  trialUrl?: string | null;
};

// Same side padding as the news overview (128px from the edge on desktop).
const WIDE = "mx-auto w-full max-w-[1440px] px-5 md:px-12 lg:px-32";

export function PostPage({ doc, lang, overviewPath, cta, trialUrl }: Props) {
  const t = UI[lang];
  const kind = doc.postType ? POST_TYPES[lang][doc.postType] : null;
  const path = pathFor("post", lang, doc.slug);
  const toc = tableOfContents(doc.body);

  return (
    <article>
      <header className={`${WIDE} flex flex-col gap-7 pb-12 pt-12 md:pt-[88px]`}>
        <nav data-hero-item aria-label={t.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.05em]">
            <li className="text-ink/45">
              <Link href={pathFor("homePage", lang)} className="hover:text-ink">{t.home}</Link>
            </li>
            {overviewPath && (
              <>
                <li aria-hidden className="text-ink/30">/</li>
                <li className="text-ink/45">
                  <Link href={overviewPath} className="hover:text-ink">{t.news}</Link>
                </li>
              </>
            )}
            {kind && (
              <>
                <li aria-hidden className="text-ink/30">/</li>
                <li aria-current="page" className="text-ink/85">{kind}</li>
              </>
            )}
          </ol>
        </nav>
        <div data-hero-item>
          <PostMeta post={doc} lang={lang} long />
        </div>
        <h1 data-hero-item className="max-w-[1000px] text-[clamp(44px,5.6vw,80px)] font-bold leading-[0.98] tracking-[-0.045em]">
          {doc.title}
          {doc.titleEmphasis && (
            <>
              {" "}
              <em className="display-emphasis text-[1.0625em] tracking-[-0.01em] text-primary">{doc.titleEmphasis}</em>
            </>
          )}
        </h1>
        <div data-hero-item className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-7">
            {doc.summary && <p className="max-w-[760px] text-[clamp(19px,1.6vw,22px)] leading-[1.5] text-ink/75">{doc.summary}</p>}
            {doc.author?.name && (
              <div className="flex items-center gap-3">
                {doc.author.photo?.asset && <SanityImage image={doc.author.photo} width={96} height={96} sizes="48px" className="size-12 rounded-full object-cover" />}
                <div className="flex flex-col gap-0.5 leading-[normal]">
                  <span className="text-[15px] font-semibold">{doc.author.name}</span>
                  {doc.author.role && <span className="font-mono text-[9px] font-medium uppercase tracking-[0.03em] text-ink/55">{doc.author.role}</span>}
                </div>
              </div>
            )}
          </div>
          <ShareButtons url={absoluteUrl(path)} title={doc.title ?? ""} labels={{ share: t.share, copy: t.copyLink, copied: t.linkCopied, more: t.shareMore }} />
        </div>
      </header>

      {doc.heroImage?.asset && (
        <figure className={`${WIDE} flex flex-col gap-3 pb-12 md:pb-[72px]`}>
          <div data-hero-media className="h-[clamp(260px,43vw,620px)] overflow-hidden rounded-[28px] md:rounded-[40px]">
            <SanityImage image={doc.heroImage} width={2368} height={1240} priority sizes="(min-width: 1440px) 1184px, 100vw" className="size-full object-cover" />
          </div>
          {doc.heroCaption && <figcaption className="font-mono text-[10px] font-medium uppercase tracking-[0.03em] text-ink/45">{doc.heroCaption}</figcaption>}
        </figure>
      )}

      <div className={`${WIDE} flex flex-col gap-10 pb-20 md:pb-24 lg:flex-row lg:gap-24`}>
        {toc.length > 1 && (
          <div className="hidden lg:block lg:w-[260px] lg:shrink-0">
            <ArticleToc items={toc} label={t.inThisArticle} />
          </div>
        )}
        <div className={`flex min-w-0 max-w-[720px] flex-col gap-10 ${toc.length > 1 ? "" : "lg:mx-auto"}`}>
          <RichText value={doc.body} variant="article" />
          {doc.program && (
            <p>
              <Link href={pathFor("program", doc.program.language, doc.program.slug)} className="font-semibold text-primary hover:text-coral">
                {doc.program.title} →
              </Link>
            </p>
          )}
          {doc.tags?.length ? (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-ink/45">{t.tags}</p>
              {doc.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-sand px-3 py-1.5 font-mono text-[10px] font-medium uppercase leading-[normal] tracking-[0.03em] text-ink/90">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {doc.related?.length ? (
        <section className={`${INSET} bg-sand`}>
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-16 md:px-12 md:py-24">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="flex flex-col gap-4">
                <p className="eyebrow text-ink/55">{t.readOn}</p>
                <h2 className="text-[clamp(40px,3.9vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]">
                  {t.moreFrom} <em className="display-emphasis text-[1.07em]">{t.moreFromEmphasis}</em>
                </h2>
              </div>
              {overviewPath && <Button href={overviewPath} label={t.allNews} variant="ghostDark" emoji="📰" />}
            </div>
            <ul data-stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {doc.related.map((post) => (
                <li key={post._id}>
                  <PostCard post={post as PostCardData} lang={lang} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {cta && <CtaPanel heading={cta.heading} intro={cta.intro} link={cta.cta} note={cta.note} trialUrl={trialUrl} />}
    </article>
  );
}
