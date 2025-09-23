// apps/frontend/i18n/routing.ts
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'tr'] as const;
/**
 * Karena kamu sudah pakai segmen app/[locale], prefix sebaiknya 'always'
 * supaya URL selalu diawali /en atau /tr.
 */
export const localePrefix = 'always' as const;

/**
 * Deklarasi peta path lintas-locale.
 * Kunci di kiri = "pathname netral", nilai = mapping per-locale.
 */
export const pathnames = {
  '/': {
    en: '/',
    tr: '/'
  },
  '/about': {
    en: '/about',
    tr: '/hakkinda'
  },
  '/demo': {
    en: '/demo',
    tr: '/demo'
  },
  '/privacy': {
    en: '/privacy',
    tr: '/gizlilik'
  },
  '/terms': {
    en: '/terms',
    tr: '/kosullar'
  }
} as const;

export const {Link, useRouter, usePathname, redirect, getPathname} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});
