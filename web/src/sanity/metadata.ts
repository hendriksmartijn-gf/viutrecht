import type { Metadata } from "next";
import { urlFor } from "./image";
import { absoluteUrl, BASE_LANGUAGE, HREFLANG, INDEXABLE, isLanguage, pathFor, type Language } from "./i18n";

type Translation = { _type?: string | null; language?: string | null; slug?: string | null } | null;

// hreflang: one entry per existing translation, plus x-default pointing at the Dutch page.
export function alternatesFor(
  type: string,
  lang: Language,
  slug: string | null | undefined,
  translations: Translation[] | null | undefined,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  const versions = translations?.length ? translations : [{ _type: type, language: lang, slug }];
  for (const t of versions) {
    if (!t?.language || !isLanguage(t.language)) continue;
    languages[HREFLANG[t.language]] = absoluteUrl(pathFor(t._type ?? type, t.language, t.slug));
  }
  const nl = languages[HREFLANG[BASE_LANGUAGE]];
  if (nl) languages["x-default"] = nl;
  return { canonical: absoluteUrl(pathFor(type, lang, slug)), languages };
}

type SeoInput = {
  type: string;
  lang: Language;
  slug?: string | null;
  title?: string | null;
  summary?: string | null;
  image?: Parameters<typeof urlFor>[0] | null;
  seo?: { title?: string | null; description?: string | null; image?: Parameters<typeof urlFor>[0] | null; noIndex?: boolean | null } | null;
  translations?: Translation[] | null;
  noIndex?: boolean;
  ogType?: "website" | "article";
};

const hasAsset = (image: unknown) => Boolean(image && typeof image === "object" && "asset" in image && (image as { asset?: unknown }).asset);

// Smart defaults with overrides: SEO fields win, content fields fill the gaps.
export function buildMetadata(input: SeoInput): Metadata {
  const description = input.seo?.description || input.summary || undefined;
  const ogImage = [input.seo?.image, input.image].find(hasAsset);
  const alternates = alternatesFor(input.type, input.lang, input.slug, input.translations);
  return {
    // A hand-written meta title is used as-is; otherwise the layout template adds "| VI Utrecht".
    title: input.seo?.title ? { absolute: input.seo.title } : (input.title ?? undefined),
    description,
    alternates,
    // Only set robots when needed: an explicit undefined would wipe the layout's site-wide noindex.
    ...(!INDEXABLE
      ? { robots: { index: false, follow: false } }
      : input.seo?.noIndex || input.noIndex
        ? { robots: { index: false, follow: true } }
        : {}),
    openGraph: {
      type: input.ogType ?? "website",
      locale: HREFLANG[input.lang].replace("-", "_"),
      url: alternates?.canonical?.toString(),
      title: input.seo?.title || input.title || undefined,
      description,
      images: ogImage
        ? [{ url: urlFor(ogImage as Parameters<typeof urlFor>[0]).width(1200).height(630).fit("crop").url(), width: 1200, height: 630 }]
        : undefined,
    },
  };
}
