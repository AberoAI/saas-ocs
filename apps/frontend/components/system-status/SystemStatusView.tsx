//apps/frontend/components/system-status/SystemStatusView.tsx

import Link from "next/link";
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
      {/* Bottom-left: Contact */}
      <div className="fixed bottom-6 left-6 z-50 text-sm">
        <a
          href="mailto:info@aberoai.com"
          className="underline underline-offset-4 hover:opacity-80"
          style={{ color: SYSTEM_STATUS_COLORS.text }}
        >
          info@aberoai.com
        </a>
      </div>

      {/* Bottom-right: Privacy Policy */}
      <div className="fixed bottom-6 right-6 z-50 text-sm">
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:opacity-80"
          style={{ color: SYSTEM_STATUS_COLORS.text }}
        >
          Privacy Policy
        </Link>
      </div>

      {/* 
        IMPORTANT:
        - Gunakan <div>, BUKAN <section>
        - Menghindari global CSS:
          section { min-block-size: 100svh; }
        - Ini penyebab utama konten selalu terdorong ke atas
      */}
      <div className="w-full max-w-3xl px-6 text-center">
        {/* Konsisten spacing antar elemen */}
        <div className="space-y-3">
          <h1
            className="text-[33px] font-semibold tracking-tight sm:text-[39px]"
            style={{ color: SYSTEM_STATUS_COLORS.headline }}
          >
            {copy.headline}
          </h1>

          <p
            className="text-[21px] leading-relaxed sm:text-[23px]"
            style={{ color: SYSTEM_STATUS_COLORS.text }}
          >
            {copy.subheadline}
          </p>

          <p
            className="text-base leading-relaxed whitespace-pre-line"
            style={{ color: "#868889" }}
          >
            {copy.body}
          </p>
        </div>
      </div>
    </main>
  );
}
