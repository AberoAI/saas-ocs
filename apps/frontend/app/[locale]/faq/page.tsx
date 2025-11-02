// apps/frontend/app/[locale]/faq/page.tsx
'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function FaqPage() {
  const t = useTranslations();

  // Gunakan key yang sudah ada di messages (home.faqTitle, home.faq)
  const title = t('home.faqTitle');
  // t.raw agar array JSON tidak dipaksa ke string
  const items = t.raw('home.faq') as Array<{q: string; a: string}>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-black/60">
          {/* fallback subtitle sederhana tanpa menambah key baru */}
          {t?.has?.('faq.subtitle') ? t('faq.subtitle') : 'Common questions about AberoAI.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {items?.map((it, idx) => (
          <details
            key={idx}
            className="rounded-2xl border border-black/10 bg-white p-5"
          >
            <summary className="cursor-pointer list-none text-base font-medium">
              {it.q}
            </summary>
            <p className="mt-2 text-sm text-black/70">{it.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-black/5"
        >
          {t('cta.secondary')}
        </Link>
      </div>
    </main>
  );
}
