// apps/frontend/i18n/config.ts
export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
};

// Default locale dibaca dari ENV; fallback aman ke 'en'
const raw = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? '').trim().toLowerCase();
export const defaultLocale: Locale =
  (locales as readonly string[]).includes(raw) ? (raw as Locale) : 'en';

// Mapping IP country → locale (silakan kembangkan jika perlu)
export function mapCountryToLocale(country?: string | null): Locale {
  const c = (country ?? '').toUpperCase();
  return c === 'TR' ? 'tr' : 'en';
}

// (opsional) jika dipakai di tempat lain
export const domain = 'https://aberoai.com';
