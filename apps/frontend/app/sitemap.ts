// apps/frontend/app/sitemap.ts
import type { MetadataRoute } from "next";

/** URL dasar situs, env-aware untuk Production & Preview */
function getBaseUrl(): string {
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/+$/, "");
  const vu = process.env.VERCEL_URL?.trim();
  if (vu) return `https://${vu.replace(/\/+$/, "")}`;
  return "https://aberoai.com"; // fallback aman
}

/** Tanggal terakhir diperbarui; bisa dikunci via ENV agar stabil */
function getLastModified(): string {
  return (
    process.env.SITEMAP_LAST_MODIFIED?.trim() ||
    new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  );
}

/** Daftar URL kanonik (hindari alias /privacy & /terms di sitemap) */
const CANONICAL_PATHS = [
  "/",
  "/login",
  "/privacy-policy",
  "/terms-of-service",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const last = getLastModified();

  return CANONICAL_PATHS.map((p) => ({
    url: `${base}${p}`,
    lastModified: last,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
