import type { NextConfig } from "next";
import { client } from "./src/sanity/client";
import { REDIRECTS_QUERY } from "./src/sanity/queries";

// Redirects are managed in Sanity and read at build time, so a new redirect goes live
// with the next deploy. They run before the proxy, so old /nl/... URLs land correctly.
async function sanityRedirects() {
  try {
    const redirects = await client.withConfig({ useCdn: false }).fetch(REDIRECTS_QUERY);
    return redirects.map((r) => ({
      source: r.source!,
      destination: r.destination!,
      permanent: r.permanent ?? true,
    }));
  } catch (error) {
    console.error("Could not load redirects from Sanity", error);
    return [];
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Off on purpose: with it, unknown URLs get an instant 200 shell and the 404 streams in
  // afterwards (a soft 404). Without it, notFound() returns a real 404 status.
  partialPrefetching: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  redirects: sanityRedirects,
  // Belt and braces with the robots meta: also covers sitemap.xml, images and other files.
  async headers() {
    if (process.env.SITE_INDEXABLE === "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
