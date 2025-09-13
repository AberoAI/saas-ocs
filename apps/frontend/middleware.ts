// apps/frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// [i18n] import next-intl middleware & config
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale, mapCountryToLocale } from "./i18n/config";

// [market] import helper market (tetap)
import { mapCountryToMarket, MARKET_COOKIE } from "./lib/market";

// ----[1] Toggle via ENV (server-only prefer) ----
const VERIFICATION_ON =
  process.env.VERIFICATION_MODE === "true" ||
  process.env.NEXT_PUBLIC_VERIFICATION_MODE === "true";

const ALLOW_DEBUG_ROUTES =
  process.env.DEBUG_PAGES_ENABLED === "true" ||
  process.env.ENABLE_DEBUG_ROUTES === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true";

const IS_PROD = process.env.NODE_ENV === "production";

// Dev-only override (aktif di Preview/Dev atau saat flag di-on)
const ENABLE_DEV_OVERRIDE =
  process.env.NEXT_PUBLIC_ENABLE_LOCALE_GEO_OVERRIDE === "true" ||
  process.env.VERCEL_ENV === "preview" ||
  !IS_PROD;

// ----[1b] (Opsional) Guard auth untuk area privat. Default: OFF.
const AUTH_GUARD_ON =
  process.env.AUTH_GUARD_ON === "true" ||
  process.env.NEXT_PUBLIC_AUTH_GUARD_ON === "true";
const PROTECTED_PREFIXES = ["/app", "/dashboard", "/settings"]; // sesuaikan
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "access_token";

// ----[2] Daftar public (SELALU bebas diakses) ----
const PUBLIC_PREFIXES = [
  "/api",
  "/auth",
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

// [i18n] instance next-intl middleware (honor Accept-Language & cookie NEXT_LOCALE)
const intl = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ----[A] Proteksi /debug/* di production (tetap)
  if (IS_PROD && pathname.startsWith("/debug")) {
    if (!ALLOW_DEBUG_ROUTES) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    // jika diizinkan, lanjut ke aturan berikutnya
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
    if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) || isStaticAsset(pathname)) {
      // pass
    } else {
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
  }

  // ----[D] Dev-only override (?hl, ?geo, ?currency) → set cookie + redirect 307
  if (
    ENABLE_DEV_OVERRIDE &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_trpc") &&
    !isStaticAsset(pathname)
  ) {
    const url = req.nextUrl;

    // ✅ Tambahan: token guard (opsional tapi direkomendasikan)
    const secret = process.env.DEV_OVERRIDE_SECRET || "";
    const token = url.searchParams.get("dev") || "";
    const tokenOk = Boolean(secret) && token === secret;

    if (tokenOk) {
      const hl = (url.searchParams.get("hl") || url.searchParams.get("locale"))?.toLowerCase() || null;
      const geo = url.searchParams.get("geo")?.toUpperCase() || null;
      const cur = url.searchParams.get("currency")?.toUpperCase() || null;

      const isLocale = (v?: string | null): v is (typeof locales)[number] =>
        !!v && (locales as readonly string[]).includes(v as any);
      const isCurrency = (v?: string | null) =>
        !!v && ["TRY", "USD", "EUR", "GBP"].includes(v.toUpperCase());

      const wantLocale = isLocale(hl) ? (hl as (typeof locales)[number]) : null;
      const wantGeo = geo || null;
      const wantCur = isCurrency(cur) ? cur! : null;

      if (wantLocale || wantGeo || wantCur) {
        // bersihkan query (✅ tambahkan 'dev' juga dibersihkan)
        url.searchParams.delete("hl");
        url.searchParams.delete("locale");
        url.searchParams.delete("geo");
        url.searchParams.delete("currency");
        url.searchParams.delete("dev"); // <— tambahan

        // atur prefix locale
        const segments = url.pathname.split("/").filter(Boolean);
        if (wantLocale) {
          if (segments.length && (locales as readonly string[]).includes(segments[0] as any)) {
            segments[0] = wantLocale;
          } else {
            segments.unshift(wantLocale);
          }
        }

        const dest = req.nextUrl.clone();
        dest.pathname = "/" + segments.join("/");
        dest.search = url.searchParams.toString();

        const secure = dest.protocol === "https:";

        const res = NextResponse.redirect(dest, 307);
        if (wantLocale)
          res.cookies.set("NEXT_LOCALE", wantLocale, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: "lax",
            secure,
          });
        if (wantGeo)
          res.cookies.set("GEO_COUNTRY_OVERRIDE", wantGeo, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: "lax",
            secure,
          });
        if (wantCur)
          res.cookies.set("CURRENCY_OVERRIDE", wantCur, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: "lax",
            secure,
          });

        return res;
      }
    }
    // jika token tidak valid/absen → lanjut (override off)
  }

  // ----[E] [i18n] Enforce prefix locale + IP→cookie redirect + fallback Accept-Language
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_trpc") ||
    isStaticAsset(pathname)
  ) {
    return NextResponse.next();
  }

  // Sudah ada prefix locale?
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  // Cookie preferensi user (di-set oleh next-intl / oleh kita)
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value as (typeof locales)[number] | undefined;

  // Jika belum ada prefix & belum ada preferensi → gunakan IP country
  if (!hasLocalePrefix && !cookieLocale) {
    // Vercel: x-vercel-ip-country atau req.geo?.country
    const country = req.headers.get("x-vercel-ip-country") || (req as any).geo?.country;
    const ipLocale = mapCountryToLocale(country);

    // [market] tentukan MARKET dari IP
    const ipMarket = mapCountryToMarket(country);

    const url = req.nextUrl.clone();
    url.pathname = `/${ipLocale}${pathname === "/" ? "" : pathname}`;

    const res = NextResponse.redirect(url);

    // Simpan preferensi (1 tahun)
    res.cookies.set("NEXT_LOCALE", ipLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PROD,
    });

    // [market] simpan MARKET terpisah dari bahasa
    res.cookies.set(MARKET_COOKIE, ipMarket, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PROD,
    });
    return res;
  }

  // Untuk semua kasus lain, delegasikan ke next-intl
  return intl(req);
}

// Middleware aktif untuk rute publik; exclude assets/API/_trpc agar ringan & aman
export const config = {
  matcher: ['/((?!_next|api|_trpc|.*\\..*).*)'],
};
