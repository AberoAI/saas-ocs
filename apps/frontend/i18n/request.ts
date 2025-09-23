// apps/frontend/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import type {AbstractIntlMessages} from 'next-intl';
import {locales} from './routing'; // ⬅️ pakai file routing sendiri

export const defaultLocale = 'en' as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  // Validasi locale
  const supported = (locales as readonly string[]).includes(locale as string);
  const loc = (supported ? locale : defaultLocale) as Locale;

  // Import pesan i18n lalu cast ke AbstractIntlMessages (sesuai next-intl v3)
  const messages = (await import(`../messages/${loc}.json`))
    .default as AbstractIntlMessages;

  return {
    locale: loc,
    messages
  };
});
