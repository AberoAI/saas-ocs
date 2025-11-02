// apps/frontend/app/[locale]/page.tsx
// Halaman minimal agar /en & /tr tidak blank.
// SSG aman; tanpa hook client/animasi supaya jika ada error lain, cepat kelihatan.

import { Link } from "@/i18n/routing";

export const dynamic = "force-static";

export default function LocaleHomePage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">AberoAI</h1>
      <p className="mt-3 text-foreground/70">
        Automate WhatsApp customer service with 24/7 instant replies.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/about"
          className="inline-flex items-center rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          About
        </Link>
        <Link
          href="/features"
          className="inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-black/5"
        >
          Features
        </Link>
      </div>
    </main>
  );
}
