// apps/frontend/i18n.ts
// Shim untuk kompatibilitas import lama atau tooling yang mencari ./i18n.ts.
// Tetap satu sumber kebenaran di ../i18n/config.
export { locales, defaultLocale, domain } from './i18n/config';
export type { Locale } from './i18n/config';
