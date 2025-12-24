// apps/frontend/app/robots.ts
import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  // Urutan fallback (tetap dari kerangka kamu):
  // 1) SITE_URL (set manual di Vercel, mis. https://aberoai.com)
  // 2) VERCEL_URL (otomatis dari Vercel, tanpa protocol)
  // 3) fallback hardcoded
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/+$/, "");
  const vu = process.env.VERCEL_URL?.trim();
  if (vu) return `https://${vu.replace(/\/+$/, "")}`;
  return "https://aberoai.com";
}

function isSystemStatusEnabled(): boolean {
  const raw = (process.env.ABEROAI_SYSTEM_STATUS || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  const isProd =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  if (!isProd) {
    // Jangan index Preview/Dev (tetap)
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  // ✅ Jika System Status Mode aktif di production, jangan index sama sekali
  if (isSystemStatusEnabled()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: base,
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
