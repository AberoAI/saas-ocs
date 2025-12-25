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
  if (!isProdRuntime()) return false;

  const raw = (process.env.ABEROAI_SYSTEM_STATUS || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

function detectLocale(req: NextRequest): "en" | "tr" {
  const { pathname } = req.nextUrl;

  if (pathname === "/tr" || pathname.startsWith("/tr/")) return "tr";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";

  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();
  if (cookieLocale === "tr") return "tr";
  if (cookieLocale === "en") return "en";

  const al = req.headers.get("accept-language")?.toLowerCase() || "";
  if (al.includes("tr")) return "tr";

  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ SYSTEM STATUS MODE (PROD ONLY)
  if (isSystemStatusEnabled()) {
    // Allow internal assets & system-status itself (+ NextAuth must NEVER be redirected)
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/_vercel") ||
      pathname.startsWith("/_trpc") ||
      pathname.startsWith("/api/auth") || // ⬅️ penting: exclude NextAuth routes
      pathname.startsWith("/api") ||
      pathname.startsWith("/system-status")
    ) {
      return NextResponse.next();
    }

    const loc = detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/system-status/${loc}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ✅ NORMAL MODE
  return intl(req);
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
