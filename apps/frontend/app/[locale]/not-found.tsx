// apps/frontend/app/[locale]/not-found.tsx
// NOTE: Biarkan halaman ini statik. Jangan pakai next-intl atau headers di sini.

export default function NotFoundPage() {
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
