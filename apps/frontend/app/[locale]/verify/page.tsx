// apps/frontend/app/[locale]/verify/page.tsx
'use client';

import { Link } from '@/i18n/routing';

type PageProps = { params: { locale: string } };

export default function VerifyPage({ params: { locale } }: PageProps) {
  const isTR = (locale ?? '').toLowerCase().startsWith('tr');

  const title = isTR ? 'Doğrulama' : 'Verification';
  const desc = isTR
    ? 'Lütfen e-postanızı kontrol edin ve doğrulama bağlantısına tıklayın.'
    : 'Please check your email and click the verification link.';
  const cta = isTR ? 'Ana sayfaya dön' : 'Back to home';

  const homeHref =
    isTR
      ? ({ pathname: '/', locale: 'tr' } as const)
      : ({ pathname: '/', locale: 'en' } as const);

  return (
    <main className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-6 py-16">
      <div className="w-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-black/70">{desc}</p>
        <Link
          href={homeHref}
          className="mt-6 inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-black/5"
        >
          {cta}
        </Link>
      </div>
    </main>
  );
}
