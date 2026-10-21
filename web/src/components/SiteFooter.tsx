import Image from "next/image";
import { cacheLife } from "next/cache";
import type { NAVIGATION_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { UI, type Language } from "@/sanity/i18n";
import { CtaLink } from "./CtaLink";

type Props = { lang: Language; navigation: NAVIGATION_QUERY_RESULT; settings: SETTINGS_QUERY_RESULT };

export function SiteFooter({ lang, navigation, settings }: Props) {
  const t = UI[lang];
  const trialUrl = settings?.trialUrl;
  const instagram = settings?.socials?.find((url) => url.includes("instagram"));
  const linkClass = "text-[14px] text-ink/80 hover:text-ink md:text-[15px]";

  return (
    <footer className="mt-2 overflow-hidden rounded-t-[32px] bg-sand md:mt-4 md:rounded-t-[48px]">
      {/* Phones: brand block, then the link columns two by two. */}
      <div className="mx-auto flex max-w-[1280px] flex-wrap gap-x-4 gap-y-7 px-5 pb-6 pt-10 md:flex-nowrap md:gap-12 md:px-12 md:pb-16 md:pt-20">
        <div className="flex w-full flex-col gap-3.5 md:w-[360px] md:shrink-0 md:gap-6">
          <Image src="/brand/logo-footer.svg" alt={settings?.siteName ?? "VI Utrecht"} width={60.9} height={56} unoptimized className="h-10 w-[43.5px] md:h-14 md:w-[60.9px]" />
          {navigation?.footerText && <p className="max-w-[300px] text-[14px] leading-[1.5] text-ink/65 md:text-[15px] md:text-ink/60">{navigation.footerText}</p>}
          {navigation?.footerBadges?.length ? (
            <ul className="flex flex-wrap gap-2 md:gap-2.5">
              {navigation.footerBadges.map((badge) => (
                <li key={badge} className="rounded-full border border-ink/20 px-3 py-[7px] font-mono text-[9px] md:rounded-[2px] md:px-2.5 md:py-2 md:text-[10px] font-medium uppercase tracking-[0.03em] text-ink/85">
                  {badge}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {navigation?.footerColumns?.map((column) => (
          <nav key={column._key} aria-label={column.title ?? undefined} className="flex w-[calc(50%-8px)] flex-col gap-2.5 md:w-auto md:flex-1 md:gap-3.5">
            {column.title && <p className="eyebrow text-ink/55">{column.title}</p>}
            <ul className="flex flex-col gap-2.5 md:gap-3.5">
              {column.links?.map((link, i) => (
                <li key={i}>
                  <CtaLink link={link} trialUrl={trialUrl} className={linkClass} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="flex w-[calc(50%-8px)] flex-col gap-2.5 md:w-auto md:flex-1 md:gap-3.5">
          <p className="eyebrow text-ink/55">{t.contact}</p>
          <address className="flex flex-col gap-2.5 not-italic md:gap-3.5">
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className={linkClass}>
                {settings.email}
              </a>
            )}
            {settings?.address?.street && <span className={linkClass}>{settings.address.street}</span>}
            {settings?.address?.postalCode && (
              <span className={linkClass}>
                {settings.address.postalCode} {settings.address.city}
              </span>
            )}
            {instagram && (
              <a href={instagram} className={linkClass} rel="noopener">
                Instagram
              </a>
            )}
          </address>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-1.5 px-5 pb-6 pt-4 font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-ink/40 sm:flex-row sm:gap-3 md:border-x md:border-t md:border-ink/12 md:px-12 md:py-5 md:text-[11px] md:tracking-[0.06em]">
        <p>
          © <CurrentYear /> {settings?.siteName ?? "VI Utrecht"}
        </p>
        {navigation?.legal?.length ? (
          <ul className="flex gap-2">
            {navigation.legal.map((link, i) => (
              <li key={i} className="[&+li]:before:mr-2 [&+li]:before:content-['·']">
                <CtaLink link={link} trialUrl={trialUrl} className="hover:text-ink/70" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {/* Phones: wraps over two lines, left-aligned; from md: one line across the width. */}
      {navigation?.slogan?.text && (
        <p aria-hidden data-slogan className="px-5 pb-6 text-[44px] font-bold leading-[0.95] tracking-[-0.04em] text-ink/7 md:flex md:h-[clamp(48px,9vw,130px)] md:justify-center md:overflow-hidden md:whitespace-nowrap md:px-0 md:pb-0 md:text-[clamp(40px,8.2vw,118px)] md:leading-normal md:tracking-[-0.076em]">
          {navigation.slogan.text}
          {navigation.slogan.emphasis && <em className="display-emphasis ml-[0.25em] text-[1.085em]">{navigation.slogan.emphasis}</em>}
        </p>
      )}
    </footer>
  );
}

// Cached so the footer stays prerenderable (Cache Components forbids bare `new Date()`).
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
