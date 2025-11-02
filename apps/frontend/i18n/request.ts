// apps/frontend/i18n/request.ts
// Minimal, statik, aman untuk SSG (tanpa header dynamic).
// Versi kompatibel untuk next-intl < 3.22.

import { getRequestConfig } from 'next-intl/server';
import type { AbstractIntlMessages } from 'next-intl';
import { locales } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Validasi locale terhadap daftar yang diijinkan; fallback ke 'en'
  const lc = (locales as readonly string[]).includes(locale) ? locale : 'en';

  // Cast via `unknown` agar struktur array (mis. bullets, faq) diterima TS
  const messages =
    (await import(`../messages/${lc}.json`)).default as unknown as AbstractIntlMessages;

  return {
    locale: lc,
    messages
  };
});
