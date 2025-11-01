// apps/frontend/app/[locale]/about/page.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
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

export default function AboutPage() {
  const name = getBizName();
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const locale = (useLocale() || "en").toLowerCase();
  const isTR = locale === "tr";

  // Headline highlight tetap ambil dari hero.headline (punyamu)
  const cleaned = t("hero.headline").replace(/\.$/, "");
  const hlMatch = cleaned.match(/Over 65%|%?\d+[.,]?\d*%?/);
  const before = hlMatch ? cleaned.slice(0, hlMatch.index!) : cleaned;
  const highlight = hlMatch ? hlMatch[0] : "";
  const after = hlMatch ? cleaned.slice(hlMatch.index! + hlMatch[0].length) : "";

  // ✅ Subheadline dari messages (tidak hard-coded)
  const subHeadline = t("home.subHeadline");

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
              /* Micro-typography locale-aware (tetap milikmu) */
              className={`${poppins.className} break-keep font-medium ${
                isTR ? "leading-[1.18] tracking-[-0.005em]" : "leading-[1.1] tracking-[-0.01em]"
              } text-[22px] sm:text-[28px] md:text-[34px] lg:text-[48px] text-[#585858]`}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {before}
              {highlight && <span style={{ color: "#26658C" }}>{highlight}</span>}
              {after}
            </motion.h1>

            {/* Anchor weight — subheadline fade-in setelah hook */}
            <motion.p
              className="mt-3 max-w-xl text-[15px] leading-[1.5] text-black/60"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {subHeadline}
            </motion.p>
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
            {t("home.whyTitle", { name })}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard title={t("home.features.autoReplyTitle")} desc={t("home.features.autoReplyDesc")} />
            <FeatureCard title={t("home.features.multiTenantTitle")} desc={t("home.features.multiTenantDesc")} />
            <FeatureCard title={t("home.features.realtimeTitle")} desc={t("home.features.realtimeDesc")} />
          </div>

          <ul className="mt-8 list-disc pl-5 text-black/75">
            {t.raw("home.bullets").map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="page-4-faq" className="page border-t border-black/10 bg-white mt-20 md:mt-28">
        <div className="mx-auto max-w-6xl px-8 py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">{t("home.faqTitle")}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {t.raw("home.faq").map((it: { q: string; a: string }, i: number) => (
              <Faq key={i} q={it.q} a={it.a} />
            ))}
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
              {t("home.footer.privacy")}
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="underline">
              {t("home.footer.terms")}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
