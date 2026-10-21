import Image from "next/image";
import Link from "next/link";
import type { NAVIGATION_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { pathFor, UI, type Language } from "@/sanity/i18n";
import { Button } from "./Button";
import { CtaLink } from "./CtaLink";

type Props = { lang: Language; navigation: NAVIGATION_QUERY_RESULT; settings: SETTINGS_QUERY_RESULT };

export function TopBar({ lang, navigation, settings }: Props) {
  if (!navigation?.announcement) return null;
  return (
    <p className="flex items-center justify-center gap-4 bg-sun px-6 py-[11px] text-center font-mono text-[12px] font-medium">
      <span className="uppercase tracking-[0.06em] text-ink/90">{navigation.announcement}</span>
      {settings?.trialUrl && (
        <a href={settings.trialUrl} className="hidden whitespace-nowrap tracking-[0.04em] text-ink sm:inline">
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
    <header className="site-header absolute inset-x-0 z-20 flex h-20 items-center justify-between bg-white/10 pr-4 lg:pr-20">
      <Link
        href={pathFor("homePage", lang)}
        aria-label={`${settings?.siteName ?? "VI Utrecht"}, ${t.home}`}
        className="flex size-20 shrink-0 items-center justify-center bg-lavender"
      >
        <Image src="/brand/logo-header.svg" alt="" width={47.85} height={44} priority unoptimized />
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
      <div className="flex items-center gap-5">
        <p className="hidden font-mono text-[13px] font-medium tracking-[0.04em] sm:block">
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
        {settings?.loginUrl && (
          <a href={settings.loginUrl} className="hidden text-[15px] font-medium opacity-85 hover:opacity-100 sm:block">
            {t.login}
          </a>
        )}
        <Button link={navigation?.headerCta} trialUrl={trialUrl} />
      </div>
    </header>
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
