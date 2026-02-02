// apps/frontend/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import {
  locales,
  defaultLocale,
  mapCountryToLocale,
  type Locale,
} from "./i18n/config";

const intl = createIntlMiddleware({
  locales,
  defaultLocale,
  // Deterministic: URL /en dan /tr tidak boleh diubah oleh browser preferences.
  localeDetection: false,
});

function isProdRuntime(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

function isSystemStatusEnabled(): boolean {
  if (!isProdRuntime()) return false;

  const raw = (process.env.ABEROAI_SYSTEM_STATUS || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );
}

function getLocaleFromPrefix(pathname: string): Locale | null {
  const seg = pathname.split("/")[1]?.toLowerCase();
  if (!seg) return null;
  return (locales as readonly string[]).includes(seg) ? (seg as Locale) : null;
}

function getCountryFromHeaders(req: NextRequest): string | null {
  // Prefer platform-provided country headers (no IP parsing).
  // Vercel: x-vercel-ip-country
  // Cloudflare: cf-ipcountry
  // Generic/proxy: x-country
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country");
  return country ? country.trim().toUpperCase() : null;
}

function parsePrimaryLanguages(acceptLanguage: string): string[] {
  // Example: "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
  // We only need ordered language tags without q-values.
  return acceptLanguage
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Deterministic locale resolution:
 * Priority:
 * 1) explicit URL prefix (/en or /tr) -> never overridden (handled outside)
 * 2) cookie NEXT_LOCALE (user choice)
 * 3) country header (TR -> tr, else en)
 * 4) accept-language header
 * 5) defaultLocale from config
 */
function detectLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const country = getCountryFromHeaders(req);
  if (country) {
    return mapCountryToLocale(country);
  }

  const al = req.headers.get("accept-language") || "";
  const langs = parsePrimaryLanguages(al);

  if (langs.some((l) => l === "tr" || l.startsWith("tr-"))) return "tr";

  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /**
   * HARD GUARD:
   * Jangan pernah sentuh /api dengan i18n middleware (next-intl).
   * NextAuth client butuh JSON dari /api/auth/*.
   */
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ✅ SYSTEM STATUS MODE (PROD ONLY)
  if (isSystemStatusEnabled()) {
    // Allow internal assets & system-status itself
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/_trpc") ||
      pathname.startsWith("/_vercel") ||
      pathname.startsWith("/system-status")
    ) {
      return NextResponse.next();
    }

    // ✅ Allow privacy routes for compliance (must stay reachable even during system-status mode)
    if (
      pathname === "/privacy" ||
      pathname.startsWith("/privacy/") ||
      pathname === "/privacy-policy" ||
      pathname.startsWith("/privacy-policy/") ||
      /^\/(en|tr)\/privacy(\/|$)/i.test(pathname) ||
      /^\/(en|tr)\/privacy-policy(\/|$)/i.test(pathname)
    ) {
      return NextResponse.next();
    }

    const loc = detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/system-status/${loc}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  /**
   * ✅ OPTION A: GEO DEFAULT + DETERMINISTIC PREFIX
   * - If URL already includes /en or /tr => NEVER override.
   * - If URL has no locale prefix => choose locale (cookie -> country -> accept-language -> defaultLocale)
   */
  if (!hasLocalePrefix(pathname)) {
    const loc = detectLocale(req);
    const url = req.nextUrl.clone();

    url.pathname = `/${loc}${pathname === "/" ? "" : pathname}`;

    const res = NextResponse.redirect(url);

    res.cookies.set("NEXT_LOCALE", loc, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: isProdRuntime(),
    });

    return res;
  }

  // ✅ NORMAL MODE for already-prefixed URLs
  const prefixedLocale = getLocaleFromPrefix(pathname);
  const res = intl(req);

  if (prefixedLocale) {
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();
    if (cookieLocale !== prefixedLocale) {
      res.cookies.set("NEXT_LOCALE", prefixedLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        secure: isProdRuntime(),
      });
    }
  }

  return res;
}

export const config = {
  /**
   * IMPORTANT:
   * Exclude:
   * - /api (NextAuth)
   * - /_next, /_trpc, /_vercel (internal)
   * - /system-status (status routes)
   * - /_healthz (healthcheck rewrite)
   * - static files (.*\..*)
   */
  matcher: ["/((?!api|_next|_trpc|_vercel|system-status|_healthz|.*\\..*).*)"],
};
