// apps/frontend/i18n/index.ts
// Shim re-export dari config. Tidak ada default export, tidak ada getRequestConfig.

export {
  locales,
  defaultLocale,
  domain,
  localeNames,
  mapCountryToLocale,
  localePrefix,
  pathnames
} from './config';

export type { Locale } from './config';
