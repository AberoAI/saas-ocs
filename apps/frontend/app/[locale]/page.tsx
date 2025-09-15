// apps/frontend/app/[locale]/page.tsx
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

/** -- Helper (tetap) -- */
function getBizName(): string {
  return process.env.BIZ_NAME || process.env.NEXT_PUBLIC_BIZ_NAME || "AberoAI";
}
function getTagline(): string {
  return (
    process.env.BIZ_TAGLINE ||
    process.env.NEXT_PUBLIC_BIZ_TAGLINE ||
    "AI-powered Online Customer Service Automation"
  );
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

/** ---------- Halaman ---------- */
export default function LocaleHomePage() {
  const name = getBizName();
  const tagline = getTagline(); // tetap dibiarkan agar konsisten
  const t = useTranslations();

  // Headline: bagi jadi dua agar “Over 65%” bisa diberi warna khusus
  const headlineRest = " of customers cancel due to slow responses";
  const subheadline =
    "AberoAI solves this problem with instant 24/7 responses, multilingual support, and automated booking workflows.";

  return (
    <>
      {/* Navbar global sudah dirender oleh app/layout.tsx */}

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-12 md:grid-cols-2 md:pt-16">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/70">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              {t("hero.badge")}
            </p>

            {/* Headline/Subheadline */}
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {/* Warna disamakan dengan brand (#26658C) */}
              <span style={{ color: "#26658C" }}>Over 65%</span>
              {headlineRest}
            </h1>
            <p className="mt-2 text-lg text-black/70 md:text-xl">
              {subheadline}
            </p>

            {/* CTA: dibuat 1 tombol saja (Try Live Demo) */}
            <div className="mt-8">
              <Link
                href="/login"
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-black/90"
              >
                Try Live Demo
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-black/60">
              <span>{t("misc.noCard")}</span>
              <span>•</span>
              <span>{t("misc.cancelAnytime")}</span>
            </div>
          </div>

          {/* Mock UI */}
          <div className="relative">
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-black/10 bg-black/5 px-4 py-2">
                <span className="size-2.5 rounded-full bg-red-400"></span>
                <span className="size-2.5 rounded-full bg-amber-400"></span>
                <span className="size-2.5 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs text-black/60">AberoAI Bot</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="max-w-[80%] rounded-2xl bg-black/5 px-3 py-2 text-sm">
                  Halo! Ada yang bisa kami bantu?
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl bg-black px-3 py-2 text-sm text-white">
                  Jadwal buka klinik hari ini?
                </div>
                <div className="max-w-[80%] rounded-2xl bg-black/5 px-3 py-2 text-sm">
                  Klinik buka 09.00–21.00 WIB. Ingin buat janji?
                </div>
                <div className="mt-4 rounded-xl bg-black/90 px-3 py-2 text-center text-xs text-white">
                  Dibalas oleh AI • &lt;1 detik
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us (short version) */}
      <section id="about" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">About AberoAI</h2>
          <p className="mt-4 text-black/70 md:text-lg max-w-3xl">
            AberoAI is a technology company based in Izmir, Turkey, specializing in{" "}
            <strong>Online Customer Service + AI (OCS+AI)</strong> solutions. We integrate WhatsApp Cloud API
            with AI-powered automation to help businesses improve customer engagement and reduce operational
            costs.
          </p>
          <div className="mt-6">
            <Link
              href="/about"
              className="inline-flex items-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/90"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-medium md:text-3xl">Why {name}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              title="AI Autoreply"
              desc="Balasan cepat & konsisten untuk pertanyaan umum, terhubung WhatsApp Cloud API."
            />
            <FeatureCard
              title="Multi-tenant"
              desc="Cocok untuk klinik, hospitality, furniture—kelola banyak unit bisnis."
            />
            <FeatureCard
              title="Realtime Analytics"
              desc="Pantau metrik penting: SLA, waktu respon, topik percakapan."
            />
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
