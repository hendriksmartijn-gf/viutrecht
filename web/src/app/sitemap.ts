import type { MetadataRoute } from "next";
import { getRoutes } from "@/sanity/fetch";
import { absoluteUrl, HREFLANG, isLanguage, pathFor } from "@/sanity/i18n";

// Every indexable document, with hreflang alternates so both languages are discovered together.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getRoutes();
  return routes
    .filter((r) => !r.noIndex && r.language && isLanguage(r.language))
    .map((r) => {
      const languages: Record<string, string> = {};
      for (const t of r.translations ?? []) {
        if (t?.language && isLanguage(t.language)) {
          languages[HREFLANG[t.language]] = absoluteUrl(pathFor(t._type, t.language, t.slug));
        }
      }
      if (r._type === "homePage") {
        languages[HREFLANG.nl] = absoluteUrl("/");
        languages[HREFLANG.en] = absoluteUrl("/en");
      }
      return {
        url: absoluteUrl(pathFor(r._type, r.language, r.slug)),
        lastModified: new Date(r._updatedAt),
        alternates: Object.keys(languages).length ? { languages } : undefined,
      };
    });
}
