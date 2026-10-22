"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Language } from "@/sanity/i18n";

type Props = {
  lang: Language;
  // Path of every page -> path of the same page in the other language.
  counterparts: Record<string, string>;
  className?: string;
};

// NL · EN. The other language links to the same page when it has a translation, else to that
// language's homepage.
export function LanguageSwitch({ lang, counterparts, className = "" }: Props) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const other = counterparts[pathname] ?? (lang === "nl" ? "/en" : "/");
  return (
    <p className={`font-mono font-medium tracking-[0.03em] ${className}`}>
      {lang === "nl" ? (
        <>
          <span>NL</span> · <Link href={other} hrefLang="en" className="opacity-70 hover:opacity-100">EN</Link>
        </>
      ) : (
        <>
          <Link href={other} hrefLang="nl" className="opacity-70 hover:opacity-100">NL</Link> · <span>EN</span>
        </>
      )}
    </p>
  );
}
