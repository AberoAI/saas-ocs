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
  // "1", "true", "yes", "on" -> enabled
  const raw = (process.env.ABEROAI_SYSTEM_STATUS || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Global gate: semua halaman diarahkan ke system-status
  // Hindari loop untuk halaman status itu sendiri.
  if (isSystemStatusEnabled()) {
    if (pathname !== "/system-status") {
      const url = req.nextUrl.clone();
      url.pathname = "/system-status";
      url.search = "";
      return NextResponse.rewrite(url);
    }
    // Jika sudah /system-status, lanjut normal (biar page bisa render)
    return NextResponse.next();
  }

  // Normal behavior (i18n routing)
  return intl(req);
}

export const config = {
  matcher: ["/((?!_next|api|_trpc|_vercel|_not-found|.*\\..*).*)"],
};
