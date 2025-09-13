// apps/frontend/middleware.ts
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// i18n: next-intl middleware & config kamu
import createIntlMiddleware from 'next-intl/middleware';
import {locales, defaultLocale, mapCountryToLocale} from './i18n/config';

// market helper
import {mapCountryToMarket, MARKET_COOKIE} from './lib/market';

// ----[Flags & constants]-------------------------------------------------------
const IS_PROD = process.env.NODE_ENV === 'production';

const VERIFICATION_ON =
  process.env.VERIFICATION_MODE === 'true' ||
  process.env.NEXT_PUBLIC_VERIFICATION_MODE === 'true';

const ALLOW_DEBUG_ROUTES =
  process.env.DEBUG_PAGES_ENABLED === 'true' ||
  process.env.ENABLE_DEBUG_ROUTES === 'true' ||
  process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';

// ✅ Dev-override hanya aktif di Preview/Dev (TIDAK PERNAH di Production)
const ENABLE_DEV_OVERRIDE =
  !IS_PROD &&
  (process.env.NEXT_PUBLIC_ENABLE_LOCALE_GEO_OVERRIDE === 'true' ||
    process.env.VERCEL_ENV === 'preview');

// Opsional: guard auth area privat (tidak diubah)
const AUTH_GUARD_ON =
  process.env.AUTH_GUARD_ON === 'true' ||
  process.env.NEXT_PUBLIC_AUTH_GUARD_ON === 'true';
const PROTECTED_PREFIXES = ['/app', '/dashboard', '/settings'];
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'access_token';

// Public routes (selalu bebas)
const PUBLIC_PREFIXES = [
  '/api',
  '/auth',
  '/_next',
  '/static',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/privacy',
  '/terms',
  '/privacy-policy',
  '/terms-of-service',
  '/contact',
  '/_healthz',
  '/login',
  '/verify'
];

const isStaticAsset = (path: string) =>
  path.startsWith('/assets/') ||
  /\.(svg|png|jpg|jpeg|ico|gif|webp|css|js|map|txt|woff2?|ttf|eot)$/i.test(path);

// next-intl instance
const intl = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true
});

// -----------------------------------------------------------------------------
export function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  // Early-pass: asset/api/_trpc
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_trpc') ||
    isStaticAsset(pathname)
  ) {
    return NextResponse.next();
  }

  // [A] Proteksi /debug di production
  if (IS_PROD && pathname.startsWith('/debug') && !ALLOW_DEBUG_ROUTES) {
    return NextResponse.json({error: 'Not Found'}, {status: 404});
  }

  // [B] Verification mode (tetap sesuai punyamu)
  if (VERIFICATION_ON) {
    if (req.method === 'GET') {
      if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
      }
      if (pathname === '/') {
        const url = req.nextUrl.clone();
        url.pathname = '/verify';
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // [C] Auth guard (opsional, tidak diubah)
  if (AUTH_GUARD_ON) {
    if (!PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
      const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
      if (isProtected) {
        const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
        if (!token) {
          const url = req.nextUrl.clone();
          url.pathname = '/login';
          url.searchParams.set('next', pathname);
          return NextResponse.redirect(url);
        }
      }
    }
  }

  // [D] Dev-only override (?hl, ?geo, ?currency) -> set cookie + redirect 307
  if (ENABLE_DEV_OVERRIDE) {
    const url = req.nextUrl;

    // ✅ Token wajib: jika DEV_OVERRIDE_SECRET kosong atau dev salah → override OFF
    const DEV_SECRET = (process.env.DEV_OVERRIDE_SECRET || '').trim();
    const provided = (url.searchParams.get('dev') || '').trim();
    const tokenOk = Boolean(DEV_SECRET) && provided === DEV_SECRET;

    if (tokenOk) {
      const hl = (url.searchParams.get('hl') || url.searchParams.get('locale'))?.toLowerCase() || null;
      const geo = url.searchParams.get('geo')?.toUpperCase() || null;
      const cur = url.searchParams.get('currency')?.toUpperCase() || null;

      const isLocale = (v?: string | null): v is (typeof locales)[number] =>
        !!v && (locales as readonly string[]).includes(v as any);
      const isCurrency = (v?: string | null) =>
        !!v && ['TRY', 'USD', 'EUR', 'GBP'].includes(v.toUpperCase());

      const wantLocale = isLocale(hl) ? (hl as (typeof locales)[number]) : null;
      const wantGeo = geo || null;
      const wantCur = isCurrency(cur) ? cur! : null;

      if (wantLocale || wantGeo || wantCur) {
        // Bersihkan query
        url.searchParams.delete('hl');
        url.searchParams.delete('locale');
        url.searchParams.delete('geo');
        url.searchParams.delete('currency');
        url.searchParams.delete('dev');

        // Pastikan prefix locale di path
        const segments = url.pathname.split('/').filter(Boolean);
        if (wantLocale) {
          if (segments.length && (locales as readonly string[]).includes(segments[0] as any)) {
            segments[0] = wantLocale;
          } else {
            segments.unshift(wantLocale);
          }
        }

        const dest = req.nextUrl.clone();
        dest.pathname = '/' + segments.join('/');
        dest.search = url.searchParams.toString();

        const secure = req.nextUrl.protocol === 'https:';
        const res = NextResponse.redirect(dest, 307);

        if (wantLocale)
          res.cookies.set('NEXT_LOCALE', wantLocale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'lax',
            secure
          });

        if (wantGeo)
          res.cookies.set('GEO_COUNTRY_OVERRIDE', wantGeo, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'lax',
            secure
          });

        if (wantCur)
          res.cookies.set('CURRENCY_OVERRIDE', wantCur, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'lax',
            secure
          });

        return res;
      }
    }
  }

  // [E] Enforce prefix locale + set cookie awal dari IP
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value as (typeof locales)[number] | undefined;

  if (!hasLocalePrefix && !cookieLocale) {
    const country = req.headers.get('x-vercel-ip-country') || (req as any).geo?.country;
    const ipLocale = mapCountryToLocale(country);
    const ipMarket = mapCountryToMarket(country);

    const url = req.nextUrl.clone();
    url.pathname = `/${ipLocale}${pathname === '/' ? '' : pathname}`;

    const res = NextResponse.redirect(url);
    res.cookies.set('NEXT_LOCALE', ipLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PROD
    });
    res.cookies.set(MARKET_COOKIE, ipMarket, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PROD
    });
    return res;
  }

  // Delegasikan ke next-intl untuk routing i18n
  return intl(req);
}

// Aktif untuk semua rute publik (exclude assets/API/_trpc)
export const config = {
  matcher: ['/((?!_next|api|_trpc|.*\\..*).*)']
};
