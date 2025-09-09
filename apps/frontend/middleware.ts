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

// ----[1b] (Baru, opsional) Guard auth hanya untuk prefix privat.
// Default: OFF agar tidak mengubah perilaku lama kamu.
const AUTH_GUARD_ON =
  process.env.AUTH_GUARD_ON === "true" ||
  process.env.NEXT_PUBLIC_AUTH_GUARD_ON === "true"; // fallback (hindari di prod)
const PROTECTED_PREFIXES = ["/app", "/dashboard", "/settings"]; // sesuaikan jika perlu
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "access_token";

// ----[2] Jalur aman milikmu (tetap + ditambah route publik yang kamu butuhkan) ----
const SAFE_PREFIXES = [
  "/api",
  "/dashboard", // <— sengaja tetap: kamu sudah punya ini di kerangka
  "/auth",
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  // halaman policy lama yang sudah kamu whitelist
  "/privacy",
  "/terms",
  // 🔽 tambahkan halaman publik yang dibutuhkan utk landing & verifikasi
  "/privacy-policy",
  "/terms-of-service",
  "/contact",
  "/_healthz",
  "/login", // login harus publik
  "/verify", // halaman verifikasi punyamu
];

// helper kecil untuk cek file statik
const isStaticAsset = (path: string) =>
  path.startsWith("/assets/") ||
  /\.(svg|png|jpg|jpeg|ico|gif|webp|css|js|map|txt|woff2?|ttf|eot)$/i.test(path);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ----[A] Proteksi /debug/* di production (tetap)
  if (IS_PROD && pathname.startsWith("/debug")) {
    if (!ALLOW_DEBUG_ROUTES) {
      // Samarkan jadi 404 supaya tidak "mengundang"
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.next();
  }

  // ----[B] Mode verifikasi punyamu (tetap, tapi lebih permisif untuk halaman publik)
  if (VERIFICATION_ON) {
    if (req.method === "GET") {
      // i) izinkan semua yang termasuk SAFE atau static asset
      if (SAFE_PREFIXES.some((p) => pathname.startsWith(p)) || isStaticAsset(pathname)) {
        return NextResponse.next();
      }
      // ii) khusus root, arahkan ke /verify (sesuai kerangkamu)
      if (pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/verify";
        return NextResponse.rewrite(url);
      }
      // iii) selain itu lanjutkan normal
      return NextResponse.next();
    }
    // non-GET → lanjutkan normal
    return NextResponse.next();
  }

  // ----[C] (Baru, opsional) Guard auth untuk area privat — aktif hanya bila AUTH_GUARD_ON=true
  if (AUTH_GUARD_ON) {
    // lepas semua route publik & asset statik
    if (SAFE_PREFIXES.some((p) => pathname.startsWith(p)) || isStaticAsset(pathname)) {
      return NextResponse.next();
    }
    // proteksi prefix privat
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

  // default: biarkan lewat
  return NextResponse.next();
}

// Middleware tetap menjaga seluruh rute (sesuai kerangka aslimu)
export const config = {
  matcher: ["/:path*"],
};
