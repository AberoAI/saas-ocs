// apps/frontend/app/[locale]/not-found.tsx
// NOTE: Halaman ini tetap 100% statik, tidak menggunakan headers atau hooks.
// Tambahkan setRequestLocale(locale) agar Next.js tidak salah mendeteksi dynamic usage.

import { setRequestLocale } from "next-intl/server";

export default function NotFoundPage({ params }: { params: { locale: string } }) {
  // 👇 Baris penting agar route /_not-found bisa di-prerender secara statik
  setRequestLocale(params.locale);

  return (
    <main className="mx-auto grid min-h-[50vh] max-w-3xl place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-sm text-black/50">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-black/70">
          The page you’re looking for doesn’t exist or might have been moved.
        </p>
        <div className="mt-6">
          {/* Pakai anchor biasa supaya tidak memicu dynamic headers */}
          <a
            href="../"
            className="inline-flex items-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/90"
          >
            Go back
          </a>
        </div>
      </div>
    </main>
  );
}
