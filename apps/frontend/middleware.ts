// apps/frontend/middleware.ts
import {NextRequest} from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import {locales} from './i18n/routing';

const defaultLocale = 'en' as const;

const intl = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true
});

export function middleware(req: NextRequest) {
  return intl(req);
}

export const config = {
  matcher: ['/((?!_next|api|_trpc|_vercel|_not-found|.*\\..*).*)']
};
