import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-foreground/70">
        The page you’re looking for doesn’t exist.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/tr" className="rounded-xl bg-black px-4 py-2 text-white hover:bg-black/90">
          Ana sayfa (TR)
        </Link>
        <Link href="/en" className="rounded-xl border px-4 py-2 hover:bg-foreground/5">
          Home (EN)
        </Link>
      </div>
    </main>
  );
}
