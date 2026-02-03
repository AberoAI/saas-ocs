// apps/frontend/components/foundationpage/Page3.tsx
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

export default function Page3() {
  const t = useTranslations();

  const headlineLines = t("foundation.page3.headline").split("\n");
  const subheadlineLines = t("foundation.page3.subheadline").split("\n");
  const bodyLines = t("foundation.page3.body").split("\n");

  return (
    <section id="foundation-page-3" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mt-4 md:mt-0 md:flex md:items-start md:justify-between md:gap-10">
          <div className="md:w-3/5">
            <h2 className="mt-4 text-[33px] md:text-[39px] font-semibold text-[#585858]">
              {renderLines(headlineLines, "")}
            </h2>

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
