// apps/frontend/i18n/routing.ts
import {
  createLocalizedPathnamesNavigation,
  type Pathnames,
} from "next-intl/navigation";

export const locales = ["en", "tr"] as const;

/** Prefix selalu muncul (karena kamu pakai app/[locale]) */
export const localePrefix = "always" as const;

/**
 * Centralized route mapping untuk semua locale.
 * ✅ Keputusan FINAL: slug sama di EN & TR.
 * Jadi beda bahasa = beda prefix (/en ↔ /tr), bukan beda slug.
 */
export const pathnames = {
  "/": { en: "/", tr: "/" },

  // Foundation tetap sama
  "/foundation": { en: "/foundation", tr: "/foundation" },

  // Core routes: slug sama di EN & TR
  "/solutions": { en: "/solutions", tr: "/solutions" },
  "/product": { en: "/product", tr: "/product" },
  "/pricing": { en: "/pricing", tr: "/pricing" },
  "/privacy": { en: "/privacy", tr: "/privacy" },
  "/terms": { en: "/terms", tr: "/terms" },
  "/login": { en: "/login", tr: "/login" },

  // Kalau demo masih kamu keep, slug sama juga (aman)
  "/demo": { en: "/demo", tr: "/demo" },
} satisfies Pathnames<typeof locales>;

export type AppPath = keyof typeof pathnames;

export const { Link, useRouter, usePathname, redirect, getPathname } =
  createLocalizedPathnamesNavigation({
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
 * Contoh: "/solutions" -> "/solutions".
 */
export function toRouteKey(
  localizedPath: string
): keyof typeof pathnames | "/" {
  const base = stripLocalePrefix(localizedPath);
  if (base === "/" || base === "") return "/";
  for (const key in pathnames) {
    const entry = (pathnames as any)[key];
    if (entry && typeof entry === "object") {
      if (entry.en === base || entry.tr === base)
        return key as keyof typeof pathnames;
    }
  }
  // Fallback aman untuk rute yang belum dipetakan
  return base as any;
}
