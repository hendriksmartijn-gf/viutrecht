import { NextResponse, type NextRequest } from "next/server";

// Dutch lives at the root but renders from app/[lang] with lang = "nl":
//   /lessen/crossfit  -> rewrite -> /nl/lessen/crossfit
//   /en/classes/...   -> served as-is
//   /nl/...           -> 308 to the root, so Dutch has exactly one URL
// Specific old URLs (e.g. /nl/olympicweightlifting) are handled earlier by the
// Sanity-managed redirects in next.config.ts.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/nl" || pathname.startsWith("/nl/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/nl${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals and files (sitemap.xml, robots.txt, images).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
