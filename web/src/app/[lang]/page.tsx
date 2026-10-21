import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { faqJsonLd, webPageJsonLd } from "@/sanity/jsonld";
import { Sections } from "@/components/Sections";
import { getHome, getSettings } from "@/sanity/fetch";
import { isLanguage, LANGUAGES, pathFor } from "@/sanity/i18n";
import { buildMetadata } from "@/sanity/metadata";
import { headingText } from "@/components/Heading";
import type { Section } from "@/components/Sections";

function heroTitle(sections: Section[] | null | undefined) {
  const hero = sections?.find((s) => s._type === "heroSection");
  return hero ? headingText(hero.heading).replace(/[.!]$/, "") || null : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const [home, settings] = await Promise.all([getHome(lang), getSettings(lang)]);
  const siteName = settings?.siteName ?? "VI Utrecht";
  const hero = heroTitle(home?.sections);
  const metadata = buildMetadata({
    type: "homePage",
    lang,
    title: siteName,
    summary: settings?.description,
    image: settings?.defaultSeoImage,
    seo: home?.seo,
    // Both homepages always exist as fixed documents.
    translations: LANGUAGES.map((language) => ({ _type: "homePage", language, slug: null })),
  });
  // Without a meta title, lead with the hero H1 ("CrossFit & Hyrox gym in Utrecht") so the
  // homepage title carries the main keyword. The layout's title template doesn't reach
  // this page (same segment), so the brand is appended here.
  if (!home?.seo?.title && hero) metadata.title = { absolute: `${hero} | ${siteName}` };
  return metadata;
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const [home, settings] = await Promise.all([getHome(lang), getSettings(lang)]);
  if (!home) notFound();

  const faqs = home.sections?.flatMap((s) => (s._type === "faqSection" ? (s.items ?? []) : []));
  return (
    <>
      <JsonLd data={[webPageJsonLd({ title: settings?.siteName ?? "VI Utrecht", path: pathFor("homePage", lang), lang, description: settings?.description }), faqJsonLd(faqs)].filter(Boolean) as object[]} />
      <Sections sections={home.sections} lang={lang} settings={settings} />
      <Motion />
    </>
  );
}
