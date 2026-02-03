// apps/frontend/components/productpage/Page3.tsx
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

function FeatureBlock({
  title,
  body,
  microline,
  id,
}: {
  title: string;
  body: string;
  microline: string;
  id: string;
}) {
  const titleLines = title.split("\n");
  const bodyLines = body.split("\n");
  const microLines = microline.split("\n");

  return (
    <div
      id={id}
      className="rounded-2xl border border-black/10 bg-white px-6 py-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-[#585858]">
        {renderLines(titleLines, "")}
      </h3>

      <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-700">
        {renderLines(bodyLines, "")}
      </p>

      <p className="mt-3 text-xs md:text-sm leading-relaxed text-slate-500 italic">
        {renderLines(microLines, "")}
      </p>
    </div>
  );
}

export default function Page3() {
  const t = useTranslations();

  const blocks = [
    {
      id: "product-page-3-block-1",
      title: t("product.page3.block1.headline"),
      body: t("product.page3.block1.body"),
      microline: t("product.page3.block1.microline"),
    },
    {
      id: "product-page-3-block-2",
      title: t("product.page3.block2.headline"),
      body: t("product.page3.block2.body"),
      microline: t("product.page3.block2.microline"),
    },
    {
      id: "product-page-3-block-3",
      title: t("product.page3.block3.headline"),
      body: t("product.page3.block3.body"),
      microline: t("product.page3.block3.microline"),
    },
    {
      id: "product-page-3-block-4",
      title: t("product.page3.block4.headline"),
      body: t("product.page3.block4.body"),
      microline: t("product.page3.block4.microline"),
    },
    {
      id: "product-page-3-block-5",
      title: t("product.page3.block5.headline"),
      body: t("product.page3.block5.body"),
      microline: t("product.page3.block5.microline"),
    },
    {
      id: "product-page-3-block-6",
      title: t("product.page3.block6.headline"),
      body: t("product.page3.block6.body"),
      microline: t("product.page3.block6.microline"),
    },
  ];

  return (
    <section id="product-page-3" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="md:flex md:items-start md:justify-between md:gap-10">
          <div className="md:w-3/5">
            <div className="mt-4 grid gap-4">
              {blocks.map((b) => (
                <FeatureBlock
                  key={b.id}
                  id={b.id}
                  title={b.title}
                  body={b.body}
                  microline={b.microline}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:block md:w-2/5 md:pl-8" />
        </div>
      </div>
    </section>
  );
}
