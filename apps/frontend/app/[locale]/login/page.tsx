// apps/frontend/app/[locale]/login/page.tsx
'use client';

import {useTranslations} from 'next-intl';
import NextLink from 'next/link';
import {Link} from '@/i18n/routing';

export default function LoginPage() {
  const t = useTranslations();
  const signInLabel = t('cta.signin');
  const logInLabel = t('nav.signin');

  // Fallback aman jika key "login.subtitle" belum ada
  let subtitle = 'Access your dashboard and manage conversations.';
  try {
    const maybe = t('login.subtitle');
    if (maybe && typeof maybe === 'string') subtitle = maybe;
  } catch {
    // ignore
  }

  return (
    <main className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 py-16">
      <div className="w-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{logInLabel}</h1>
        <p className="mt-1 text-sm text-black/60">{subtitle}</p>

        <div className="mt-5 flex flex-col gap-2">
          {/* ✅ Gunakan NextLink + locale={false} agar tidak diprefix /en atau /tr */}
          <NextLink
            href="/api/auth/signin"
            locale={false}
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {signInLabel}
          </NextLink>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-black/5"
          >
            {t('cta.secondary')}
          </Link>
        </div>
      </div>
    </main>
  );
}
