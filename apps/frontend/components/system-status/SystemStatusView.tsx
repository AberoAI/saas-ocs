//apps/frontend/components/system-status/SystemStatusView.tsx

import { SYSTEM_STATUS_COLORS } from "./copy";

type Copy = {
  headline: string;
  subheadline: string;
  body: string;
};

export default function SystemStatusView({ copy }: { copy: Copy }) {
  return (
    <main
      className="fixed inset-0 flex items-center justify-center w-full"
      style={{ background: SYSTEM_STATUS_COLORS.background }}
    >
      {/* 
        IMPORTANT:
        - Gunakan <div>, BUKAN <section>
        - Menghindari global CSS:
          section { min-block-size: 100svh; }
        - Ini penyebab utama konten selalu terdorong ke atas
      */}
      <div className="w-full max-w-3xl px-6 text-center">
        <h1
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ color: SYSTEM_STATUS_COLORS.headline }}
        >
          {copy.headline}
        </h1>

        {/* Subheadline dinaikkan +2px */}
        <p
          className="mt-4 text-[18px] leading-relaxed sm:text-[20px]"
          style={{ color: SYSTEM_STATUS_COLORS.text }}
        >
          {copy.subheadline}
        </p>

        <p
          className="mt-3 text-base leading-relaxed whitespace-pre-line"
          style={{ color: SYSTEM_STATUS_COLORS.text }}
        >
          {copy.body}
        </p>
      </div>
    </main>
  );
}
