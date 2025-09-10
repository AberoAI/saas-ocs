// apps/frontend/app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AberoAI – AI-powered Online Customer Service Automation",
  description:
    "Automate customer service with WhatsApp Cloud API + AI. Multi-tenant, real-time dashboard, and analytics.",
  alternates: { canonical: "/" },
};

function getBizName(): string {
  return (
    process.env.BIZ_NAME ||
    process.env.NEXT_PUBLIC_BIZ_NAME ||
    "AberoAI"
  );
}

function getTagline(): string {
  return (
    process.env.BIZ_TAGLINE ||
    process.env.NEXT_PUBLIC_BIZ_TAGLINE ||
    "AI-powered Online Customer Service Automation"
  );
}

export default function HomePage() {
  const name = getBizName();
  const tagline = getTagline();

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-10">
        <h1 className="text-4xl font-semibold">{name}</h1>
        <p className="mt-2 text-lg">{tagline}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Why {name}</h2>
        <ul className="list-disc pl-5">
          <li>WhatsApp Cloud API + AI untuk balasan otomatis</li>
          <li>Multi-tenant: cocok untuk klinik, hospitality, furniture</li>
          <li>Realtime dashboard &amp; analytics</li>
        </ul>
      </section>

      <div className="mt-10 flex gap-4">
        <a href="/contact" className="rounded-xl border px-5 py-3">
          Contact
        </a>
        {/* CTA ke halaman login khusus (jaga root tetap SSR & ringan) */}
        <a href="/login" className="rounded-xl bg-black px-5 py-3 text-white">
          Sign in
        </a>
      </div>

      <footer className="mt-16 text-sm text-neutral-500">
        <a href="/privacy-policy" className="underline">
          Privacy Policy
        </a>{" "}
        ·{" "}
        <a href="/terms-of-service" className="underline">
          Terms of Service
        </a>
      </footer>
    </main>
  );
}
