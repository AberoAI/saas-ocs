// apps/frontend/components/faq/FaqSection.tsx

"use client";

import { useMemo, useState } from "react";

type FaqItem = {
  q: string;
  a: string;
};

type FaqSectionProps = {
  headline: string;
  items: FaqItem[];
};

function renderMarkedText(input: string) {
  // Supports <m>...</m> markers for highlighted segments (no HTML injection).
  const parts: Array<{ type: "text" | "mark"; value: string }> = [];

  const re = /<m>([\s\S]*?)<\/m>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(input)) !== null) {
    const start = match.index;
    const end = re.lastIndex;

    if (start > lastIndex) {
      parts.push({ type: "text", value: input.slice(lastIndex, start) });
    }

    parts.push({ type: "mark", value: match[1] ?? "" });
    lastIndex = end;
  }

  if (lastIndex < input.length) {
    parts.push({ type: "text", value: input.slice(lastIndex) });
  }

  return parts.map((p, i) =>
    p.type === "mark" ? (
      <span key={i} className="font-medium text-[#313131]">
        {p.value}
      </span>
    ) : (
      <span key={i}>{p.value}</span>
    )
  );
}

function AnswerText({ a }: { a: string }) {
  // Keep exact formatting:
  // - '\n\n' => paragraph break
  // - '\n'   => line break within paragraph
  const paragraphs = a.split("\n\n");

  return (
    <div>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n");
        return (
          <p
            key={pIdx}
            className="text-[14px] md:text-[15px] leading-relaxed text-slate-600"
          >
            {lines.map((line, lIdx) => (
              <span key={lIdx}>
                {renderMarkedText(line)}
                {lIdx < lines.length - 1 ? <br /> : null}
              </span>
            ))}
            {pIdx < paragraphs.length - 1 ? (
              <>
                <br />
                <br />
              </>
            ) : null}
          </p>
        );
      })}
    </div>
  );
}

export default function FaqSection({ headline, items }: FaqSectionProps) {
  // Start with all closed
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-[30px] md:text-[36px] font-semibold text-[#585858] whitespace-pre-line">
          {headline}
        </h2>
      </div>

      <div className="mt-10 max-w-3xl mx-auto">
        <div className="space-y-3">
          {safeItems.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="mx-auto max-w-[90%] rounded-2xl border border-slate-200 bg-white/70 px-5 py-4"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx((v) => (v === idx ? null : idx))}
                  className="w-full text-left outline-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[15px] md:text-[16px] leading-relaxed text-slate-700">
                      {item.q}
                    </p>

                    <span
                      aria-hidden="true"
                      className={`mt-[2px] inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform duration-200 ease-out ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
                    isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-3">
                    <div className="h-px w-full bg-slate-200/70" />
                    <div className="mt-3">
                      <AnswerText a={item.a} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
