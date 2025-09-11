export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe'
};

export const defaultLocale: Locale = 'en';
export const domain = 'https://aberoai.com';
