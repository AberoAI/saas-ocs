// apps/frontend/i18n.ts
// Disediakan agar next-intl plugin yg mencari ./i18n.ts TIDAK error.
// Nilai di-sync dengan app/i18n.ts milikmu (tanpa import lintas saat build).

const config = {
  locales: ['en', 'tr'] as const,
  defaultLocale: 'en'
};

export default config;
export type Locale = (typeof config.locales)[number];
export const locales = config.locales;
export const defaultLocale = config.defaultLocale;
