// apps/frontend/components/about/AboutShowcase.tsx
import React, { useId } from "react";
// (opsional) import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  showLabel?: boolean;
  label?: string;
};

export default function AboutShowcase({
  className = "",
  showLabel = true,
  label = "Live chat powered by",
}: Props) {
  // Hindari bentrok ID antar instance
  const uid = useId();
  const clipId = `about-clip-${uid}`;
  const gradId = `about-gradient-${uid}`;

  // const t = useTranslations(); // kalau mau i18n: label = t("about.poweredBy")

  return (
    <section id="about" className={`bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Gunakan aspect ratio agar bentuk path selalu konsisten.
           Tinggi responsif via clamp menjaga estetika di berbagai viewport */}
        <div className="relative w-full aspect-[1882/1032] h-[clamp(280px,45vh,600px)] md:h-[clamp(360px,52vh,680px)] lg:h-[clamp(420px,56vh,720px)]">
          <svg
            viewBox="0 0 1882 1032"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <path d="M0 77C0 34.4741 34.4741 0 77 0H1805C1847.53 0 1882 34.4741 1882 77V820.5C1882 863.026 1847.53 897.5 1805 897.5H1598.25C1561.11 897.5 1531 927.609 1531 964.75C1531 1001.89 1500.89 1032 1463.75 1032H923H77C34.4741 1032 0 997.526 0 955V501.575V77Z" />
              </clipPath>

              {/* Gradient: light & dark tone selaras brand */}
              <linearGradient id={gradId} x1="941" y1="-16.7023" x2="941" y2="1032" gradientUnits="userSpaceOnUse">
                <stop offset="0.043258" stopColor="#C1EEFF" />
                <stop offset="0.670535" stopColor="#DBF8EF" stopOpacity="0.5" />
                <stop offset="1" stopColor="#EDF6FF" stopOpacity="0.5" />
              </linearGradient>
              {/* Dark mode overlay (opsional, halus saja) */}
              <linearGradient id={`${gradId}-dark`} x1="941" y1="-16.7" x2="941" y2="1032" gradientUnits="userSpaceOnUse">
                <stop offset="0.04" stopColor="#9ED8F0" />
                <stop offset="0.67" stopColor="#CFEDE6" stopOpacity="0.5" />
                <stop offset="1" stopColor="#DDE9F7" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Rect di-clip oleh path */}
            <rect x="0" y="0" width="1882" height="1032" className="dark:hidden" fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />
            <rect x="0" y="0" width="1882" height="1032" className="hidden dark:block" fill={`url(#${gradId}-dark)`} clipPath={`url(#${clipId})`} />
          </svg>

          {/* Label opsional + i18n-ready + brand token */}
          {showLabel && (
            <div className="absolute bottom-4 left-5 text-[12px] text-black/60 dark:text-black/70">
              {label}{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--brand, #26658C)" }}
                // Atur --brand di globals.css agar konsisten di seluruh app
              >
                AberoAI
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
