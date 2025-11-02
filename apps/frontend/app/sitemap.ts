// apps/frontend/app/sitemap.ts
import type { MetadataRoute } from "next";

/** URL dasar situs, env-aware */
function getBaseUrl(): string {
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/+$/, "");
  const vu = process.env.VERCEL_URL?.trim();
  if (vu) return `https://${vu.replace(/\/+$/, "")}`;
  return "https://aberoai.com"; // fallback aman
}

/** Tanggal last-modified (boleh dikunci via ENV) */
function getLastModified(): string {
  return (
    process.env.SITEMAP_LAST_MODIFIED?.trim() ||
    new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  );
}

/** Locales yang aktif */
const LOCALES = ["en", "tr"] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Halaman berlokalisasi (akan jadi /en/... & /tr/...)
 * "" artinya root per-locale: /en dan /tr
 */
const LOCALIZED_PATHS = [
  "",          // /en, /tr
  "verify",    // /en/verify, /tr/verify
  "privacy",   // /en/privacy, /tr/privacy (aman walau TR belum ada)
  "terms",     // /en/terms,   /tr/terms   (aman walau TR belum ada)
] as const;

/** Halaman non-lokal (single URL tanpa prefix) */
const NON_LOCALIZED_PATHS = [
  "/login",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const last = getLastModified();

  const items: MetadataRoute.Sitemap = [];

  // (1) Entri berlokalisasi + hreflang
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
        priority: seg === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: urlsByLocale.en,
            tr: urlsByLocale.tr,
          },
        },
      });
    }
  }

  // (2) Entri non-lokal
  for (const p of NON_LOCALIZED_PATHS) {
    items.push({
      url: `${base}${p}`,
      lastModified: last,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return items;
}
