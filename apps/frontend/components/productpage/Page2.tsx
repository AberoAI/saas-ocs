// apps/frontend/components/productpage/Page2.tsx
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

export default function Page2() {
  const t = useTranslations();

  const headlineLines = t("product.page2.headline").split("\n");
  const subheadlineLines = t("product.page2.subheadline").split("\n");
  const microlineLines = t("product.page2.microline").split("\n");

  return (
    <section id="product-page-2" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mt-4 md:mt-0 md:flex md:items-start md:justify-between md:gap-10">
          <div className="md:w-3/5">
            <p className="text-xs uppercase tracking-wide text-black/40">
              {renderLines(headlineLines, "")}
            </p>

            <h2 className="mt-4 text-[33px] md:text-[39px] font-semibold text-[#585858]">
              {renderLines(subheadlineLines, "")}
            </h2>

            <p className="mt-4 max-w-2xl text-xs md:text-sm leading-relaxed text-slate-500 italic">
              {renderLines(microlineLines, "")}
            </p>
          </div>

          <div className="hidden md:block md:w-2/5 md:pl-8" />
        </div>
      </div>
    </section>
  );
}
