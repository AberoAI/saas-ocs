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

function isSystemStatusEnabled(): boolean {
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

  // 3) Accept-Language (fallback ringan)
  const al = req.headers.get("accept-language")?.toLowerCase() || "";
  if (al.includes("tr")) return "tr";

  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Global gate (bilingual): semua halaman diarahkan ke /{locale}/system-status
  if (isSystemStatusEnabled()) {
    // Hindari loop untuk status page (kedua locale)
    if (pathname === "/en/system-status" || pathname === "/tr/system-status") {
      return NextResponse.next();
    }

    const loc = detectLocale(req);

    const url = req.nextUrl.clone();
    url.pathname = `/${loc}/system-status`;
    url.search = "";
    return NextResponse.rewrite(url);
  }

  // Normal behavior (i18n routing)
  return intl(req);
}

export const config = {
  matcher: ["/((?!_next|api|_trpc|_vercel|_not-found|.*\\..*).*)"],
};
