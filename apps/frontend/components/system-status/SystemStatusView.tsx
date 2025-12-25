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
      className="w-full min-h-[100svh]"
      style={{ background: SYSTEM_STATUS_COLORS.background }}
    >
      <div className="mx-auto flex min-h-[100svh] max-w-3xl items-center justify-center px-6">
        <section className="w-full text-center">
          <h1
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: SYSTEM_STATUS_COLORS.headline }}
          >
            {copy.headline}
          </h1>

          {/* +2px from previous sizes */}
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
      </div>
    </main>
  );
}
