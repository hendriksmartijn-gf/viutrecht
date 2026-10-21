import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/sanity/i18n";

// Open to all crawlers, AI assistants included: being readable and selectable by them is
// part of the SEO goal. Restrict specific bots here if that policy changes.
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
