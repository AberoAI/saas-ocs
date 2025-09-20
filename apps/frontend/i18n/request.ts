// apps/frontend/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '../app/i18n';

type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validasi locale yang masuk
  const supported = (locales as readonly string[]).includes(locale as string);
  const loc = (supported ? locale : defaultLocale) as Locale;

  // Muat messages; aman meskipun file belum lengkap
  let messages: Record<string, unknown> = {};
  try {
    messages = (await import(`../messages/${loc}.json`)).default;
  } catch {
    messages = {};
  }

  // next-intl@4 mengharuskan ada { locale, messages }
  return { locale: loc, messages };
});
