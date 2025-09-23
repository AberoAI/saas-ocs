// apps/frontend/app/[locale]/not-found.tsx
export const dynamic = 'force-dynamic';

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl p-10 text-center">
      <h1 className="text-3xl font-bold">404 – Not Found</h1>
      <p className="mt-4 text-black/70">Sorry, this page could not be found.</p>
    </main>
  );
}
