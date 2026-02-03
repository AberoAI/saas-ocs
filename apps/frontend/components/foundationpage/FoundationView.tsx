// apps/frontend/components/foundationpage/FoundationView.tsx

// Presentational-only.
// Server Component by default (no "use client").
// Menerima props { copy, uiLocale }.

import AboutShowcase from "@/components/about/AboutShowcase";
import type { FoundationCopy } from "./types";

type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

function toBlocks(paragraphs: string[] | undefined): Block[] {
  if (!paragraphs?.length) return [];

  const blocks: Block[] = [];
  let listBuf: string[] = [];

  const flushList = () => {
    if (!listBuf.length) return;
    blocks.push({ kind: "list", items: listBuf });
    listBuf = [];
  };

  for (const raw of paragraphs) {
    const s = (raw ?? "").trim();
    if (!s) continue;

    if (s.startsWith("•")) {
      listBuf.push(s.replace(/^•\s*/, ""));
      continue;
    }

    flushList();

    // Heading convention: "Something:"
    if (s.endsWith(":")) {
      blocks.push({ kind: "heading", text: s.replace(/:$/, "") });
      continue;
    }

    blocks.push({ kind: "paragraph", text: s });
  }

  flushList();
  return blocks;
}

export default function FoundationView({
  copy,
  uiLocale,
}: {
  copy: FoundationCopy;
  uiLocale: "en" | "tr";
}) {
  const blocks = toBlocks(copy.paragraphs);

  return (
    <main className="mx-auto max-w-6xl px-8 py-16">
      <header className="mb-10">
        <p className="text-xs uppercase text-black/40 tracking-wide">
          {uiLocale === "tr" ? "Sistemin Temeli" : "Foundation"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{copy.title}</h1>
      </header>

      {blocks.length ? (
        <section className="prose prose-neutral max-w-none">
          {blocks.map((b, i) => {
            if (b.kind === "heading") {
              return (
                <h3
                  key={i}
                  className="mt-8 text-base font-semibold text-black/80"
                >
                  {b.text}
                </h3>
              );
            }

            if (b.kind === "list") {
              return (
                <ul key={i} className="text-black/75">
                  {b.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={i} className="text-black/75">
                {b.text}
              </p>
            );
          })}
        </section>
      ) : (
        <section className="prose prose-neutral max-w-none">
          <p className="text-black/60">
            {uiLocale === "tr" ? "İçerik yükleniyor…" : "Loading content…"}
          </p>
        </section>
      )}

      <AboutShowcase className="mt-10 sm:mt-12 md:mt-14 lg:mt-16" />
    </main>
  );
}
