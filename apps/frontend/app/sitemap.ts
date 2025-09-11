// apps/frontend/app/sitemap.ts
import type { MetadataRoute } from "next";

/** URL dasar situs, env-aware untuk Production & Preview (tetap dari kerangka kamu) */
function getBaseUrl(): string {
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/+$/, "");
  const vu = process.env.VERCEL_URL?.trim();
  if (vu) return `https://${vu.replace(/\/+$/, "")}`;
  return "https://aberoai.com"; // fallback aman
}

/** Tanggal terakhir diperbarui; bisa dikunci via ENV agar stabil (tetap dari kerangka kamu) */
function getLastModified(): string {
  return (
    process.env.SITEMAP_LAST_MODIFIED?.trim() ||
    new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  );
}

/**
 * LOCALES untuk halaman berprefix (i18n).
 * Kita akan mengeluarkan entri /en/... & /tr/... plus hreflang cross-links.
 */
const LOCALES = ["en", "tr"] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Daftar path yang DILOKALISASI (muncul sebagai /en, /tr, /en/pricing, /tr/pricing, dst.)
 * Gunakan string kosong "" untuk halaman root per-locale (/en dan /tr).
 * Tambahkan halaman publik lain yang memang berlokalisasi: 'pricing', 'about', dll.
 */
const LOCALIZED_PATHS = [
  "", // → /en dan /tr
  // "pricing",
  // "about",
] as const;

/**
 * Daftar path yang TIDAK dilokalisasi (single URL saja, tanpa prefix locale).
 * CATATAN: Jangan cantumkan "/" di sini; root tanpa prefix akan redirect.
 */
const NON_LOCALIZED_PATHS = [
  "/login",
  "/privacy-policy",
  "/terms-of-service",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const last = getLastModified();

  const items: MetadataRoute.Sitemap = [];

  // ── (1) Entri BERLOKALISASI (/en/... & /tr/...) dengan hreflang cross-links
  for (const seg of LOCALIZED_PATHS) {
    // Bangun URL per-locale (typed tanpa any)
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

  // ── (2) Entri NON-LOKALISASI (1 URL saja)
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
