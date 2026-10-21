import Image from "next/image";
import Link from "next/link";
import type { NAVIGATION_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { pathFor, UI, type Language } from "@/sanity/i18n";
import { Button } from "./Button";
import { CtaLink } from "./CtaLink";
import { MobileMenu } from "./MobileMenu";

type Props = { lang: Language; navigation: NAVIGATION_QUERY_RESULT; settings: SETTINGS_QUERY_RESULT };

export function TopBar({ lang, navigation, settings }: Props) {
  if (!navigation?.announcement) return null;
  return (
    <p className="flex items-center justify-center gap-2.5 bg-sun px-4 py-2.5 text-center font-mono text-[10px] font-medium tracking-[0.03em] sm:gap-4 sm:px-6 sm:py-[11px] sm:text-[12px]">
      <span className="uppercase text-ink/90 sm:tracking-[0.06em]">{navigation.announcement}</span>
      {settings?.trialUrl && (
        <a href={settings.trialUrl} className="whitespace-nowrap text-ink underline-offset-2 hover:underline sm:tracking-[0.04em]">
          {UI[lang].bookNow} →
        </a>
      )}
    </p>
  );
}

// Overlays the hero (white) or sits on paper (ink), see .site-header in globals.css.
export function SiteHeader({ lang, navigation, settings }: Props) {
  const t = UI[lang];
  const trialUrl = settings?.trialUrl;
  return (
    <header className="site-header absolute inset-x-0 z-20 flex h-14 items-center justify-between pr-4 md:h-20 md:bg-white/10 lg:pr-20">
      <Link
        href={pathFor("homePage", lang)}
        aria-label={`${settings?.siteName ?? "VI Utrecht"}, ${t.home}`}
        className="flex size-14 shrink-0 items-center justify-center bg-lavender md:size-20"
      >
        <Image src="/brand/logo-header.svg" alt="" width={47.85} height={44} priority unoptimized className="h-8 w-[34.8px] md:h-11 md:w-[47.85px]" />
      </Link>
      {navigation?.header?.length || navigation?.classesMenu?.label ? (
        <nav aria-label={t.mainMenu} className="hidden rounded-full px-7 py-3 backdrop-blur-md lg:block">
          <ul className="flex gap-9 text-[15px] font-medium">
            {navigation.classesMenu?.label && <ClassesMenu menu={navigation.classesMenu} />}
            {(navigation.header ?? []).map((link, i) => (
              <li key={i}>
                <CtaLink link={link} trialUrl={trialUrl} className="hover:opacity-80" />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <div className="flex items-center gap-3.5 md:gap-5">
        <LanguageSwitch lang={lang} className="text-[12px] md:text-[13px]" />
        {settings?.loginUrl && (
          <a href={settings.loginUrl} className="hidden text-[15px] font-medium opacity-85 hover:opacity-100 md:block">
            {t.login}
          </a>
        )}
        <span className="hidden md:inline-flex">
          <Button link={navigation?.headerCta} trialUrl={trialUrl} />
        </span>
        <MobileMenu label={t.mainMenu} openLabel={t.openMenu} closeLabel={t.closeMenu}>
          <MobileMenuPanel lang={lang} navigation={navigation} settings={settings} />
        </MobileMenu>
      </div>
    </header>
  );
}

function LanguageSwitch({ lang, className = "" }: { lang: Language; className?: string }) {
  return (
    <p className={`font-mono font-medium tracking-[0.03em] ${className}`}>
      {lang === "nl" ? (
        <>
          <span>NL</span> · <Link href="/en" hrefLang="en" className="opacity-70 hover:opacity-100">EN</Link>
        </>
      ) : (
        <>
          <Link href="/" hrefLang="nl" className="opacity-70 hover:opacity-100">NL</Link> · <span>EN</span>
        </>
      )}
    </p>
  );
}

// Contents of the phone menu: the few main pages as big links, then every lesson, and the trial
// CTA at the bottom.
function MobileMenuPanel({ lang, navigation, settings }: Props) {
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
      <div className="mt-auto flex flex-col gap-5">
        <Button link={navigation?.headerCta} trialUrl={trialUrl} full />
        <div className="flex items-center justify-between">
          <LanguageSwitch lang={lang} className="text-[13px]" />
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

type ClassesMenuValue = NonNullable<NonNullable<NAVIGATION_QUERY_RESULT>["classesMenu"]>;

// Opens on hover and on keyboard focus (focus-within), so it needs no client JavaScript.
// The overview link keeps the label itself clickable and crawlable.
function ClassesMenu({ menu }: { menu: ClassesMenuValue }) {
  const overview = menu.overview ? pathFor(menu.overview._type, menu.overview.language, menu.overview.slug) : null;
  return (
    <li className="group relative">
      {overview ? (
        <Link href={overview} className="flex items-center gap-1 hover:opacity-80">
          {menu.label} <span aria-hidden className="text-[11px]">▾</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1">{menu.label} ▾</span>
      )}
      {menu.items?.length ? (
        <div className="invisible absolute -left-7 top-full pt-5 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
          <ul className="flex w-[280px] flex-col gap-1.5 rounded-[24px] bg-white p-3 text-ink shadow-[0_20px_60px_-20px_rgba(13,13,15,0.35)]">
            {menu.items.map((item) => (
              <li key={item._id}>
                <Link
                  href={pathFor(item._type, item.language, item.slug)}
                  className="block rounded-2xl bg-paper px-4 py-3 text-[15px] font-medium transition-colors hover:bg-lilac focus-visible:bg-lilac"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}
