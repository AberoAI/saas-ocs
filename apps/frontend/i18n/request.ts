// apps/frontend/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import type {AbstractIntlMessages} from 'next-intl';
import {locales} from './routing';

export const defaultLocale = 'en' as const;
type Locale = (typeof locales)[number];

/**
 * Penting:
 * - Jangan pakai param { locale } di sini (deprecated & memicu dynamic headers).
 * - Locale sudah dikunci di app/[locale]/layout.tsx via setRequestLocale(loc).
 * - Di sini cukup kembalikan messages untuk defaultLocale agar tetap statik saat build.
 */
export default getRequestConfig(async () => {
  const loc = defaultLocale as Locale;

  // Import messages dan cast ke AbstractIntlMessages (sesuai v3)
  const messages = (await import(`../messages/${loc}.json`))
    .default as AbstractIntlMessages;

  return {locale: loc, messages};
});
