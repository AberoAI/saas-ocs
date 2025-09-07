// apps/frontend/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ----[1] Toggle fitur via ENV (back-compat disediakan) ----
const VERIFICATION_ON =
  process.env.VERIFICATION_MODE === "true" ||
  process.env.NEXT_PUBLIC_VERIFICATION_MODE === "true";

const ALLOW_DEBUG_ROUTES =
  process.env.ENABLE_DEBUG_ROUTES === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true";

const IS_PROD = process.env.NODE_ENV === "production";

// ----[2] Jalur aman milikmu (tidak diubah) ----
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
  const { pathname } = req.nextUrl;

  // ----[A] Blokir semua /debug/* di production kecuali diizinkan lewat ENV
  if (IS_PROD && pathname.startsWith("/debug")) {
    if (!ALLOW_DEBUG_ROUTES) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    // jika diizinkan, teruskan saja
    return NextResponse.next();
  }

  // ----[B] Mode verifikasi PUNYAMU (tidak diubah, hanya rename var) ----
  if (!VERIFICATION_ON) return NextResponse.next();

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

// Middleware tetap menjaga seluruh rute
export const config = {
  matcher: ["/:path*"],
};
