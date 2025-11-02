// apps/frontend/i18n/routing.ts
import {
  createLocalizedPathnamesNavigation,
  type Pathnames
} from "next-intl/navigation";

export const locales = ["en", "tr"] as const;

/** Prefix selalu muncul (karena kamu pakai app/[locale]) */
export const localePrefix = "always" as const;

/** Centralized route mapping untuk semua locale */
export const pathnames = {
  "/": { en: "/", tr: "/" },
  "/about": { en: "/about", tr: "/hakkinda" },
  "/demo": { en: "/demo", tr: "/demo" },
  "/privacy": { en: "/privacy", tr: "/gizlilik" },
  "/terms": { en: "/terms", tr: "/kosullar" },

  // ✅ Tambahan agar Navbar & sistem kamu tidak error TS
  "/features": { en: "/features", tr: "/ozellikler" },
  "/solutions": { en: "/solutions", tr: "/cozumler" },
  "/login": { en: "/login", tr: "/giris" },
  "/contact": { en: "/contact", tr: "/iletisim" },
  "/pricing": { en: "/pricing", tr: "/fiyatlar" },
  "/product": { en: "/product", tr: "/urun" },
} satisfies Pathnames<typeof locales>;

export type AppPath = keyof typeof pathnames;

export const {
  Link,
  useRouter,
  usePathname,
  redirect,
  getPathname,
} = createLocalizedPathnamesNavigation({
  locales,
  localePrefix,
  pathnames,
});

// --- helpers: strip & ensure locale prefix ---
export function stripLocalePrefix(pathname: string): string {
  if (!pathname) return "/";
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p.replace(/^\/(en|tr)(?=\/|$)/, "") || "/";
}

/**
 * Map path terlokalisasi → "key route" di pathnames.
 * Contoh: "/ozellikler" -> "/features", "/hakkinda" -> "/about".
 * Pastikan switch locale selalu pakai key, bukan path lokal mentah.
 */
export function toRouteKey(localizedPath: string): keyof typeof pathnames | "/" {
  const base = stripLocalePrefix(localizedPath);
  if (base === "/" || base === "") return "/";
  for (const key in pathnames) {
    const entry = (pathnames as any)[key];
    if (entry && typeof entry === "object") {
      if (entry.en === base || entry.tr === base) return key as keyof typeof pathnames;
    }
  }
  // Fallback aman untuk rute yang belum dipetakan
  return base as any;
}
