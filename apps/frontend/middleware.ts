import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ENABLED = process.env.VERIFICATION_MODE === "true";

// Daftar path yang TIDAK boleh terdampak (dashboard, auth, api, assets, dll)
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
  "/__verify", // halaman verifikasi sendiri
];

export function middleware(req: NextRequest) {
  if (!ENABLED) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Biarkan semua path selain root dan SAFE_PREFIXES berjalan normal
  if (pathname !== "/" || SAFE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Rewrite root ("/") ke halaman verifikasi khusus
  const url = req.nextUrl.clone();
  url.pathname = "/__verify";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/:path*"], // evaluasi semua path
};
