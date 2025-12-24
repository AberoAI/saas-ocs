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
      className="min-h-screen w-full"
      style={{ background: SYSTEM_STATUS_COLORS.background }}
    >
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <section className="w-full">
          <h1
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: SYSTEM_STATUS_COLORS.headline }}
          >
            {copy.headline}
          </h1>

          <p
            className="mt-4 text-base leading-relaxed sm:text-lg"
            style={{ color: SYSTEM_STATUS_COLORS.text }}
          >
            {copy.subheadline}
          </p>

          <p
            className="mt-3 text-base leading-relaxed"
            style={{ color: SYSTEM_STATUS_COLORS.text }}
          >
            {copy.body}
          </p>
        </section>
      </div>
    </main>
  );
}
