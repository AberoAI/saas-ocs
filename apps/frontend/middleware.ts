// apps/frontend/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales } from "./i18n/config";

const defaultLocale = "en" as const;

const intl = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

function isProdRuntime(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

function isSystemStatusEnabled(): boolean {
  // ✅ Dev (localhost) tidak boleh kena gate
  if (!isProdRuntime()) return false;

  const raw = (process.env.ABEROAI_SYSTEM_STATUS || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

function detectLocale(req: NextRequest): "en" | "tr" {
  const { pathname } = req.nextUrl;

  // 1) Prefix di URL (paling akurat)
  if (pathname === "/tr" || pathname.startsWith("/tr/")) return "tr";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";

  // 2) Cookie locale (kalau ada)
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();
  if (cookieLocale === "tr") return "tr";
  if (cookieLocale === "en") return "en";

  // 3) Accept-Language (fallback)
  const al = req.headers.get("accept-language")?.toLowerCase() || "";
  if (al.includes("tr")) return "tr";

  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Global gate (PROD only):
  // - Root "/" -> redirect ke "/en" atau "/tr" (URL terlihat)
  // - Semua route lain -> rewrite ke "/system-status/{locale}" (URL user tidak berubah)
  if (isSystemStatusEnabled()) {
    const loc = detectLocale(req);

    // Hindari loop untuk route internal system-status
    if (pathname === "/system-status/en" || pathname === "/system-status/tr") {
      return NextResponse.next();
    }

    // Root: tampilkan URL locale (direct ke /en atau /tr)
    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = `/${loc}`;
      url.search = "";
      return NextResponse.redirect(url);
    }

    // Selain root: timpa konten dengan status view, tapi URL tidak berubah
    const url = req.nextUrl.clone();
    url.pathname = `/system-status/${loc}`;
    url.search = "";
    return NextResponse.rewrite(url);
  }

  // Normal behavior (i18n routing)
  return intl(req);
}

export const config = {
  matcher: ["/((?!_next|api|_trpc|_vercel|_not-found|.*\\..*).*)"],
};
