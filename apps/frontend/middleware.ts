// apps/frontend/middleware.ts
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
  "/verify", // <- halaman verifikasi
];

export function middleware(req: NextRequest) {
  if (!ENABLED) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Biarkan request non-GET (POST dsb) lewat agar API tidak terganggu
  if (req.method !== "GET") return NextResponse.next();

  // Kalau sudah di jalur aman, jangan diutak-atik
  if (SAFE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Saat mode verifikasi aktif, akar "/" diarahkan ke /verify
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/verify";
    return NextResponse.rewrite(url);
  }

  // Selain root, biarkan jalan normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
