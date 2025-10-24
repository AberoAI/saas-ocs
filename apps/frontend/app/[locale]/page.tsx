"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import ScrollHint from "@/components/hero/ScrollHint";
import AboutShowcase from "@/components/about/AboutShowcase";

function getBizName(): string {
  return process.env.BIZ_NAME || process.env.NEXT_PUBLIC_BIZ_NAME || "AberoAI";
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-black/90 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-black/70">{desc}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-2xl border border-black/10 bg-white p-5">
      <summary className="cursor-pointer list-none text-base font-medium">{q}</summary>
      <p className="mt-2 text-sm text-black/70">{a}</p>
    </details>
  );
}

export default function LocaleHomePage() {
  const name = getBizName();
  const t = useTranslations();
  const rawHeadline = t("hero.headline");

  const hlMatch = rawHeadline.match(/Over 65%|%?\d+[.,]?\d*%?/);
  const before = hlMatch ? rawHeadline.slice(0, hlMatch.index!) : rawHeadline;
  const highlight = hlMatch ? hlMatch[0] : "";
  const after = hlMatch ? rawHeadline.slice(hlMatch.index! + hlMatch[0].length) : "";

  return (
    <>
      {/* Hero minimal */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center pt-24 md:pt-32 pb-8 md:pb-10">
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
              {before}
              {highlight && <span style={{ color: "#26658C" }}>{highlight}</span>}
              {after}
            </h1>
            <ScrollHint />
          </div>
        </div>
      </section>

      {/* Showcase sedikit lebih jauh dari hero */}
      <AboutShowcase className="-mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8" />

      {/* Features */}
      <section id="features" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-medium md:text-3xl">Why {name}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard title="AI Autoreply" desc="Balasan cepat & konsisten untuk pertanyaan umum, terhubung WhatsApp Cloud API." />
            <FeatureCard title="Multi-tenant" desc="Cocok untuk klinik, hospitality, furniture—kelola banyak unit bisnis." />
            <FeatureCard title="Realtime Analytics" desc="Pantau metrik penting: SLA, waktu respon, topik percakapan." />
          </div>

          <ul className="mt-8 list-disc pl-5 text-black/75">
            <li>WhatsApp Cloud API + AI untuk balasan otomatis</li>
            <li>Multi-tenant: cocok untuk klinik, hospitality, furniture</li>
            <li>Realtime dashboard &amp; analytics</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">FAQ</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Faq q="Apakah butuh server sendiri?" a="Tidak. Semuanya dikelola di cloud. Kamu cukup menghubungkan WhatsApp Cloud API." />
            <Faq q="Bisakah pakai banyak cabang?" a="Bisa. Fitur multi-tenant memudahkan kelola banyak unit bisnis dalam satu akun." />
            <Faq q="Ada free trial?" a="Ada. Daftar dan mulai uji coba langsung tanpa kartu kredit." />
            <Faq q="Bisa integrasi sistem internal?" a="Bisa. Hubungi kami untuk integrasi custom (CRM, ticketing, dsb.)." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-black/60">© {new Date().getFullYear()} {name}</p>
          <div className="text-sm text-neutral-500">
            <Link href="/privacy" className="underline">Privacy Policy</Link> ·{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
