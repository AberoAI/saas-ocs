"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import ScrollHint from "@/components/hero/ScrollHint";
import AboutShowcase from "@/components/about/AboutShowcase";
import HeroRings from "@/components/hero/HeroRings";
import { motion, useReducedMotion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["500"] }); // Medium

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
  const reduceMotion = useReducedMotion();

  const cleaned = t("hero.headline").replace(/\.$/, "");
  const hlMatch = cleaned.match(/Over 65%|%?\d+[.,]?\d*%?/);
  const before = hlMatch ? cleaned.slice(0, hlMatch.index!) : cleaned;
  const highlight = hlMatch ? hlMatch[0] : "";
  const after = hlMatch ? cleaned.slice(hlMatch.index! + hlMatch[0].length) : "";

  return (
    <>
      {/* HERO */}
      <section
        id="page-1-hero"
        className="relative flex min-h-[80vh] items-center justify-start overflow-hidden pl-[83px] pt-8"
        aria-labelledby="hero-hook"
      >
        <HeroRings />

        {/* hero text block */}
        <div className="max-w-6xl pr-6">
          <div className="max-w-3xl text-left -mt-6 sm:-mt-8 md:-mt-12">
            <motion.h1
              id="hero-hook"
              className={`${poppins.className} font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug tracking-[-0.01em] text-[#585858]`}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {before}
              {highlight && <span style={{ color: "#26658C" }}>{highlight}</span>}
              {after}
            </motion.h1>
          </div>
        </div>

        {/* centered scroll hint */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
          <div className="pointer-events-auto">
            <ScrollHint targetId="page-2-showcase" />
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="page-2-showcase">
        <AboutShowcase className="mt-10 sm:mt-12 md:mt-14 lg:mt-16" />
      </section>

      {/* WHY ABEROAI */}
      <section
        id="page-3-why-aberoai"
        className="page border-top border-black/10 bg-white mt-24 md:mt-32"
        aria-labelledby="why-aberoai-heading"
      >
        <div className="mx-auto max-w-6xl px-8 py-16">
          <h2 id="why-aberoai-heading" className="text-2xl font-medium md:text-3xl">
            Why {name}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard title="AI Autoreply" desc="Balasan cepat & konsisten untuk pertanyaan umum, terhubung WhatsApp Cloud API." />
            <FeatureCard title="Multi-tenant" desc="Cocok untuk klinik, hospitality, furniture — kelola banyak unit bisnis." />
            <FeatureCard title="Realtime Analytics" desc="Pantau metrik penting: SLA, waktu respon, topik percakapan." />
          </div>

          <ul className="mt-8 list-disc pl-5 text-black/75">
            <li>WhatsApp Cloud API + AI untuk balasan otomatis</li>
            <li>Multi-tenant: cocok untuk klinik, hospitality, furniture</li>
            <li>Realtime dashboard & analytics</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="page-4-faq" className="page border-t border-black/10 bg-white mt-20 md:mt-28">
        <div className="mx-auto max-w-6xl px-8 py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">FAQ</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Faq q="Apakah butuh server sendiri?" a="Tidak. Semuanya dikelola di cloud. Kamu cukup menghubungkan WhatsApp Cloud API." />
            <Faq q="Bisakah pakai banyak cabang?" a="Bisa. Fitur multi-tenant memudahkan kelola banyak unit bisnis dalam satu akun." />
            <Faq q="Ada free trial?" a="Ada. Daftar dan mulai uji coba langsung tanpa kartu kredit." />
            <Faq q="Bisa integrasi sistem internal?" a="Bisa. Hubungi kami untuk integrasi custom (CRM, ticketing, dsb.)." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row">
          <p className="text-sm text-black/60">
            © {new Date().getFullYear()} {getBizName()}
          </p>
          <div className="text-sm text-neutral-500">
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
