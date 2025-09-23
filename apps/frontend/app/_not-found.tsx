// apps/frontend/app/_not-found.tsx
// Root 404 yang benar-benar statik (tanpa next-intl / headers)

export const dynamic = 'force-static';

export default function RootNotFound() {
  return (
    <main className="mx-auto grid min-h-[50vh] max-w-3xl place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-sm text-black/50">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-black/70">
          The page you’re looking for doesn’t exist or might have been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/90"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
