import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Soft geo gate: Vercel sends `x-vercel-ip-country`. Not 100% accurate (VPNs, mobile networks).
 * Set GEO_BLOCK=0 to disable in production if needed.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/service-area")) {
    return NextResponse.next();
  }
  if (process.env.GEO_BLOCK === "0") {
    return NextResponse.next();
  }
  if (process.env.NODE_ENV === "development" && process.env.GEO_BLOCK_DEV !== "1") {
    return NextResponse.next();
  }

  const country = request.headers.get("x-vercel-ip-country");
  if (country && country !== "IN") {
    const url = request.nextUrl.clone();
    url.pathname = "/service-area";
    url.searchParams.set("reason", "country");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
