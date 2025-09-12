// apps/frontend/app/[locale]/about/page.tsx
import {permanentRedirect} from 'next/navigation';
import type {Metadata} from 'next';

// Hindari indeks ganda pada alias locale (opsional, aman untuk SEO)
export const metadata: Metadata = {
  robots: {index: false, follow: true}
};

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Page({searchParams}: Props) {
  // Pertahankan query string jika ada (?ref=..., dsb.)
  const qs =
    searchParams && Object.keys(searchParams).length
      ? `?${new URLSearchParams(
          Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((vi) => [k, vi]) : v !== undefined ? [[k, v]] : []
          ) as unknown as string[][] // cast aman untuk TS
        ).toString()}`
      : '';

  permanentRedirect(`/about${qs}`); // 308 → rute kanonik
}
