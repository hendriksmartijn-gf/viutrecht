import type { NextConfig } from "next";

async function fetchRedirects() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    const query = encodeURIComponent(`*[_type == "redirect"]{ from, to, permanent }`);
    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;
    const res = await fetch(url);
    const data = await res.json();
    return (data.result ?? []).map((r: { from: string; to: string; permanent: boolean }) => ({
      source: r.from,
      destination: r.to,
      permanent: r.permanent ?? true,
    }));
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  redirects: fetchRedirects,
};

export default nextConfig;
