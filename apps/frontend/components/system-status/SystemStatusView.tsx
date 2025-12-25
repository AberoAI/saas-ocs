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
      style={{
        position: "fixed",
        inset: 0,
        background: SYSTEM_STATUS_COLORS.background,
        display: "grid",
        placeItems: "center",
      }}
    >
      {/* DEBUG MARKER: kalau ini tidak terlihat, berarti bukan build terbaru */}
      <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          fontSize: 12,
          opacity: 0.5,
        }}
      >
        centered-debug-v3
      </div>

      <section className="w-full max-w-3xl px-6 text-center">
        <h1
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ color: SYSTEM_STATUS_COLORS.headline }}
        >
          {copy.headline}
        </h1>

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
      </section>
    </main>
  );
}
