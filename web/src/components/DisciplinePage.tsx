import Link from "next/link";
import type { DISCIPLINE_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { pathFor, UI, type Language } from "@/sanity/i18n";
import { Button } from "./Button";
import { Faqs } from "./Faqs";
import { RichText } from "./RichText";
import { SanityImage } from "./SanityImage";
import { SectionHead } from "./SectionHead";
import { CONTAINER, CtaPanel, INSET, type Section } from "./Sections";

type Discipline = NonNullable<DISCIPLINE_QUERY_RESULT>;
type Cta = Extract<Section, { _type: "ctaSection" }> | null | undefined;

type Props = {
  doc: Discipline;
  lang: Language;
  settings: SETTINGS_QUERY_RESULT;
  // The homepage's closing CTA, reused so its heading and button live in one place.
  cta: Cta;
  overviewPath: string | null;
};

const LEVELS: Record<Language, Record<string, string>> = {
  nl: { beginner: "beginner", intermediate: "gemiddeld", advanced: "gevorderd", pro: "pro" },
  en: { beginner: "beginner", intermediate: "intermediate", advanced: "advanced", pro: "pro" },
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Lesson template (Figma: VI — Olympic Weightlifting — Desktop). Every block is optional,
// so lessons with less content still read as a complete page.
const ESSENTIAL_COLUMNS: Record<number, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

export function DisciplinePage({ doc, lang, settings, cta, overviewPath }: Props) {
  const t = UI[lang];
  const trialUrl = settings?.trialUrl;

  // "[ 01 ] De sport" ... numbered in the order the blocks appear.
  const outline = doc.lessonOutline;
  const hasOutline = Boolean(outline?.blocks?.length || outline?.whatToBring?.length || doc.promise?.quote);
  const blocks = [
    doc.essentials?.heading?.text ? "essentials" : null,
    doc.benefits?.items?.length ? "benefits" : null,
    outline?.blocks?.length && outline.heading?.eyebrow ? "outline" : null,
    doc.faqs?.length ? "faq" : null,
  ].filter(Boolean);
  const number = (block: string) => blocks.indexOf(block) + 1 || undefined;

  const level = doc.level?.from
    ? [doc.level.from, doc.level.to].filter(Boolean).map((l, i) => (i === 0 ? capitalize(LEVELS[lang][l!] ?? l!) : LEVELS[lang][l!] ?? l)).join(" → ")
    : null;
  const facts = [
    level && { label: t.level, value: level },
    doc.durationMinutes && { label: t.duration, value: `${doc.durationMinutes} ${t.minutes}` },
    doc.maxGroupSize && { label: t.group, value: `${t.maxGroup} ${doc.maxGroupSize}` },
    ...(doc.extraFacts ?? []),
  ].filter(Boolean) as { label: string; value: string }[];

  // Minute ranges are derived from each block's duration: 00–10, 10–30, ...
  const outlineBlocks = outline?.blocks ?? [];
  const timeline = outlineBlocks.map((block, i) => {
    const from = outlineBlocks.slice(0, i).reduce((sum, b) => sum + (b.minutes ?? 0), 0);
    const to = from + (block.minutes ?? 0);
    return { ...block, range: block.minutes ? `${String(from).padStart(2, "0")}–${to} ${t.minutes}` : null };
  });

  return (
    <article>
      {/* Hero */}
      {/* Without a photo the hero shrinks to its copy instead of leaving an empty half. */}
      <header className={`mx-auto flex w-full max-w-[1280px] flex-col gap-8 py-4 lg:flex-row lg:gap-0 lg:pr-4 ${doc.heroImage?.asset ? "lg:h-[720px]" : "lg:py-20"}`}>
        <div className="flex flex-col justify-center gap-7 px-6 pt-8 md:px-12 lg:w-[660px] lg:shrink-0 lg:pt-0">
          <nav data-hero-item aria-label={t.breadcrumb}>
            <ol className="flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.06em]">
              <li className="text-ink/45">{overviewPath ? <Link href={overviewPath} className="hover:text-ink">{t.classes}</Link> : t.classes}</li>
              <li aria-hidden className="text-ink/30">/</li>
              <li aria-current="page" className="text-ink/85">{doc.title}</li>
            </ol>
          </nav>
          <div data-hero-item className="flex flex-col gap-3">
            <h1 className="text-[clamp(44px,6.1vw,88px)] font-bold leading-[0.94] tracking-[-0.045em] hyphens-auto lg:w-[600px] lg:hyphens-none">
              {doc.title}
            </h1>
            {doc.heading?.emphasis && (
              <p className="display-emphasis max-w-[560px] text-[clamp(30px,2.8vw,40px)] leading-[1.1] text-primary">{doc.heading.emphasis}</p>
            )}
          </div>
          {/* The summary is the first paragraph: the direct answer to "what is this, for whom". */}
          {doc.summary && <p data-hero-item className="max-w-[500px] text-[18px] leading-[1.5] text-ink/70">{doc.summary}</p>}
          {facts.length > 0 && (
            <dl data-hero-item className="grid grid-cols-2 gap-2 sm:flex">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-1 flex-col gap-1.5 rounded-2xl border border-ink/7 bg-white px-3.5 py-3 sm:max-w-[160px]">
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-ink/50">{f.label}</dt>
                  <dd className="text-[17px] font-semibold tracking-[-0.01em] whitespace-nowrap">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div data-hero-item className="flex flex-wrap gap-3">
            <Button href={trialUrl} label={t.bookTrialClass} emoji="🎁" />
            <Button href={settings?.scheduleUrl} label={t.allTimes} variant="ghostDark" arrow={false} className="py-4" />
          </div>
        </div>
        {doc.heroImage?.asset && (
          <div className="relative mx-4 h-[420px] overflow-hidden rounded-[32px] lg:mx-0 lg:h-full lg:flex-1">
            <div data-hero-media className="size-full">
              <SanityImage image={doc.heroImage} width={1208} height={1376} priority sizes="(min-width: 1024px) 604px, 100vw" className="size-full object-cover" />
            </div>
          </div>
        )}
      </header>

      {/* De kern ("Twee lifts. Eén complete atleet.") */}
      {doc.essentials?.heading?.text && (
        <section className={`${INSET} bg-sand`}>
          <div className={`${CONTAINER} flex flex-col gap-14 py-20 md:py-28`}>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionHead heading={doc.essentials.heading} number={number("essentials")} stacked className="max-w-[720px]" />
              {doc.essentials.intro && <p data-reveal className="max-w-[380px] text-[17px] leading-[1.5] text-ink/72">{doc.essentials.intro}</p>}
            </div>
            {doc.essentials.image?.asset && (
              <div data-parallax className="h-[300px] overflow-hidden rounded-[32px]">
                <SanityImage image={doc.essentials.image} width={2368} height={600} sizes="(min-width: 1280px) 1184px, 100vw" className="size-full object-cover" />
              </div>
            )}
            {doc.essentials.items?.length ? (
              // Columns follow the number of items, so three never leave an empty fourth column.
              <ol data-stagger className={`grid gap-4 ${ESSENTIAL_COLUMNS[doc.essentials.items.length] ?? "md:grid-cols-2"}`}>
                {doc.essentials.items.map((item, i) => (
                  // Phones: number beside the text. From md the cards share a row and get narrow,
                  // so the number goes on top and the text keeps the full card width.
                  <li key={item._key} className="flex gap-4 rounded-[24px] border border-ink/7 bg-white p-5 md:flex-col md:gap-5 md:rounded-[28px] md:p-7">
                    <span aria-hidden className="display-emphasis shrink-0 text-[56px] leading-[0.9] text-primary md:text-[88px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex min-w-0 flex-col gap-2.5">
                      <h3 className="text-[clamp(24px,2.5vw,36px)] font-bold leading-[1.05] tracking-[-0.03em] hyphens-auto [overflow-wrap:anywhere]">{item.title}</h3>
                      {item.description && <p className="max-w-[380px] text-[16px] leading-[1.5] text-ink/70">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      )}

      {/* Wat levert het op? */}
      {doc.benefits?.items?.length ? (
        <section className="bg-white">
          <div className={`${CONTAINER} flex flex-col gap-14 py-20 md:py-28`}>
            <SectionHead heading={doc.benefits.heading} number={number("benefits")} stacked className="max-w-[900px]" />
            <ul data-stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {doc.benefits.items.map((benefit, i) => (
                <li key={benefit} className="flex min-h-[220px] flex-col justify-between gap-8 rounded-[28px] border border-ink/7 bg-white p-7">
                  <span aria-hidden className="eyebrow text-ink/50">[ {String(i + 1).padStart(2, "0")} ]</span>
                  <p className="max-w-[320px] text-[24px] font-semibold leading-[1.25] tracking-[-0.02em]">{benefit}</p>
                </li>
              ))}
              <li className="flex min-h-[220px] flex-col justify-between gap-8 rounded-[28px] bg-lavender p-7">
                <span className="eyebrow text-white/70">{t.tryIt}</span>
                <div className="flex flex-col items-start gap-4">
                  <p className="text-[24px] font-semibold tracking-[-0.02em] text-white">{t.firstClassFree}</p>
                  <Button href={trialUrl} label={t.bookTrialClass} emoji="🎁" variant="sun" />
                </div>
              </li>
            </ul>
          </div>
        </section>
      ) : null}

      {/* Je eerste les */}
      {hasOutline && (
        <section className="bg-white">
          <div className={`${CONTAINER} flex flex-col gap-16 pb-20 md:pb-28 lg:flex-row ${doc.benefits?.items?.length ? "" : "pt-20 md:pt-28"}`}>
            {timeline.length > 0 && (
              <div className="flex flex-1 flex-col gap-10">
                <SectionHead heading={outline?.heading} number={number("outline")} size="md" stacked className="max-w-[620px]" />
                <ol data-stagger className="flex flex-col gap-2">
                  {timeline.map((block, i) => (
                    <li key={block._key} className="flex flex-col gap-3 rounded-[20px] border border-ink/7 bg-white px-6 py-[22px] sm:flex-row sm:gap-7">
                      {/* Blocks without minutes (a process rather than a class) are numbered as steps. */}
                      <span className="w-[110px] shrink-0 font-mono text-[12px] font-medium uppercase tracking-[0.03em] text-ink/50">
                        {block.range ?? `${t.step} ${String(i + 1).padStart(2, "0")}`}
                      </span>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{block.title}</h3>
                        {block.description && <p className="max-w-[440px] text-[15px] leading-[1.5] text-ink/65">{block.description}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div data-stagger className={`flex flex-col gap-4 ${timeline.length ? "lg:w-[380px] lg:shrink-0 lg:pt-24" : "w-full md:flex-row"}`}>
              {outline?.whatToBring?.length ? (
                <div className="flex flex-1 flex-col gap-5 rounded-[32px] bg-lilac p-8">
                  <p className="eyebrow text-ink/60">{t.whatToBringLabel}</p>
                  <ul className="flex flex-col gap-5 text-[16px]">
                    {outline.whatToBring.map((thing) => (
                      <li key={thing} className="flex items-center gap-3">
                        <span aria-hidden className="font-semibold">✓</span>
                        {thing}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {doc.promise?.quote && (
                <figure className="flex flex-1 flex-col gap-6 rounded-[32px] bg-sand p-8">
                  {doc.promise.label && <p className="eyebrow text-ink/60">{doc.promise.label}</p>}
                  <blockquote className="font-serif text-[30px] leading-[1.12] tracking-[-0.015em]">“{doc.promise.quote}”</blockquote>
                  {doc.promise.coach && (
                    <figcaption className="flex items-center gap-3">
                      <SanityImage image={doc.promise.coach.photo} width={88} height={88} sizes="44px" className="size-11 rounded-3xl object-cover" />
                      <span className="flex flex-col gap-1">
                        <span className="text-[15px] font-semibold">{doc.promise.coach.name}</span>
                        {doc.promise.coach.role && (
                          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.03em] text-ink/55">{doc.promise.coach.role}</span>
                        )}
                      </span>
                    </figcaption>
                  )}
                </figure>
              )}
            </div>
          </div>
        </section>
      )}

      {doc.body?.length ? (
        <section className={`${CONTAINER} pb-20`}>
          <div className="max-w-3xl">
            <RichText value={doc.body} />
          </div>
        </section>
      ) : null}

      {/* Vragen */}
      {doc.faqs?.length ? (
        <section className={`${INSET} bg-sand`}>
          <div className={`${CONTAINER} flex flex-col gap-[72px] py-20 md:py-28 lg:flex-row`}>
            <div className="flex flex-col items-start gap-6 lg:w-[420px] lg:shrink-0">
              <SectionHead
                heading={doc.faqHeading?.text ? doc.faqHeading : { eyebrow: t.questions, text: t.faqText, emphasis: t.faqEmphasis }}
                number={number("faq")}
                size="md"
                stacked
              />
              <Button href={trialUrl} label={t.bookTrialClass} emoji="🎁" />
            </div>
            <div className="flex-1">
              <Faqs faqs={doc.faqs} size="lg" openFirst />
            </div>
          </div>
        </section>
      ) : null}

      {/* Past goed bij */}
      {doc.related?.length ? (
        <section className="bg-white">
          <div className={`${CONTAINER} flex flex-col gap-10 py-20 md:py-24`}>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="flex flex-col gap-5">
                <p className="eyebrow text-ink/55">{t.goesWellWith}</p>
                <h2 className="text-[clamp(36px,3.35vw,48px)] font-bold leading-[0.96] tracking-[-0.04em]">
                  {t.completePackage} <em className="display-emphasis text-[1.083em]">{t.completePackageEmphasis}</em>
                </h2>
              </div>
              <Button href={overviewPath} label={t.allClasses} emoji="👀" variant="ghostDark" />
            </div>
            <ul data-stagger className="grid gap-4 md:grid-cols-3">
              {doc.related.map((r) => (
                <li key={r._id} className="group relative flex h-[280px] flex-col justify-end overflow-hidden rounded-[28px] bg-ink p-6">
                  <div aria-hidden className="absolute inset-0">
                    <SanityImage image={r.image} width={768} height={560} sizes="(min-width: 768px) 384px, 100vw" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-35% to-ink/92" />
                  </div>
                  <Link
                    href={pathFor("discipline", r.language, r.slug)}
                    className="relative flex items-center justify-between gap-4 text-white after:absolute after:-inset-[200px] after:content-['']"
                  >
                    <span className="text-[clamp(24px,2.2vw,32px)] font-bold uppercase tracking-[-0.03em]">{r.title}</span>
                    <span
                      aria-hidden
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-[22px] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 motion-safe:group-hover:animate-wiggle"
                    >
                      {r.emoji ?? "👉"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {cta && <CtaPanel heading={cta.heading} intro={doc.ctaText ?? cta.intro} link={cta.cta} note={cta.note} trialUrl={trialUrl} />}
    </article>
  );
}
