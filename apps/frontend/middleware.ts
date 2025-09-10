// apps/frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ----[1] Toggle via ENV (server-only prefer) ----
const VERIFICATION_ON =
  process.env.VERIFICATION_MODE === "true" ||
  process.env.NEXT_PUBLIC_VERIFICATION_MODE === "true";

const ALLOW_DEBUG_ROUTES =
  process.env.DEBUG_PAGES_ENABLED === "true" ||
  process.env.ENABLE_DEBUG_ROUTES === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true";

const IS_PROD = process.env.NODE_ENV === "production";

// ----[1b] (Opsional) Guard auth untuk area privat. Default: OFF.
const AUTH_GUARD_ON =
  process.env.AUTH_GUARD_ON === "true" ||
  process.env.NEXT_PUBLIC_AUTH_GUARD_ON === "true";
const PROTECTED_PREFIXES = ["/app", "/dashboard", "/settings"]; // sesuaikan
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "access_token";

// ----[2] Daftar public (SELALU bebas diakses) ----
// Catatan: TIDAK menyertakan "/dashboard" agar bisa diproteksi saat AUTH_GUARD_ON=true
const PUBLIC_PREFIXES = [
  "/api",
  "/auth", // termasuk /api/auth/*
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/privacy",
  "/terms",
  "/privacy-policy",
  "/terms-of-service",
  "/contact",
  "/_healthz",
  "/login",
  "/verify",
];

const isStaticAsset = (path: string) =>
  path.startsWith("/assets/") ||
  /\.(svg|png|jpg|jpeg|ico|gif|webp|css|js|map|txt|woff2?|ttf|eot)$/i.test(path);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ----[A] Proteksi /debug/* di production (tetap)
  if (IS_PROD && pathname.startsWith("/debug")) {
    if (!ALLOW_DEBUG_ROUTES) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.next();
  }

  // ----[B] Mode verifikasi (opsi kamu sebelumnya, tetap)
  if (VERIFICATION_ON) {
    if (req.method === "GET") {
      if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) || isStaticAsset(pathname)) {
        return NextResponse.next();
      }
      if (pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/verify";
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // ----[C] (Opsional) Guard auth aktif → lindungi prefix privat
  if (AUTH_GUARD_ON) {
    // Bebaskan public & asset statik
    if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) || isStaticAsset(pathname)) {
      return NextResponse.next();
    }

    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    if (isProtected) {
      const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

// Middleware aktif untuk seluruh rute (tidak mengubah perilaku selain rules di atas)
export const config = {
  matcher: ["/:path*"],
};
