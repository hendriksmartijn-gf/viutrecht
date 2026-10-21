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
  const linkClass = "text-[15px] text-ink/80 hover:text-ink";

  return (
    <footer className="mt-4 overflow-hidden rounded-t-[48px] bg-sand">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 pb-16 pt-20 md:flex-row md:px-12">
        <div className="flex w-full flex-col gap-6 md:w-[360px] md:shrink-0">
          <Image src="/brand/logo-footer.svg" alt={settings?.siteName ?? "VI Utrecht"} width={60.9} height={56} unoptimized />
          {navigation?.footerText && <p className="max-w-[300px] text-[15px] leading-[1.5] text-ink/60">{navigation.footerText}</p>}
          {navigation?.footerBadges?.length ? (
            <ul className="flex flex-wrap gap-2.5">
              {navigation.footerBadges.map((badge) => (
                <li key={badge} className="rounded-[2px] border border-ink/20 px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.03em] text-ink/85">
                  {badge}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {navigation?.footerColumns?.map((column) => (
          <nav key={column._key} aria-label={column.title ?? undefined} className="flex flex-1 flex-col gap-3.5">
            {column.title && <p className="eyebrow text-ink/55">{column.title}</p>}
            <ul className="flex flex-col gap-3.5">
              {column.links?.map((link, i) => (
                <li key={i}>
                  <CtaLink link={link} trialUrl={trialUrl} className={linkClass} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="flex flex-1 flex-col gap-3.5">
          <p className="eyebrow text-ink/55">{t.contact}</p>
          <address className="flex flex-col gap-3.5 not-italic">
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
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-3 border-x border-t border-ink/12 px-6 py-5 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-ink/40 sm:flex-row md:px-12">
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
      {navigation?.slogan?.text && (
        <p aria-hidden data-slogan className="flex h-[clamp(48px,9vw,130px)] justify-center overflow-hidden whitespace-nowrap text-[clamp(40px,8.2vw,118px)] font-bold tracking-[-0.076em] text-ink/7">
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
