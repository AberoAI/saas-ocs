// apps/frontend/app/i18n.ts
// Shim untuk konsumsi internal (middleware, request config, layout, dll).
// Jangan duplikasi nilai di sini—re-export dari sumber tunggal.
export { locales, defaultLocale, domain } from '../i18n/config';
export type { Locale } from '../i18n/config';
