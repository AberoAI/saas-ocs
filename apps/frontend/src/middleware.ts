import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ENABLED = process.env.VERIFICATION_MODE === "true";

const SAFE_PREFIXES = [
  "/api",
  "/dashboard",
  "/auth",
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/privacy",
  "/terms",
  "/verify",      // <- pakai /verify, bukan /__verify
];

export function middleware(req: NextRequest) {
  if (!ENABLED) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Biarkan semua path selain root & SAFE_PREFIXES berjalan normal.
  if (pathname !== "/" || SAFE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Arahkan root "/" ke /verify saat VERIFICATION_MODE=true
  const url = req.nextUrl.clone();
  url.pathname = "/verify";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/:path*"],
};
