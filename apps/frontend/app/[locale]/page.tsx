// apps/frontend/app/[locale]/page.tsx
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'AberoAI – Home',
  description: 'Temporary smoke test home'
};

type Props = { params: { locale: string } };

export default async function LocaleHome({ params: { locale } }: Props) {
  // pastikan static rendering tetap aman
  setRequestLocale(locale as any);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Hello from /{locale}</h1>
      <p style={{ marginTop: 8, color: 'rgba(0,0,0,.7)' }}>
        If you can see this, routing + layout are fine.
      </p>
      <p style={{ marginTop: 4, color: 'rgba(0,0,0,.7)' }}>
        Next step: re-enable your real homepage section by section to find the crashing component.
      </p>
    </main>
  );
}
