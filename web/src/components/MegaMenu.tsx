import Link from "next/link";
import type { NAVIGATION_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { pathFor, UI, type Language } from "@/sanity/i18n";
import { emojiFor, hrefFor } from "./CtaLink";
import { MegaMenuCloser } from "./MegaMenuCloser";
import { SanityImage } from "./SanityImage";

export type ClassesMenuValue = NonNullable<NonNullable<NAVIGATION_QUERY_RESULT>["classesMenu"]>;
type QuickLink = NonNullable<ClassesMenuValue["quickLinks"]>[number];
type Settings = SETTINGS_QUERY_RESULT;

const eurFormat = (lang: Language, n: number) =>
  new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-GB", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n).replace(/\s/g, "");

// A quick link's second line: its own text, or for the pricing page the lowest monthly price,
// derived from the memberships so it can never go stale.
export function quickLinkDescription(item: QuickLink, settings: Settings, lang: Language) {
  if (item.description) return item.description;
  if (item.link?.internal?.pageType !== "pricing") return null;
  const prices = (settings?.memberships ?? [])
    .filter((m) => (m.membershipType ?? "subscription") === "subscription" && m.priceInterval === "month" && m.price)
    .map((m) => m.price!);
  return prices.length ? UI[lang].fromPerMonth.replace("{price}", eurFormat(lang, Math.min(...prices))) : null;
}

type Props = { menu: ClassesMenuValue; lang: Language; settings: Settings };

// Opens with CSS on hover and on keyboard focus (focus-visible, so a mouse click never pins it
// open); MegaMenuCloser closes it after a click. The
// panel is positioned against the header (this <li> is static), spanning its full width.
export function MegaMenu({ menu, lang, settings }: Props) {
  const t = UI[lang];
  const trialUrl = settings?.trialUrl;
  const overview = menu.overview ? pathFor(menu.overview._type, menu.overview.language, menu.overview.slug) : null;
  const quickLinks = (menu.quickLinks ?? []).filter((item) => hrefFor(item.link, trialUrl) && item.link?.label);
  const promoHref = hrefFor(menu.promo?.link, trialUrl);
  // The next course or event with a photo, else the newest current post with one.
  const featured = menu.nextEvent ?? menu.latestPost;
  const eventsHref = hrefFor(menu.eventsLink, trialUrl);
  const hasAside = (promoHref && menu.promo?.heading?.text) || featured || eventsHref;

  return (
    <li data-mega className="group/mega">
      <MegaMenuCloser />
      {/* The ::after bridges the gap down to the panel, so moving the mouse there keeps it open. */}
      {overview ? (
        <Link href={overview} className="relative flex items-center gap-1 transition-colors after:absolute after:-inset-x-4 after:top-full after:h-8 after:content-[''] hover:opacity-80 group-hover/mega:font-semibold group-hover/mega:text-primary group-hover/mega:opacity-100 group-has-focus-visible/mega:text-primary">
          {menu.label} <span aria-hidden className="text-[11px] transition-transform group-hover/mega:rotate-180 group-has-focus-visible/mega:rotate-180">▾</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1">{menu.label} ▾</span>
      )}
      {/* Page dim below the header while the menu is open. */}
      <div aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-full h-screen group-data-closed/mega:invisible! group-data-closed/mega:opacity-0! bg-ink/25 opacity-0 transition-[opacity,visibility] delay-150 duration-300 group-has-focus-visible/mega:visible group-has-focus-visible/mega:opacity-100 group-has-focus-visible/mega:delay-0 group-hover/mega:visible group-hover/mega:opacity-100 group-hover/mega:delay-0" />
      <div className="invisible absolute inset-x-4 top-full pt-2 opacity-0 group-data-closed/mega:invisible! group-data-closed/mega:opacity-0! group-data-closed/mega:delay-0! transition-[opacity,visibility,translate] delay-150 duration-300 motion-safe:-translate-y-1 group-has-focus-visible/mega:visible group-has-focus-visible/mega:translate-y-0 group-has-focus-visible/mega:opacity-100 group-has-focus-visible/mega:delay-0 group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:opacity-100 group-hover/mega:delay-0">
        {/* Never taller than the screen, so there is always page left to move the mouse to. */}
        <div className="mx-auto flex max-h-[calc(100dvh-11rem)] max-w-[1408px] gap-3 overflow-y-auto overscroll-contain rounded-[32px] bg-white p-3 text-ink shadow-[0_24px_48px_rgba(0,0,0,0.12)]">
          {/* Lessen */}
          <div className="flex min-w-0 flex-1 flex-col gap-1 px-2 pb-3 pt-5">
            <div className="flex items-center justify-between px-3 pb-3">
              <p className="eyebrow text-[11px] text-ink/55">{menu.label}</p>
              {overview && (
                <Link href={overview} className="text-[13px] font-semibold text-primary hover:text-coral">
                  {t.viewAllClasses} →
                </Link>
              )}
            </div>
            <ul className="grid grid-cols-2 gap-1">
              {menu.items?.map((item) => (
                <li key={item._id}>
                  <Link
                    href={pathFor(item._type, item.language, item.slug)}
                    className="group/item flex gap-3.5 rounded-[20px] p-3 transition-colors duration-200 hover:bg-lilac focus-visible:bg-lilac focus-visible:outline-none"
                  >
                    <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sand transition-colors group-hover/item:bg-white">
                      {item.image?.asset ? (
                        <SanityImage image={item.image} width={128} height={128} sizes="64px" className="size-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                      ) : (
                        // No photo yet: the lesson's emoji stands in.
                        <span aria-hidden className="text-[26px] leading-none motion-safe:group-hover/item:animate-wiggle">{item.emoji ?? "🏋️"}</span>
                      )}
                    </span>
                    <span className="flex min-w-0 flex-col items-start gap-1">
                      <span className="text-[16px] font-semibold leading-[normal] tracking-[-0.01em] transition-colors group-hover/item:text-primary">
                        {item.title}{" "}
                        {item.emoji && item.image?.asset && (
                          <span aria-hidden className="inline-block text-[13px] opacity-0 transition-opacity group-hover/item:opacity-100 motion-safe:group-hover/item:animate-wiggle">{item.emoji}</span>
                        )}
                      </span>
                      {item.tagline && <span className="line-clamp-2 text-[13px] leading-[1.4] text-ink/65">{item.tagline}</span>}
                      {item.audienceLabel && (
                        <span className="rounded-full bg-sand px-2.5 py-1 font-mono text-[9px] font-medium uppercase leading-[normal] tracking-[0.03em] text-ink/85 transition-colors group-hover/item:bg-white">
                          {item.audienceLabel}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Starten bij VI */}
          {quickLinks.length > 0 && (
            <div className="flex w-[330px] shrink-0 flex-col gap-0.5 rounded-[24px] bg-paper px-2 pb-3 pt-5">
              {menu.quickLinksTitle && <p className="eyebrow px-3 pb-3 text-[11px] text-ink/55">{menu.quickLinksTitle}</p>}
              <QuickLinks items={quickLinks} settings={settings} lang={lang} />
            </div>
          )}

          {/* Uitgelicht (wide screens only; the lessons need the room below xl) */}
          {hasAside && (
            <div className="hidden w-[380px] shrink-0 flex-col gap-3 px-2 pb-2 pt-5 xl:flex">
              <p className="eyebrow px-1 text-[11px] text-ink/55">{t.featured}</p>
              {promoHref && menu.promo?.heading?.text && (
                <MenuLink href={promoHref} className="group/promo flex flex-col gap-3.5 rounded-[24px] bg-lavender p-6 text-white transition-colors duration-300 hover:bg-coral hover:text-ink">
                  <span className="flex items-center justify-between">
                    <span className="flex gap-1.5">
                      {menu.promo.chips?.map((chip, i) => (
                        <span key={chip} className={`rounded-full px-2.5 py-1 font-mono text-[9px] font-medium uppercase leading-[normal] tracking-[0.03em] text-ink/85 ${i === 0 ? "bg-white" : "bg-sun"}`}>
                          {chip}
                        </span>
                      ))}
                    </span>
                    <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-white text-[15px]">
                      <span className="leading-none motion-safe:group-hover/promo:animate-wiggle">{emojiFor(menu.promo.link, promoHref)}</span>
                    </span>
                  </span>
                  <span className="text-[26px] font-bold leading-[1.05] tracking-[-0.03em]">
                    {menu.promo.heading.text}
                    {menu.promo.heading.emphasis && (
                      <>
                        <br />
                        <em className="display-emphasis text-[30px]">{menu.promo.heading.emphasis}</em>
                      </>
                    )}
                  </span>
                  {menu.promo.text && <span className="text-[14px] text-white/90 group-hover/promo:text-ink/80">{menu.promo.text}</span>}
                </MenuLink>
              )}
              {featured && (
                <Link
                  href={pathFor(featured._type, featured.language, featured.slug)}
                  className="group/event relative flex h-[200px] flex-col justify-between overflow-hidden rounded-[24px] bg-ink p-5 text-white"
                >
                  <span aria-hidden className="absolute inset-0">
                    <SanityImage image={featured.image} width={760} height={400} sizes="380px" className="size-full object-cover transition-transform duration-700 group-hover/event:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-b from-ink/15 from-20% to-ink/85" />
                  </span>
                  <span className="relative flex items-center justify-between">
                    <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[9px] font-medium uppercase leading-[normal] tracking-[0.03em] text-ink/85">
                      {featured._type === "program" ? t.event : t.news}
                    </span>
                    <span aria-hidden className="text-[20px] font-medium transition-transform group-hover/event:-translate-y-0.5 group-hover/event:translate-x-0.5">↗</span>
                  </span>
                  <span className="relative flex flex-col gap-1">
                    <span className="text-[22px] font-bold leading-[1.1] tracking-[-0.02em]">{featured.title}</span>
                    {featured.summary && <span className="line-clamp-1 text-[13px] text-white/85">{featured.summary}</span>}
                  </span>
                </Link>
              )}
              {eventsHref && menu.eventsLink?.label && (
                <MenuLink href={eventsHref} className="group/all flex items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-paper">
                  <span aria-hidden className="text-[18px] font-medium text-primary transition-transform group-hover/all:translate-x-1">→</span>
                  <span className="text-[15px] font-semibold tracking-[-0.01em]">{menu.eventsLink.label}</span>
                </MenuLink>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

// The "Starten bij VI" rows; also used in the phone menu.
export function QuickLinks({ items, settings, lang }: { items: QuickLink[]; settings: Settings; lang: Language }) {
  const trialUrl = settings?.trialUrl;
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const href = hrefFor(item.link, trialUrl);
        if (!href || !item.link?.label) return null;
        const description = quickLinkDescription(item, settings, lang);
        return (
          <li key={item._key}>
            <MenuLink href={href} className="group/quick flex items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-colors duration-200 hover:bg-white focus-visible:bg-white">
              <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-white text-[15px] transition-colors group-hover/quick:border-coral group-hover/quick:bg-coral">
                <span className="leading-none motion-safe:group-hover/quick:animate-wiggle">{emojiFor(item.link, href)}</span>
              </span>
              <span className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
                <span className="text-[15px] font-semibold tracking-[-0.01em]">{item.link.label}</span>
                {description && <span className="text-[13px] text-ink/60">{description}</span>}
              </span>
            </MenuLink>
          </li>
        );
      })}
    </ul>
  );
}

function MenuLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className} rel="noopener">
      {children}
    </a>
  );
}
