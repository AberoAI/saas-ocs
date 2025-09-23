// apps/frontend/i18n.ts
// Routing-only i18n config — TIDAK ADA request-level getRequestConfig di sini.
// Tujuan: cegah next-intl membaca "i18n request config" sehingga build tetap statik.

export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Domain publik situs; bisa diambil dari ENV atau fallback hardcode.
export const domain =
  process.env.NEXT_PUBLIC_SITE_DOMAIN?.trim() ||
  process.env.SITE_URL?.replace(/^https?:\/\//, '').trim() ||
  'aberoai.com';

// (Opsional) Prefix strategi; selaraskan dengan routing kamu.
export const localePrefix = 'always' as const;

// (Opsional) Pemetaan path kanonik per-locale; selaraskan bila dipakai.
export const pathnames = {
  '/': '/',
  '/about': { en: '/about', tr: '/hakkinda' },
} as const;
