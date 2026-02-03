// apps/frontend/components/solutionspage/Page7.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

function renderLines(lines: string[], className: string) {
  return lines.map((line, idx) => {
    const s = line ?? "";
    if (!s.trim()) {
      return (
        <span key={idx} className="block" aria-hidden="true">
          &nbsp;
        </span>
      );
    }
    return (
      <span key={idx} className={`block ${className}`}>
        {s}
      </span>
    );
  });
}

export default function Page7() {
  const t = useTranslations();

  const headlineLines = t("solutions.page7.headline").split("\n");
  const subheadlineLines = t("solutions.page7.subheadline").split("\n");
  const bodyLines = t("solutions.page7.body").split("\n");
  const footnoteLines = t("solutions.page7.footnote").split("\n");

  return (
    <section id="solutions-page-7" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="md:flex md:items-start md:justify-between md:gap-10">
          <div className="md:w-3/5">
            <h2 className="mt-2 text-[33px] md:text-[39px] font-semibold text-[#585858]">
              {renderLines(headlineLines, "")}
            </h2>

            <p className="mt-4 max-w-2xl text-[17px] md:text-[19px] leading-relaxed text-slate-700">
              {renderLines(subheadlineLines, "")}
            </p>

            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-slate-700">
              {renderLines(bodyLines, "")}
            </p>

            <div className="mt-8">
              <Link
                href="/product"
                className="inline-flex items-center rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
              >
                {t("solutions.page7.cta")}
              </Link>
            </div>

            <p className="mt-4 max-w-2xl text-xs md:text-sm leading-relaxed text-slate-500 italic">
              {renderLines(footnoteLines, "")}
            </p>
          </div>

          <div className="hidden md:block md:w-2/5 md:pl-8" />
        </div>
      </div>
    </section>
  );
}
