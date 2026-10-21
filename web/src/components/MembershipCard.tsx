import type { SETTINGS_QUERY_RESULT } from "../../sanity.types";
import { UI, type Language } from "@/sanity/i18n";
import { Button } from "./Button";

type Membership = NonNullable<SETTINGS_QUERY_RESULT>["memberships"][number];

const ACCESS_LABELS = { classes: "allClasses", openGym: "openGym", openPlatform: "openPlatform" } as const;

export function PlanCard({ membership: m, lang }: { membership: Membership; lang: Language }) {
  const t = UI[lang];
  const locale = lang === "nl" ? "nl-NL" : "en-GB";
  const eur = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n).replace(/\s/g, "");
  const interval = m.priceInterval === "year" ? t.perYear : m.priceInterval === "once" ? t.once : t.perMonth;
  const credits = m.credits?.unlimited ? null : m.credits?.amount;
  // Derived, never typed in: price per class follows from price and credits.
  const perClass = credits && m.price ? m.price / credits : null;
  const featured = m.featured === true;
  const shortName = m.name?.replace(/^VI\s+/i, "") ?? "";

  return (
    <li className={`flex flex-col gap-6 rounded-[28px] p-8 ${featured ? "bg-lilac" : "border border-ink/10 bg-white"}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{m.name}</h3>
        {m.badge && (
          <span className={`rounded-full px-3 py-[5px] font-mono text-[10px] font-medium uppercase tracking-[0.03em] text-ink/90 ${featured ? "bg-lavender" : "bg-sun"}`}>
            {m.badge}
          </span>
        )}
      </div>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[clamp(48px,13vw,64px)] font-bold leading-none tracking-[-0.05em]">{eur(m.price ?? 0)}</span>
        <span className="text-[16px] text-ink/60">/{interval.replace(/^per\s/, "")}</span>
      </p>
      {perClass && (
        <p className={`self-start rounded-full px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.03em] text-ink/90 ${featured ? "bg-lavender" : "bg-lilac"}`}>
          ≈ {eur(perClass)} {t.perClass}
        </p>
      )}
      {m.tagline && <p className="text-[15px] leading-[1.5] text-ink/72">{m.tagline}</p>}
      <div className="flex flex-col gap-3 border-t border-ink/14 pt-6">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-ink/90">
          {m.credits?.unlimited ? t.unlimited : `${credits} ${t.classesPerMonth}`}
        </p>
        <ul className="flex flex-col gap-3 text-[15px]">
          {m.access?.map((key) => (
            <li key={key} className="flex items-center gap-2.5">
              <span aria-hidden className={`font-semibold ${featured ? "text-primary" : "text-ink"}`}>✓</span>
              <span className="text-ink/85">{t[ACCESS_LABELS[key as keyof typeof ACCESS_LABELS] ?? "allClasses"]}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button href={m.signupUrl} label={`${t.choose} ${shortName}`} emoji={m.emoji} variant={featured ? "primary" : "ghostDark"} full />
    </li>
  );
}
