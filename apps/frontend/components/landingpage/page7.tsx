// apps/frontend/components/landingpage/page7.tsx
"use client";

import { useTranslations } from "next-intl";

export default function Page7Section() {
  const t = useTranslations();

  return (
    <section
      id="page-7"
      className="bg-white min-h-[100svh] flex items-center justify-center py-24"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6 text-center w-full">
        <h2 className="text-[30px] md:text-[36px] font-semibold text-[#585858] whitespace-pre-line">
          {t("page7.headline")}
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-[16px] md:text-[18px] leading-relaxed text-slate-700">
          {t("page7.subheadline")}
        </p>

        {/* CTA + Footnote shifted down by 20px */}
        <div className="translate-y-[20px]">
          {/* CTA wrapper shifted right by 10px */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-8 translate-x-[10px]">
            <button
              type="button"
              className="px-6 py-3 rounded-[10px] text-sm md:text-base font-medium bg-[#26658C] text-white shadow-sm hover:shadow-md transition"
            >
              {t("page7.ctaPrimary")}
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-[10px] text-sm md:text-base font-medium border border-slate-300 text-slate-800 hover:border-slate-400 transition"
            >
              {t("page7.ctaSecondary")}
            </button>
          </div>

          <p className="mt-8 text-[10px] md:text-[12px] leading-relaxed text-slate-500 whitespace-pre-wrap">
            {t("page7.footnote")}
          </p>
        </div>
      </div>
    </section>
  );
}
