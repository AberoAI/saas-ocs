// apps/frontend/i18n/config.ts
export const locales = ['en', 'tr'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

// Mapping IP country → locale (silakan kembangkan jika perlu)
export function mapCountryToLocale(country?: string): Locale {
  if (country?.toUpperCase() === 'TR') return 'tr';
  return 'en';
}
