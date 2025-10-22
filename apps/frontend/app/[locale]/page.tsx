// apps/frontend/app/[locale]/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
// import HeroChatMock from "../components/HeroChatMock"; // ❌ nonaktifkan
import ScrollHint from "@/components/hero/ScrollHint"; // ✅ tambahkan

/** -- Helper (tetap) -- */
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

/** ---------- Halaman ---------- */
export default function LocaleHomePage() {
  const name = getBizName();
  const t = useTranslations();

  // Ambil headline dari i18n (subheadline tidak dipakai di hero minimal)
  const rawHeadline = t("hero.headline");

  // Otomatis highlight segmen angka/persentase (mis. "Over 65%" / "%65")
  const hlMatch = rawHeadline.match(/Over 65%|%?\d+[.,]?\d*%?/);
  const before = hlMatch ? rawHeadline.slice(0, hlMatch.index!) : rawHeadline;
  const highlight = hlMatch ? hlMatch[0] : "";
  const after = hlMatch ? rawHeadline.slice(hlMatch.index! + hlMatch[0].length) : "";

  return (
    <>
      {/* Navbar global sudah dirender oleh app/layout.tsx */}

      {/* Hero minimal (sesuai foto kedua) */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center py-24 md:py-32">
            {/* ukuran headline tetap sesuai versimu sekarang */}
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
              {before}
              {highlight && <span style={{ color: "#26658C" }}>{highlight}</span>}
              {after}
            </h1>

            {/* Scroll hint animasi halus */}
            <ScrollHint />
          </div>
        </div>
      </section>

      {/* About Us (short version) — DINONAKTIFKAN */}
      {/*
      <section id="about" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">{t("landing.about.title")}</h2>
          <p className="mt-4 text-black/70 md:text-lg max-w-3xl">
            {t("landing.about.text1")}
          </p>
          <p className="mt-3 text-black/70 md:text-lg max-w-3xl">
            {t("landing.about.text2")}
          </p>
          <div className="mt-6">
            <Link
              href="/about"
              className="inline-flex items-center rounded-xl bg-[#7D948A] hover:bg-[#64786f] px-5 py-3 text-sm font-medium text-white shadow-md transition"
            >
              {t("landing.about.cta")}
            </Link>
          </div>
        </div>
      </section>
      */}

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
