// apps/frontend/i18n/request.ts
// Minimal, statik, untuk memenuhi requirement plugin next-intl.
// Tidak membaca headers / request, jadi aman untuk SSG.

import {getRequestConfig} from 'next-intl/server';
import type {AbstractIntlMessages} from 'next-intl';
import {locales} from './routing';

export default getRequestConfig(async ({locale}) => {
  // Validasi locale terhadap daftar yang diijinkan; fallback ke 'en'
  const lc = (locales as readonly string[]).includes(locale) ? locale : 'en';

  // Import messages sesuai locale. Cast via `unknown` agar struktur array diterima TS.
  const messages =
    (await import(`../messages/${lc}.json`)).default as unknown as AbstractIntlMessages;

  return {
    locale: lc,
    messages
  };
});
