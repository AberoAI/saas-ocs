// apps/frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ----[1] Toggle fitur via ENV (back-compat + server-only env) ----
const VERIFICATION_ON =
  process.env.VERIFICATION_MODE === "true" ||
  process.env.NEXT_PUBLIC_VERIFICATION_MODE === "true";

const ALLOW_DEBUG_ROUTES =
  process.env.DEBUG_PAGES_ENABLED === "true" || // ✅ server-only, prioritas
  process.env.ENABLE_DEBUG_ROUTES === "true" || // back-compat
  process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true"; // fallback (tidak direkomendasi di prod)

const IS_PROD = process.env.NODE_ENV === "production";

// ----[2] Jalur aman milikmu (tetap) ----
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
  "/verify",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ----[A] Proteksi /debug/* di production
  if (IS_PROD && pathname.startsWith("/debug")) {
    if (!ALLOW_DEBUG_ROUTES) {
      // Samarkan jadi 404 supaya tidak "mengundang"
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.next();
  }

  // ----[B] Mode verifikasi punyamu (tetap)
  if (!VERIFICATION_ON) return NextResponse.next();

  if (req.method !== "GET") return NextResponse.next();

  if (SAFE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/verify";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Middleware tetap menjaga seluruh rute
export const config = {
  matcher: ["/:path*"],
};
