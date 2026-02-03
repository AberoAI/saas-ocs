// apps/frontend/components/solutionspage/Hero.tsx
"use client";

import { useTranslations } from "next-intl";

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

export default function Hero() {
  const t = useTranslations();

  const taglineLines = t("solutions.hero.tagline").split("\n");
  const headlineLines = t("solutions.hero.headline").split("\n");
  const subheadlineLines = t("solutions.hero.subheadline").split("\n");
  const bodyLines = t("solutions.hero.body").split("\n");

  return (
    <section id="solutions-hero" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="md:flex md:items-start md:justify-between md:gap-10">
          <div className="md:w-3/5">
            <p className="text-xs uppercase tracking-wide text-black/40">
              {renderLines(taglineLines, "")}
            </p>

            <h1 className="mt-4 text-[33px] md:text-[39px] font-semibold text-[#585858]">
              {renderLines(headlineLines, "")}
            </h1>

            <p className="mt-4 max-w-2xl text-[17px] md:text-[19px] leading-relaxed text-slate-700">
              {renderLines(subheadlineLines, "")}
            </p>

            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-slate-700">
              {renderLines(bodyLines, "")}
            </p>
          </div>

          <div className="hidden md:block md:w-2/5 md:pl-8" />
        </div>
      </div>
    </section>
  );
}
