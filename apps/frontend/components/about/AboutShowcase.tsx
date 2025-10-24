// apps/frontend/components/about/AboutShowcase.tsx
"use client";

import * as React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function AboutShowcase({ className = "", children }: Props) {
  const gradId = React.useId(); // supaya id gradient unik di setiap instance

  return (
    <section
      className={[
        "relative mx-auto w-full max-w-[1440px] overflow-hidden",
        className,
      ].join(" ")}
    >
      <div className="aspect-[1882/1032]">
        <svg
          className="block h-full w-full"
          viewBox="0 0 1882 1032"
          preserveAspectRatio="xMidYMid slice"
          shapeRendering="geometricPrecision"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={gradId}
              x1="937"
              y1="-16.7023"
              x2="937"
              y2="1032"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.043258" stopColor="#C1EEFF" />
              <stop offset="0.670535" stopColor="#DBF8EF" stopOpacity="0.5" />
              <stop offset="1" stopColor="#EDF6FF" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <path
            d="M0 45C0 20.1472 20.1472 0 45 0H1837C1861.85 0 1882 20.1472 1882 45V836.5C1882 861.353 1861.85 881.5 1837 881.5H1487C1462.15 881.5 1442 901.647 1442 926.5V987C1442 1011.85 1421.85 1032 1397 1032H923H45C20.1472 1032 0 1011.85 0 987V501.575V45Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      </div>

      {/* Konten showcase di atas background */}
      <div className="pointer-events-none absolute inset-0">{children}</div>
    </section>
  );
}
