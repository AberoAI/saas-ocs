// apps/frontend/components/about/AboutShowcase.tsx
"use client";

import * as React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function AboutShowcase({ className = "", children }: Props) {
  const gradId = React.useId(); // agar id gradient unik

  return (
    <section
      className={[
        "relative mx-auto w-full max-w-[1440px] rounded-[48px] overflow-hidden",
        "shadow-[0_12px_40px_rgba(0,0,0,0.12)]",
        className,
      ].join(" ")}
    >
      <div className="aspect-[1882/1032]">
        <svg
          className="h-full w-full block"
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
            d="M0 77C0 34.4741 34.4741 0 77 0H1805C1847.53 0 1882 34.4741 1882 77V758.5C1882 801.026 1847.53 835.5 1805 835.5H1519C1476.47 835.5 1442 869.974 1442 912.5V955C1442 997.526 1407.53 1032 1365 1032H923H77C34.4741 1032 0 997.526 0 955V501.575V77Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      </div>

      {/* Tempatkan showcase content di atas background */}
      <div className="pointer-events-none absolute inset-0">
        {children}
      </div>
    </section>
  );
}
