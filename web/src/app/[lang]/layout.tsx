import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader, TopBar } from "@/components/SiteHeader";
import { getNavigation, getSettings } from "@/sanity/fetch";
import { HREFLANG, INDEXABLE, isLanguage, LANGUAGES, SITE_URL } from "@/sanity/i18n";
import { organizationJsonLd } from "@/sanity/jsonld";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: "500" });

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const settings = isLanguage(lang) ? await getSettings(lang) : null;
  const siteName = settings?.siteName ?? "VI Utrecht";
  return {
    metadataBase: new URL(SITE_URL),
    title: { template: `%s | ${siteName}`, default: siteName },
    openGraph: { siteName },
    // Pages only override this when they set their own noindex, so it covers the whole site.
    robots: INDEXABLE ? undefined : { index: false, follow: false },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const [settings, navigation] = await Promise.all([getSettings(lang), getNavigation(lang)]);
  const chrome = { lang, navigation, settings };

  return (
    <html lang={HREFLANG[lang]} className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd(settings, lang)} />
        <TopBar {...chrome} />
        <div className="relative flex flex-1 flex-col">
          <SiteHeader {...chrome} />
          <main className="flex-1">{children}</main>
        </div>
        <SiteFooter {...chrome} />
      </body>
    </html>
  );
}
