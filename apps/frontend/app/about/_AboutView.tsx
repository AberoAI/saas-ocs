// apps/frontend/app/about/_AboutView.tsx
// Presentational-only (tanpa next-intl), aman untuk SSG.
// Menerima props { copy, localePrefix } sesuai kontrak halaman ber-locale.

import AboutShowcase from "@/components/about/AboutShowcase";
import type { AboutCopy } from "./types";

export default function AboutView({
  copy,
  localePrefix,
}: {
  copy: AboutCopy;
  localePrefix: string;
}) {
  return (
    <main className="mx-auto max-w-6xl px-8 py-16">
      <header className="mb-10">
        <p className="text-xs uppercase text-black/40 tracking-wide">
          {localePrefix === "/tr" ? "Hakkında" : "About"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{copy.title}</h1>
      </header>

      {copy.paragraphs?.length ? (
        <section className="prose prose-neutral max-w-none">
          {copy.paragraphs.map((p, i) => (
            <p key={i} className="text-black/75">
              {p}
            </p>
          ))}
        </section>
      ) : null}

      <AboutShowcase className="mt-10 sm:mt-12 md:mt-14 lg:mt-16" />

      {copy.ctaHref && copy.ctaLabel ? (
        <div className="mt-10">
          <a
            href={copy.ctaHref}
            className="inline-flex items-center rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {copy.ctaLabel}
          </a>
        </div>
      ) : null}
    </main>
  );
}
