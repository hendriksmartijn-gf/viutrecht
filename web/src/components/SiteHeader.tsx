import Image from "next/image";
import Link from "next/link";
import type { NAVIGATION_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { pathFor, UI, type Language } from "@/sanity/i18n";
import { Button } from "./Button";
import { CtaLink } from "./CtaLink";
import { LanguageSwitch } from "./LanguageSwitch";
import { MegaMenu, QuickLinks } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { StickyHeader } from "./StickyHeader";

type Props = {
  lang: Language;
  navigation: NAVIGATION_QUERY_RESULT;
  settings: SETTINGS_QUERY_RESULT;
  // For the language switch: every page path -> the same page in the other language.
  counterparts?: Record<string, string>;
};

// The whole bar links to the trial week. Hover: it turns coral, the gift wiggles in and the
// arrow nudges forward.
export function TopBar({ lang, navigation, settings }: Props) {
  if (!navigation?.announcement) return null;
  const classes = "group flex items-center justify-center gap-2.5 bg-sun px-4 py-2.5 text-center font-mono text-[10px] font-medium tracking-[0.03em] sm:gap-4 sm:px-6 sm:py-[11px] sm:text-[12px]";
  const text = <span className="uppercase text-ink/90 sm:tracking-[0.06em]">{navigation.announcement}</span>;
  if (!settings?.trialUrl) return <p className={classes}>{text}</p>;
  return (
    <a href={settings.trialUrl} className={`${classes} transition-colors duration-300 hover:bg-coral focus-visible:bg-coral focus-visible:outline-none`}>
      <span aria-hidden className="hidden w-0 overflow-hidden text-[12px] leading-none opacity-0 transition-[width,opacity] duration-300 group-hover:w-4 group-hover:opacity-100 sm:inline-block">
        <span className="inline-block motion-safe:group-hover:animate-wiggle">🎁</span>
      </span>
      {text}
      <span className="flex items-center gap-1 whitespace-nowrap text-ink sm:tracking-[0.04em]">
        {UI[lang].bookNow}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </a>
  );
}

// Overlays the hero (white) or sits on paper (ink), pins to the top while scrolling and turns
// solid with the mega menu open; see .site-header in globals.css. From xl a three-column grid
// keeps the menu centred on the page; below that there is no room, so the menu sits between
// logo and actions.
export function SiteHeader({ lang, navigation, settings, counterparts = {} }: Props) {
  const t = UI[lang];
  const trialUrl = settings?.trialUrl;
  return (
    <StickyHeader className="site-header absolute inset-x-0 z-20 flex h-14 items-center justify-between pr-4 transition-[background-color,color,box-shadow] duration-300 md:h-20 md:bg-white/10 lg:pr-20 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:pr-0">
      <Link
        href={pathFor("homePage", lang)}
        aria-label={`${settings?.siteName ?? "VI Utrecht"}, ${t.home}`}
        className="flex size-14 shrink-0 items-center justify-center justify-self-start bg-lavender md:size-20"
      >
        <Image src="/brand/logo-header.svg" alt="" width={47.85} height={44} priority unoptimized className="h-8 w-[34.8px] md:h-11 md:w-[47.85px]" />
      </Link>
      {navigation?.header?.length || navigation?.classesMenu?.label ? (
        // No backdrop filter here: it would become the containing block of the mega menu panel.
        // From xl only: with six items the menu does not fit between logo and buttons below 1280px.
        <nav aria-label={t.mainMenu} className="hidden py-3 xl:block">
          <ul className="flex gap-6 text-[15px] font-medium 2xl:gap-8">
            {navigation.classesMenu?.label && <MegaMenu menu={navigation.classesMenu} lang={lang} settings={settings} />}
            {(navigation.header ?? []).map((link, i) => (
              <li key={i}>
                <CtaLink link={link} trialUrl={trialUrl} className="hover:opacity-80" />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <div className="flex items-center gap-3.5 justify-self-end md:gap-5 xl:pr-20">
        <LanguageSwitch lang={lang} counterparts={counterparts} className="text-[12px] md:text-[13px]" />
        {settings?.loginUrl && (
          <a href={settings.loginUrl} className="hidden text-[15px] font-medium opacity-85 hover:opacity-100 md:block">
            {t.login}
          </a>
        )}
        <span className="hidden md:inline-flex">
          <Button link={navigation?.headerCta} trialUrl={trialUrl} />
        </span>
        <MobileMenu label={t.mainMenu} openLabel={t.openMenu} closeLabel={t.closeMenu}>
          <MobileMenuPanel lang={lang} navigation={navigation} settings={settings} counterparts={counterparts} />
        </MobileMenu>
      </div>
    </StickyHeader>
  );
}

// Contents of the phone menu: the few main pages as big links, every lesson, the quick links from
// the mega menu, and the trial CTA at the bottom.
function MobileMenuPanel({ lang, navigation, settings, counterparts = {} }: Props) {
  const t = UI[lang];
  const trialUrl = settings?.trialUrl;
  const classes = navigation?.classesMenu;
  const overview = classes?.overview ? pathFor(classes.overview._type, classes.overview.language, classes.overview.slug) : null;
  return (
    <nav aria-label={t.mainMenu} className="flex min-h-full flex-col gap-8 px-5 pb-8 pt-[72px]">
      {navigation?.header?.length ? (
        <ul className="flex flex-col">
          {navigation.header.map((link, i) => (
            <li key={i} className="border-b border-ink/10">
              <CtaLink link={link} trialUrl={trialUrl} className="block py-3 text-[28px] font-bold tracking-[-0.03em] hover:text-primary" />
            </li>
          ))}
        </ul>
      ) : null}
      {classes?.items?.length ? (
        <div className="flex flex-col gap-3">
          <p className="eyebrow text-ink/55">
            {overview ? (
              <Link href={overview} className="hover:text-ink">
                {classes.label} →
              </Link>
            ) : (
              classes.label
            )}
          </p>
          <ul className="flex flex-col gap-1.5">
            {classes.items.map((item) => (
              <li key={item._id}>
                <Link
                  href={pathFor(item._type, item.language, item.slug)}
                  className="group flex items-center justify-between rounded-[20px] border border-ink/8 bg-white py-2.5 pl-5 pr-2.5 text-[18px] font-semibold tracking-[-0.01em] transition-colors hover:bg-sand"
                >
                  {item.title}
                  <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-lilac text-[15px] transition-colors group-hover:bg-coral">
                    <span className="leading-none motion-safe:group-hover:animate-wiggle">{item.emoji ?? "👉"}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {classes?.quickLinks?.length ? (
        <div className="flex flex-col gap-2 rounded-[24px] bg-sand px-2 pb-2 pt-4">
          {classes.quickLinksTitle && <p className="eyebrow px-3 text-ink/55">{classes.quickLinksTitle}</p>}
          <QuickLinks items={classes.quickLinks} settings={settings} lang={lang} />
        </div>
      ) : null}
      <div className="mt-auto flex flex-col gap-5">
        <Button link={navigation?.headerCta} trialUrl={trialUrl} full />
        <div className="flex items-center justify-between">
          <LanguageSwitch lang={lang} counterparts={counterparts} className="text-[13px]" />
          {settings?.loginUrl && (
            <a href={settings.loginUrl} className="text-[15px] font-medium text-ink/75 hover:text-ink">
              {t.login}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
