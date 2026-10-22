// next/image loader: Sanity photos are resized by Sanity's own image CDN instead of Vercel's
// image optimisation. Every width a phone or laptop asks for is then a plain CDN URL (no
// per-size transformation on Vercel, no optimisation quota). Other sources are left alone.
type Params = { src: string; width: number; quality?: number };

export default function sanityLoader({ src, width, quality }: Params) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  const w = Number(url.searchParams.get("w"));
  const h = Number(url.searchParams.get("h"));
  // Keep the crop's aspect ratio: scale the height along with the requested width.
  if (w && h) url.searchParams.set("h", String(Math.round((h * width) / w)));
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  // Never upscale beyond the original: Sanity returns the largest available size instead.
  url.searchParams.set("fit", url.searchParams.get("fit") ?? "max");
  return url.toString();
}
