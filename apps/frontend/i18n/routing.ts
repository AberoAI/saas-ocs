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
