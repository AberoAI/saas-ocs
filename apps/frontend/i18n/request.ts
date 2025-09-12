// apps/frontend/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from '../app/i18n';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = (await requestLocale) ?? defaultLocale;
  if (!locales.includes(locale as typeof locales[number])) {
    locale = defaultLocale;
  }

  let messages: Record<string, unknown> = {};
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    // biarkan kosong supaya tidak crash saat belum ada key
    messages = {};
  }

  return {locale, messages};
});
