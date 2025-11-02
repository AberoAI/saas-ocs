// apps/frontend/app/sitemap.ts
import type { MetadataRoute } from "next";

/** URL dasar situs, env-aware */
function getBaseUrl(): string {
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/+$/, "");
  const vu = process.env.VERCEL_URL?.trim();
  if (vu) return `https://${vu.replace(/\/+$/, "")}`;
  return "https://aberoai.com";
}

/** Tanggal terakhir diperbarui (YYYY-MM-DD) */
function getLastModified(): string {
  return (
    process.env.SITEMAP_LAST_MODIFIED?.trim() ||
    new Date().toISOString().slice(0, 10)
  );
}

/** Locale yang dipakai */
const LOCALES = ["en", "tr"] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Halaman yang dilokalisasi (akan menghasilkan /en/... & /tr/...)
 * "" = root per-locale (/en dan /tr)
 */
const LOCALIZED_PATHS = [
  "",             // /en, /tr
  "about",
  "features",
  "solutions",
  "pricing",
  "login",
  "product",
  "demo",
  "privacy",      // ✅ pengganti privacy-policy
  "terms",        // ✅ pengganti terms-of-service
  "faq",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const last = getLastModified();

  const items: MetadataRoute.Sitemap = [];

  // Entri berlokalisasi + hreflang
  for (const seg of LOCALIZED_PATHS) {
    const urlsByLocale = LOCALES.reduce<Record<Locale, string>>((acc, loc) => {
      const path = seg ? `/${loc}/${seg}` : `/${loc}`;
      acc[loc] = `${base}${path}`;
      return acc;
    }, {} as Record<Locale, string>);

    for (const loc of LOCALES) {
      items.push({
        url: urlsByLocale[loc],
        lastModified: last,
        changeFrequency: "weekly",
        priority: seg === "" ? 1.0 : 0.7,
        alternates: {
          languages: {
            en: urlsByLocale.en,
            tr: urlsByLocale.tr,
          },
        },
      });
    }
  }

  return items;
}
