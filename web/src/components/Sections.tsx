import Image from "next/image";
import Link from "next/link";
import type { HOME_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { urlFor } from "@/sanity/image";
import { pathFor, UI, type Language } from "@/sanity/i18n";
import { Button } from "./Button";
import type { LinkValue } from "./CtaLink";
import { Faqs } from "./Faqs";
import { RichText } from "./RichText";
import { SanityImage } from "./SanityImage";
import { SectionHead } from "./SectionHead";
import { PlanCard } from "./MembershipCard";
import { Carousel } from "./Carousel";

export type Section = NonNullable<NonNullable<HOME_QUERY_RESULT>["sections"]>[number];
type Settings = SETTINGS_QUERY_RESULT;
type Props = {
  sections: Section[] | null | undefined;
  lang: Language;
  settings: Settings;
  // For the breadcrumb in a page intro ("Home / Over ons").
  pageTitle?: string | null;
};

// Shared widths from the design: 1280 content column, and "inset" panels that sit
// 16px from the viewport edge with 48px corners.
export const CONTAINER = "mx-auto w-full max-w-[1280px] px-6 md:px-12";
// Content pages (Over ons) sit 128px from the viewport edge instead of inside the 1280 column.
const WIDE = "mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-32";
export const INSET = "mx-2 overflow-hidden rounded-[32px] md:mx-4 md:rounded-[48px]";

export function Sections({ sections, lang, settings, pageTitle }: Props) {
  if (!sections?.length) return null;
  // Section labels are numbered in page order: "[ 01 ] Je eerste week".
  let counter = 0;
  const numbered = new Map<string, number>();
  for (const s of sections) {
    if ("heading" in s && s.heading?.eyebrow && s._type !== "heroSection") numbered.set(s._key, ++counter);
  }

  return sections.map((section, index) => {
    const props = { lang, settings, number: numbered.get(section._key) };
    switch (section._type) {
      case "heroSection":
        return <Hero key={section._key} section={section} isFirst={index === 0} {...props} />;
      case "introSection":
        return <Intro key={section._key} section={section} isFirst={index === 0} pageTitle={pageTitle} {...props} />;
      case "storySection":
        return <Story key={section._key} section={section} {...props} />;
      case "valuesSection":
        return <Values key={section._key} section={section} {...props} />;
      case "statementSection":
        return <Statement key={section._key} section={section} />;
      case "marqueeSection":
        return <Marquee key={section._key} section={section} />;
      case "stepsSection":
        return <Steps key={section._key} section={section} {...props} />;
      case "disciplinesSection":
        return <Disciplines key={section._key} section={section} {...props} />;
      case "testimonialsSection":
        return <Testimonials key={section._key} section={section} {...props} />;
      case "pricingSection":
        return <Pricing key={section._key} section={section} {...props} />;
      case "faqSection":
        return <GoodToKnow key={section._key} section={section} {...props} />;
      case "ctaSection":
        return <FinalCta key={section._key} section={section} {...props} />;
      case "scheduleSection":
        return <Schedule key={section._key} section={section} {...props} />;
      case "coachesSection":
        return <Coaches key={section._key} section={section} {...props} />;
      case "newsSection":
        return <News key={section._key} section={section} {...props} />;
      case "textSection":
        return (
          <section key={section._key} className={`${CONTAINER} py-20`}>
            <SectionHead heading={section.heading} number={props.number} />
            <div className="mt-8 max-w-3xl">
              <RichText value={section.body} />
            </div>
          </section>
        );
      default:
        return null;
    }
  });
}

type Of<T extends Section["_type"]> = Extract<Section, { _type: T }>;
type SectionProps<T extends Section["_type"]> = { section: Of<T>; lang: Language; settings: Settings; number?: number };

function Hero({ section, lang, settings, isFirst }: SectionProps<"heroSection"> & { isFirst: boolean }) {
  const t = UI[lang];
  const image = section.image?.asset ? section.image : null;
  const Title = isFirst ? "h1" : "h2";
  return (
    <section data-hero="dark" className="relative overflow-hidden bg-ink">
      {image && (
        <div aria-hidden data-hero-media="parallax" className="absolute inset-0 overflow-hidden">
          {/* Crop from the design: the image is enlarged and anchored top-left. */}
          <Image
            src={urlFor(image).width(2576).auto("format").url()}
            alt=""
            width={2576}
            height={1717}
            priority={isFirst}
            sizes="125vw"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip ?? undefined}
            className="absolute left-0 top-[-16.37%] h-[136.43%] w-[125%] max-w-none object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,15,0.5)_0%,rgba(13,13,15,0)_22%,rgba(13,13,15,0)_75%,rgba(13,13,15,0.45)_100%),linear-gradient(90deg,rgba(13,13,15,0.82)_0%,rgba(13,13,15,0.45)_45%,rgba(13,13,15,0)_75%)]" />
        </div>
      )}
      <div className="relative mx-auto flex min-h-[720px] w-full max-w-[1280px] items-center pt-20 md:h-[900px]">
        <div className="flex w-full max-w-[700px] flex-col gap-8 px-6 py-16 md:pl-12 md:pr-10">
          {section.eyebrow && (
            <p data-hero-item className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.06em] text-white/75">
              <span aria-hidden className="h-px w-14 bg-white/40" />
              <Image src="/brand/dot-live.svg" alt="" width={8} height={8} unoptimized />
              {section.eyebrow}
            </p>
          )}
          <Title data-hero-item className="text-[clamp(52px,6.67vw,96px)] font-bold leading-[0.94] tracking-[-0.045em] text-white">
            {section.heading?.text}
            {section.heading?.emphasis && (
              <>
                <br />
                <em className="display-emphasis text-[1.104em] tracking-[-0.015em] text-lilac-strong">{section.heading.emphasis}</em>
              </>
            )}
          </Title>
          {section.intro && <p data-hero-item className="max-w-[500px] text-[clamp(17px,1.4vw,20px)] leading-[1.45] text-white/70">{section.intro}</p>}
          <div data-hero-item className="flex flex-wrap gap-3">
            <Button link={section.primaryCta} trialUrl={settings?.trialUrl} />
            <Button link={section.secondaryCta} trialUrl={settings?.trialUrl} variant="ghostLight" />
          </div>
          <TrustRow section={section} settings={settings} lang={lang} t={t} />
        </div>
      </div>
    </section>
  );
}

