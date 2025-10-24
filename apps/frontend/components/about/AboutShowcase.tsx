import React, { useId } from "react";

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
  const uid = useId();
  const clipId = `about-clip-${uid}`;
  const gradId = `about-gradient-${uid}`;

  return (
    <section
      id="about"
      // Pastikan section tidak ikut kebatas container global
      className={`bg-white w-full !max-w-none !mx-0 ${className}`}
    >
      {/* FULL-BLEED terkendali + guard untuk grid/flex parent */}
      <div
        className="
          relative w-screen left-1/2 -ml-[50vw]
          px-[var(--gutter,10px)] sm:[--gutter:14px] md:[--gutter:18px] lg:[--gutter:22px]
          py-10 md:py-14
          col-span-full self-stretch !max-w-none !mx-0
        "
      >
        {/* Kartu gradient: jangan dibatasi/di-center oleh parent */}
        <div
          className="
            relative block w-full
            !max-w-none !mx-0
            h-[clamp(260px,40vh,520px)]
            rounded-[22px] md:rounded-[26px] lg:rounded-[28px]
            overflow-hidden
          "
        >
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

              {/* Light */}
              <linearGradient id={gradId} x1="941" y1="-16.7" x2="941" y2="1032" gradientUnits="userSpaceOnUse">
                <stop offset="0.043" stopColor="#C1EEFF" />
                <stop offset="0.671" stopColor="#DBF8EF" stopOpacity="0.5" />
                <stop offset="1" stopColor="#EDF6FF" stopOpacity="0.5" />
              </linearGradient>
              {/* Dark halus */}
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

          {showLabel && (
            <div className="absolute bottom-3 left-4 text-[12px] text-black/60 dark:text-black/70">
              {label}{" "}
              <span className="font-semibold" style={{ color: "var(--brand, #26658C)" }}>
                AberoAI
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
