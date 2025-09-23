// apps/frontend/i18n/request.ts
// Minimal, statik, untuk memenuhi requirement plugin next-intl.
// Tidak membaca headers / request, jadi aman untuk SSG.

import {getRequestConfig} from 'next-intl/server';
import type {AbstractIntlMessages} from 'next-intl';

export default getRequestConfig(async () => {
  const messages = (await import('../messages/en.json')).default as AbstractIntlMessages;
  return {
    locale: 'en',
    messages
  };
});