function TrustRow({ section, settings, t }: { section: Of<"heroSection">; settings: Settings; lang: Language; t: (typeof UI)[Language] }) {
  const items = section.trustItems ?? [];
  const logos = items.flatMap((item) => (item._type === "trustLogo" && item.logo?.url ? [item] : []));
  const facts = [
    ...items.flatMap((item) => (item._type === "keyFact" ? [{ key: item._key, value: item.value, label: item.label }] : [])),
    ...(section.showRating && settings?.rating?.value
      ? [{ key: "rating", value: `★ ${settings.rating.value.toFixed(1)}`, label: `Google ${t.reviews}` }]
      : []),
  ];
  if (!logos.length && !facts.length) return null;
  return (
    <div data-hero-item className="flex flex-wrap items-center gap-x-8 gap-y-6 pt-6">
      {logos.length > 0 && (
        <ul className="flex flex-wrap items-center gap-8">
          {logos.map((item) => (
            <li key={item._key}>
              {/* SVG logos are served as-is, so a plain <img> keeps them crisp at any size. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.logo!.url!}
                alt={item.name ?? ""}
                width={item.logo!.width ?? undefined}
                height={item.logo!.height ?? undefined}
                className="h-9 w-auto opacity-90"
              />
            </li>
          ))}
        </ul>
      )}
      {facts.length > 0 && (
        <dl className="flex flex-wrap gap-6">
          {facts.map((item) => (
            <div key={item.key} className="flex flex-col-reverse gap-1 pr-6">
              <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-white/50">{item.label}</dt>
              <dd className="text-[15px] font-semibold text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Marquee({ section }: { section: Of<"marqueeSection"> }) {
  const items = section.items ?? [];
  if (!items.length) return null;
  // Decorative: the same disciplines are listed (and linked) further down the page.
  const run = items.flatMap((item) => [
    <span key={item._id} className="text-[30px] uppercase tracking-[-0.02em]">{item.title}</span>,
    <span key={`${item._id}-star`} className="text-[22px]">✦</span>,
  ]);
  return (
    <div aria-hidden className="overflow-hidden bg-lavender py-[18px] font-bold leading-[36px] text-white">
      <div className="animate-marquee flex w-max gap-7 whitespace-nowrap">
        <div className="flex items-center gap-7">{run}</div>
        <div className="flex items-center gap-7">{run}</div>
      </div>
    </div>
  );
}

function Steps({ section, settings, number }: SectionProps<"stepsSection">) {
  return (
    <section className={`${INSET} bg-sand`}>
      <div className={`${CONTAINER} flex flex-col gap-[72px] py-20 md:py-28`}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead heading={section.heading} number={number} className="max-w-[640px]" />
          <div data-reveal className="flex max-w-[400px] flex-col items-start gap-6">
            {section.intro && <p className="text-[19px] leading-[1.5] text-ink/72">{section.intro}</p>}
            <Button link={section.cta} trialUrl={settings?.trialUrl} variant="primaryOnSand" />
          </div>
        </div>
        <ol data-stagger className="grid gap-4 md:grid-cols-3">
          {section.steps?.map((step, i) => (
            <li key={step._key} className="flex min-h-[263px] flex-col gap-3.5 rounded-[28px] border border-ink/7 bg-white px-7 pb-8 pt-7">
              <span aria-hidden className="display-emphasis text-[72px] leading-none text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[24px] font-semibold tracking-[-0.02em]">{step.title}</h3>
              {step.description && <p className="text-[16px] leading-[1.5] text-ink/70">{step.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Disciplines({ section, lang, settings, number }: SectionProps<"disciplinesSection">) {
  const t = UI[lang];
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} flex flex-col gap-14 py-20 md:py-28`}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead heading={section.heading} number={number} className="max-w-[700px] [&_h2]:leading-[1.08]" />
          <Button link={section.cta} trialUrl={settings?.trialUrl} />
        </div>
        {section.intro && <p className="max-w-2xl text-[17px] leading-[1.5] text-ink/70">{section.intro}</p>}
        <ul data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((d, i) =>
            d ? (
              <li key={d._id} className="group/card relative flex h-[500px] flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-6">
                <div aria-hidden className="absolute inset-0">
                  <SanityImage image={d.image} width={764} height={1000} sizes="(min-width: 1024px) 382px, (min-width: 640px) 50vw, 100vw" className="size-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-30% to-ink/92" />
                </div>
                <div className="relative flex items-center justify-between">
                  <span className="rounded-full bg-ink/45 px-3 py-[7px] font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-white backdrop-blur-sm">
                    [ {String(i + 1).padStart(2, "0")} ]
                  </span>
                  {d.audienceLabel && (
                    <span className="rounded-full bg-white px-3 py-[7px] font-mono text-[11px] font-medium uppercase tracking-[0.03em] text-ink">
                      {d.audienceLabel}
                    </span>
                  )}
                </div>
                <div className="relative flex flex-col items-start gap-3.5">
                  <h3 className="max-w-[330px] text-[clamp(28px,8vw,38px)] font-bold uppercase leading-[0.95] tracking-[-0.035em] text-white [overflow-wrap:anywhere]">{d.title}</h3>
                  {(d.tagline ?? d.summary) && <p className="max-w-[320px] text-[15px] leading-[1.45] text-white/78">{d.tagline ?? d.summary}</p>}
                  <Button href={pathFor("discipline", d.language, d.slug)} label={t.viewClass} emoji={d.emoji} size="sm" stretched />
                </div>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </section>
  );
}

// Real reviews are often longer than the design's sample quotes, so the type steps down with
// length instead of letting a card grow out of proportion.
const quoteSize = (quote: string | null | undefined) => {
  const length = quote?.length ?? 0;
  if (length <= 140) return "text-[32px] leading-[1.12]";
  if (length <= 300) return "text-[26px] leading-[1.15]";
  return "text-[21px] leading-[1.25]";
};

function Testimonials({ section, lang, settings, number }: SectionProps<"testimonialsSection">) {
  const t = UI[lang];
  const rating = section.showRating ? settings?.rating : null;
  const items = section.items?.filter(Boolean) ?? [];
  if (!items.length && !rating?.value) return null;
  const tones = ["bg-sand", "bg-lilac"];
  const card = "flex min-h-[440px] w-[85%] shrink-0 snap-start flex-col justify-between gap-8 rounded-[32px] p-9";
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} flex flex-col gap-14 py-20 md:py-28`}>
        <Carousel prevLabel={t.previous} nextLabel={t.next} header={<SectionHead heading={section.heading} number={number} stacked className="max-w-[640px]" />}>
          {rating?.value && (
            <li className={`${card} bg-lavender text-white sm:w-[330px]`}>
              <p className="eyebrow text-white/70">{t.googleScore}</p>
              <div className="flex flex-col gap-2">
                <p className="font-serif text-[160px] leading-[0.9] tracking-[-0.03em]">{rating.value.toFixed(1)}</p>
                <p aria-label={`${rating.value} / 5`} className="text-[22px] tracking-[0.1em]">
                  {"★".repeat(Math.round(rating.value))}
                </p>
                {rating.count ? (
                  <p className="text-[15px] text-white/75">
                    {t.basedOn} {rating.count} {t.reviews}
                  </p>
                ) : null}
              </div>
              {settings?.reviewsUrl ? (
                <a href={settings.reviewsUrl} className="text-[15px] font-semibold hover:text-sun" rel="noopener">
                  {t.readReviews} →
                </a>
              ) : (
                <span />
              )}
            </li>
          )}
          {items.map((item, i) =>
            item ? (
              <li key={item._id} className={`${card} sm:w-[411px] ${tones[i % tones.length]}`}>
                <figure className="flex h-full flex-col justify-between gap-8">
                  <blockquote lang={item.quoteLanguage ?? undefined} className={`font-serif tracking-[-0.015em] ${quoteSize(item.quote)}`}>
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="flex items-center gap-3.5">
                    {item.photo?.asset ? (
                      <SanityImage image={item.photo} width={88} height={88} sizes="44px" className="size-11 rounded-full object-cover" />
                    ) : (
                      <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-white/70 text-[16px] font-semibold">
                        {item.authorName?.charAt(0)}
                      </span>
                    )}
                    <span className="flex flex-col gap-1">
                      <span className="text-[16px] font-semibold">{item.authorName}</span>
                      {item.memberSince && (
                        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.03em] text-ink/55">
                          {[item.discipline && DISCIPLINE_LABELS[item.discipline], `${t.memberSince} ${item.memberSince}`].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ) : null,
          )}
        </Carousel>
      </div>
    </section>
  );
}

const DISCIPLINE_LABELS: Record<string, string> = {
  crossfit: "CrossFit",
  "advanced-crossfit": "Advanced CrossFit",
  hyrox: "Hyrox",
  weightlifting: "Gewichtheffen",
  strength: "Kracht",
  "open-gym": "Open Gym",
  "personal-training": "Personal training",
  pregnancy: "Zwangerschap",
  postpartum: "Postpartum",
};

function Pricing({ section, lang, settings, number }: SectionProps<"pricingSection">) {
  return (
    <section className={`${INSET} bg-sand`}>
      <div className={`${CONTAINER} flex flex-col gap-14 py-20 md:py-28`}>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead heading={section.heading} number={number} stacked className="max-w-[640px]" />
          {section.intro && <p data-reveal className="max-w-[380px] text-[17px] leading-[1.5] text-ink/70">{section.intro}</p>}
        </div>
        <ul data-stagger className="grid items-start gap-4 lg:grid-cols-3">
          {section.items?.map((m) => (m ? <PlanCard key={m._id} membership={m} lang={lang} /> : null))}
        </ul>
        {(section.footnote || section.cta) && (
          <div className="flex flex-col justify-between gap-6 pt-6 md:flex-row md:items-center">
            {section.footnote && <p className="text-[18px] font-semibold tracking-[-0.01em]">{section.footnote}</p>}
            <div className="flex flex-wrap items-center gap-7">
              {section.secondaryCta && (
                <Button link={section.secondaryCta} trialUrl={settings?.trialUrl} variant="ghostDark" arrow={false} className="!border-0 !px-0 !font-medium !text-ink/70" />
              )}
              <Button link={section.cta} trialUrl={settings?.trialUrl} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const DAY_NAMES: Record<Language, string[]> = {
  nl: ["ma", "di", "wo", "do", "vr", "za", "zo"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ["Monday", ..., "Friday"] -> "ma–vr"; non-consecutive days are listed.
function dayRange(days: string[] | null | undefined, lang: Language) {
  const idx = (days ?? []).map((d) => WEEK.indexOf(d)).filter((i) => i >= 0).sort((a, b) => a - b);
  if (!idx.length) return "";
  const consecutive = idx.every((d, i) => i === 0 || d === idx[i - 1] + 1);
  const names = DAY_NAMES[lang];
  return consecutive && idx.length > 2 ? `${names[idx[0]]}–${names[idx.at(-1)!]}` : idx.map((i) => names[i]).join(", ");
}

function InfoCard({ label, children, link }: { label: string; children: React.ReactNode; link?: { href: string; label: string } | null }) {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] border border-ink/7 bg-white p-5">
      <p className="eyebrow text-ink/55">{label}</p>
      <div className="text-[16px] leading-[1.5] text-ink/90">{children}</div>
      {link && (
        <a href={link.href} className="text-[14px] font-semibold text-primary" rel="noopener">
          {link.label} →
        </a>
      )}
    </div>
  );
}

function GoodToKnow({ section, lang, settings, number }: SectionProps<"faqSection">) {
  const t = UI[lang];
  const instagram = settings?.socials?.find((url) => url.includes("instagram"));
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} flex flex-col gap-[72px] py-20 md:py-28 lg:flex-row`}>
        <div className="flex w-full flex-col gap-10 lg:w-[500px] lg:shrink-0">
          <SectionHead heading={section.heading} number={number} size="md" />
          {section.showContactInfo && settings && (
            <div data-stagger className="grid gap-3 sm:grid-cols-2">
              {settings.address?.street && (
                <InfoCard label={t.address} link={settings.mapsUrl ? { href: settings.mapsUrl, label: t.routePlan } : null}>
                  <address className="not-italic">
                    {settings.address.street}
                    <br />
                    {settings.address.postalCode} {settings.address.city}
                  </address>
                </InfoCard>
              )}
              {settings.openingHours?.length ? (
                <InfoCard label={t.openingHours}>
                  {settings.openingHours.map((h, i) => (
                    <p key={i}>
                      {dayRange(h.days, lang)} {h.opens}–{h.closes}
                    </p>
                  ))}
                </InfoCard>
              ) : null}
              {settings.email && (
                <InfoCard label={t.contact} link={instagram ? { href: instagram, label: "Instagram" } : null}>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </InfoCard>
              )}
              {settings.facilities && <InfoCard label={t.facilities}>{settings.facilities}</InfoCard>}
            </div>
          )}
          {section.showContactInfo && section.image?.asset && (
            <div data-parallax className="h-[260px] overflow-hidden rounded-[24px]">
              <SanityImage image={section.image} width={1000} height={520} sizes="(min-width: 1024px) 500px, 100vw" className="size-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Faqs faqs={section.items} numbered />
          {section.cta && (
            <div className="flex flex-wrap items-center gap-4 pt-8">
              <p className="text-[16px] font-medium text-ink/70">{t.moreQuestions}</p>
              <Button link={section.cta} trialUrl={settings?.trialUrl} variant="ghostDark" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ section, settings }: SectionProps<"ctaSection">) {
  return <CtaPanel heading={section.heading} intro={section.intro} link={section.cta} note={section.note} trialUrl={settings?.trialUrl} />;
}

type CtaPanelProps = {
  heading: { text?: string | null; emphasis?: string | null } | null | undefined;
  intro?: string | null;
  link?: LinkValue;
  note?: string | null;
  trialUrl?: string | null;
};

// The purple closing panel, shared by the homepage and the lesson pages.
export function CtaPanel({ heading, intro, link, note, trialUrl }: CtaPanelProps) {
  return (
    <section className={`${INSET} mt-4 bg-lavender text-white`}>
      <div className={`${CONTAINER} flex flex-col justify-between gap-10 py-20 md:py-[120px] lg:flex-row lg:items-end`}>
        <h2 data-reveal className="max-w-[820px] text-[clamp(56px,7.8vw,112px)] font-bold leading-[0.9] tracking-[-0.05em]">
          {heading?.text}
          {heading?.emphasis && (
            <>
              <br />
              <em className="display-emphasis text-[1.107em] tracking-[-0.02em]">{heading.emphasis}</em>
            </>
          )}
        </h2>
        <div data-reveal className="flex max-w-[330px] flex-col items-start gap-6">
          {intro && <p className="text-[18px] leading-[1.5]">{intro}</p>}
          <Button link={link} trialUrl={trialUrl} variant="sun" />
          {note && <p className="font-mono text-[11px] font-medium uppercase tracking-[0.06em]">{note}</p>}
        </div>
      </div>
    </section>
  );
}

// The live schedule lives in Sportbit; until it is embedded this links to it.
function Schedule({ section, lang, settings, number }: SectionProps<"scheduleSection">) {
  if (!settings?.scheduleUrl) return null;
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-6 py-10`}>
        <SectionHead heading={section.heading} number={number} size="md" />
        <a href={settings.scheduleUrl} className="text-[15px] font-semibold text-primary">
          {UI[lang].fullSchedule} →
        </a>
      </div>
    </section>
  );
}

function Coaches({ section, lang, number }: SectionProps<"coachesSection">) {
  const t = UI[lang];
  const items = section.items?.filter(Boolean) ?? [];
  if (!items.length) return null;
  return (
    <section id="coaches" className={`${INSET} scroll-mt-24 bg-sand`}>
      <div className={`${CONTAINER} flex flex-col gap-14 py-20 md:py-28`}>
        <Carousel prevLabel={t.previous} nextLabel={t.next} header={<SectionHead heading={section.heading} number={number} stacked className="max-w-[720px]" />}>
          {items.map((c) =>
            c ? (
              <li key={c._id} className="group relative flex h-[400px] w-[78%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-[22px] sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)]">
                <div aria-hidden className="absolute inset-0">
                  <SanityImage image={c.photo} width={600} height={800} sizes="(min-width: 1024px) 284px, (min-width: 640px) 50vw, 80vw" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-45% to-ink/88" />
                </div>
                {c.role && (
                  <span className="relative self-start rounded-full bg-white px-3 py-[7px] font-mono text-[10px] font-medium uppercase tracking-[0.03em] text-ink">
                    {c.role}
                  </span>
                )}
                <h3 className="relative max-w-[220px] text-[26px] font-bold leading-[1.05] tracking-[-0.025em] text-white">{c.name}</h3>
              </li>
            ) : null,
          )}
        </Carousel>
      </div>
    </section>
  );
}

function Intro({ section, lang, settings, isFirst, pageTitle }: SectionProps<"introSection"> & { isFirst: boolean; pageTitle?: string | null }) {
  const t = UI[lang];
  const Title = isFirst ? "h1" : "h2";
  return (
    <section className={`${WIDE} flex flex-col gap-12 pb-10 pt-12 md:pt-[88px]`}>
      <div className="flex flex-col gap-7">
        {pageTitle && (
          <nav data-hero-item aria-label={t.breadcrumb}>
            <ol className="flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.06em]">
              <li className="text-ink/45">
                <Link href={pathFor("homePage", lang)} className="hover:text-ink">{t.home}</Link>
              </li>
              <li aria-hidden className="text-ink/30">/</li>
              <li aria-current="page" className="text-ink/85">{pageTitle}</li>
            </ol>
          </nav>
        )}
        <Title data-hero-item className="max-w-[1100px] text-[clamp(52px,6.67vw,96px)] font-bold leading-[0.96] tracking-[-0.045em]">
          {section.heading?.text}
          {section.heading?.emphasis && (
            <>
              <br />
              <em className="display-emphasis text-[1.0625em] tracking-[-0.01em] text-primary">{section.heading.emphasis}</em>
            </>
          )}
        </Title>
      </div>
      <div data-hero-item className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        {section.intro && <p className="max-w-[520px] text-[20px] leading-[1.5] text-ink/72">{section.intro}</p>}
        <div className="flex flex-wrap gap-3">
          <Button link={section.primaryCta} trialUrl={settings?.trialUrl} />
          <Button link={section.secondaryCta} trialUrl={settings?.trialUrl} variant="ghostDark" />
        </div>
      </div>
      {section.image?.asset && (
        <div data-hero-media className="h-[clamp(260px,29vw,420px)] overflow-hidden rounded-[40px]">
          <SanityImage image={section.image} width={2368} height={840} priority={isFirst} sizes="(min-width: 1280px) 1184px, 100vw" className="size-full object-cover" />
        </div>
      )}
    </section>
  );
}

function Story({ section, number }: SectionProps<"storySection">) {
  const card = section.card;
  return (
    <section className={`${INSET} mt-[72px] bg-sand`}>
      <div className="mx-auto flex max-w-[1408px] flex-col justify-between gap-12 px-6 py-20 md:px-12 md:py-28 lg:flex-row lg:px-28">
        <div className="flex max-w-[560px] flex-col gap-7">
          <SectionHead heading={section.heading} number={number} size="md" stacked className="[&_h2]:leading-[1.04]" />
          {section.lead && <p data-reveal className="text-[19px] font-medium leading-[1.55]">{section.lead}</p>}
          {section.body && <p data-reveal className="text-[17px] leading-[1.6] text-ink/72">{section.body}</p>}
        </div>
        {card && (card.title || card.text) && (
          <aside data-reveal className="flex flex-col gap-6 rounded-[32px] bg-lilac p-10 lg:w-[500px] lg:shrink-0">
            {card.label && <p className="eyebrow text-ink/60">{card.label}</p>}
            {card.showLogo && <Image src="/brand/logo-footer.svg" alt="VI" width={104.4} height={96} unoptimized />}
            {card.title && <p className="display-emphasis text-[52px] leading-none tracking-[-0.015em]">{card.title}</p>}
            {card.subtitle && <p className="text-[20px] font-semibold tracking-[-0.01em]">{card.subtitle}</p>}
            {card.text && <p className="text-[16px] leading-[1.6] text-ink/75">{card.text}</p>}
          </aside>
        )}
      </div>
    </section>
  );
}

function Values({ section, number }: SectionProps<"valuesSection">) {
  return (
    <section className={`${WIDE} flex flex-col gap-14 pb-28 pt-[120px]`}>
      <div data-reveal className="flex flex-col gap-6">
        {section.heading?.eyebrow && (
          <p className="eyebrow text-ink/60">
            {number ? `[ ${String(number).padStart(2, "0")} ] ` : ""}
            {section.heading.eyebrow}
          </p>
        )}
        <h2 className="max-w-[1080px] text-[clamp(44px,5vw,72px)] font-bold leading-none tracking-[-0.04em]">
          {section.heading?.text}
          {section.heading?.emphasis && (
            <>
              <br />
              <em className="display-emphasis text-[1.055em] tracking-[-0.01em] text-primary">{section.heading.emphasis}</em>
            </>
          )}
        </h2>
      </div>
      <ol data-stagger className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {section.values?.map((value, i) => (
          <li key={value._key} className="flex flex-col gap-3.5 rounded-[28px] border border-ink/7 bg-white px-7 pb-8 pt-7">
            <span aria-hidden className="display-emphasis text-[64px] leading-none text-primary">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]">{value.title}</h3>
            {value.description && <p className="text-[15px] leading-[1.55] text-ink/70">{value.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Statement({ section }: { section: Of<"statementSection"> }) {
  return (
    <section data-reveal className={`${WIDE} flex flex-col gap-8 pb-[104px] pt-[120px]`}>
      <p className="max-w-[1000px] font-serif text-[clamp(32px,3.35vw,48px)] leading-[1.12] tracking-[-0.015em]">{section.text}</p>
      {section.closing && <p className="text-[clamp(48px,5vw,72px)] font-bold leading-none tracking-[-0.045em]">{section.closing}</p>}
    </section>
  );
}

function News({ section, lang, number }: SectionProps<"newsSection">) {
  const items = section.items?.slice(0, section.limit ?? 3) ?? [];
  if (!items.length) return null;
  return (
    <section className="bg-white">
      <div className={`${CONTAINER} flex flex-col gap-14 py-20 md:py-28`}>
        <SectionHead heading={section.heading} number={number} />
        <ul data-stagger className="grid gap-4 md:grid-cols-3">
          {items.map((post) => (
            <li key={post._id} className="relative flex flex-col gap-3 rounded-[28px] border border-ink/7 bg-white p-7">
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="eyebrow text-ink/55">
                  {new Date(post.publishedAt).toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              )}
              <h3 className="text-[24px] font-semibold tracking-[-0.02em]">
                <Link href={pathFor("post", post.language, post.slug)} className="after:absolute after:inset-0">
                  {post.title}
                </Link>
              </h3>
              {post.summary && <p className="text-[16px] leading-[1.5] text-ink/70">{post.summary}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
