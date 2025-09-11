// apps/frontend/app/[locale]/page.tsx
'use client';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export default function Page() {
  const t = useTranslations();
  const pathname = usePathname();

  // Ambil locale dari prefix URL: /en/... atau /tr/...
  const locale = (pathname?.split('/')[1] === 'tr' ? 'tr' : 'en') as 'en' | 'tr';
  const base = `/${locale}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-24" role="main" aria-labelledby="hero-title">
      <h1 id="hero-title" className="text-4xl md:text-6xl font-semibold tracking-tight max-w-[18ch]">
        {t('hero.headline')}
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-prose">
        {t('hero.sub')}
      </p>
      <div className="mt-10 flex gap-4">
        {/* CTA utama → route sesuai locale. Ganti ke path lain jika perlu. */}
        <Link className="rounded-2xl px-5 py-3 bg-black text-white" href={`${base}/pricing`} prefetch>
          {t('cta.primary')}
        </Link>

        {/* CTA sekunder tetap anchor ke demo section */}
        <Link className="rounded-2xl px-5 py-3 border" href="#demo">
          {t('cta.secondary')}
        </Link>
      </div>
    </main>
  );
}
