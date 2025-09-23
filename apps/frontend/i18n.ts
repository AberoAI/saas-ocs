// apps/frontend/i18n.ts
// Shim untuk kompatibilitas import lama.
// Re-export semua konfigurasi dari ./i18n/config.
// ⚠️ Tidak ada default export, tidak ada getRequestConfig di sini.

export {
  locales,
  defaultLocale,
  domain,
  localeNames,
  mapCountryToLocale,
  localePrefix,
  pathnames
} from './i18n/config';

export type { Locale } from './i18n/config';
