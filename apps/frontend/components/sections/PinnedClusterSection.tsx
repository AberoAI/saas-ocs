// apps/frontend/components/sections/PinnedClusterSection.tsx
"use client";

import { useReducedMotion } from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";

export type PinnedStep = {
  id: string;
  label: string;
  title: string;
  body: string;
  bullets?: string[];
};

type PinnedClusterSectionProps = {
  sectionId?: string;
};

/**
 * PinnedClusterSection
 *
 * Versi ini sesuai permintaan:
 * - Hanya menampilkan "case" (AboutShowcase) sebagai blok besar.
 * - Tanpa teks layer, tanpa bullets, tanpa judul tambahan di dalam case.
 * - Normal mode: case berada di dalam sticky section (rasa pinned, tapi konten kosong).
 * - Reduced motion: case statis, non-sticky.
 */
export default function PinnedClusterSection({
  sectionId = "page-1",
}: PinnedClusterSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  // Reduced motion → tampilkan case secara statis
  if (prefersReducedMotion) {
    return (
      <section
        id={sectionId}
        className="relative bg-white py-16 md:py-20"
      >
        <div className="mt-6 mx-auto max-w-6xl px-4 lg:px-6">
          <AboutShowcase aria-label="AberoAI overview">
            <div className="px-4 md:px-8 py-8 min-h-[260px] md:min-h-[320px] lg:min-h-[360px]" />
          </AboutShowcase>
        </div>
      </section>
    );
  }

  // Normal mode → case berada di dalam cluster sticky
  return (
    <section
      id={sectionId}
      className="relative bg-white h-[220vh]"
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
          <AboutShowcase
            aria-label="AberoAI overview"
            className="mt-6"
          >
            <div className="px-4 md:px-8 py-8 min-h-[260px] md:min-h-[320px] lg:min-h-[360px]" />
          </AboutShowcase>
        </div>
      </div>
    </section>
  );
}
