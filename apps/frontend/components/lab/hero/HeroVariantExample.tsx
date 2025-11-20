// apps/frontend/components/lab/hero/HeroVariantExample.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HeroVariantExample() {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.5;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            AberoAI • AI Operations & Customer Service
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug text-slate-900 md:text-2xl">
            Turn WhatsApp into your always-on{" "}
            <span className="whitespace-nowrap">
              AI operations layer.
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-600 md:max-w-md">
            AberoAI menggabungkan AI customer service, booking, aftercare, dan
            retention analytics dalam satu platform—langsung di atas WhatsApp
            yang sudah dipakai timmu setiap hari.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px]"
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            >
              Book demo for your clinic
            </motion.button>

            <p className="text-[11px] text-slate-500">
              No-code onboarding • Live in days, not months.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <div className="absolute inset-4 rounded-xl border border-dashed border-slate-300" />
            <div className="relative flex flex-col items-center gap-2 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                WA
              </div>
              <p className="max-w-[11rem] text-[11px] text-slate-600">
                Auto-reply, booking, dan follow-up aftercare dalam satu flow
                yang bisa kamu kontrol.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="mt-4 text-[11px] text-slate-500">
        Hero ini hanya contoh. Fokusnya: struktur copy & layout, bukan visual
        final. Saat sudah cocok, pindahkan ke hero utama landing page.
      </p>
    </section>
  );
}
