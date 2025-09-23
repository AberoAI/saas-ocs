// apps/frontend/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import type {AbstractIntlMessages} from 'next-intl';
import {locales} from './routing';

export const defaultLocale = 'en' as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  // Validasi locale yang masuk
  const supported = (locales as readonly string[]).includes(locale as string);
  const loc = (supported ? locale : defaultLocale) as Locale;

  // Import messages dan cast ke AbstractIntlMessages (sesuai v3)
  const messages = (await import(`../messages/${loc}.json`))
    .default as AbstractIntlMessages;

  return {locale: loc, messages};
});
