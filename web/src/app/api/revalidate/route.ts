import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Called by a Sanity webhook on publish. All content shares the "sanity" tag: the site is
// small, and a price or opening-hours change must show everywhere at once.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new NextResponse("Missing SANITY_REVALIDATE_SECRET", { status: 500 });

  try {
    const { isValidSignature } = await parseBody(req, secret);
    if (!isValidSignature) return new NextResponse("Invalid signature", { status: 401 });
    revalidateTag("sanity", { expire: 0 });
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error(error);
    return new NextResponse("Bad request", { status: 400 });
  }
}
