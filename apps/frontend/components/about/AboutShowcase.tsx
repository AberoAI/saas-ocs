// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Tinggi showcase dikurangi 20% tanpa mengubah proporsi lainnya */}
        <div className="relative w-full h-[460px] md:h-[525px] lg:h-[555px]">
          <svg
            viewBox="0 0 1882 1032"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="about-clip" clipPathUnits="userSpaceOnUse">
                <path d="M0 77C0 34.4741 34.4741 0 77 0H1805C1847.53 0 1882 34.4741 1882 77V820.5C1882 863.026 1847.53 897.5 1805 897.5H1598.25C1561.11 897.5 1531 927.609 1531 964.75C1531 1001.89 1500.89 1032 1463.75 1032H923H77C34.4741 1032 0 997.526 0 955V501.575V77Z" />
              </clipPath>

              <linearGradient id="about-gradient" x1="941" y1="-16.7023" x2="941" y2="1032" gradientUnits="userSpaceOnUse">
                <stop offset="0.043258" stopColor="#C1EEFF" />
                <stop offset="0.670535" stopColor="#DBF8EF" stopOpacity="0.5" />
                <stop offset="1" stopColor="#EDF6FF" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            <rect
              x="0"
              y="0"
              width="1882"
              height="1032"
              fill="url(#about-gradient)"
              clipPath="url(#about-clip)"
            />
          </svg>

          <div className="absolute bottom-4 left-5 text-[12px] text-black/60">
            Live chat powered by{" "}
            <span className="font-semibold text-[#26658C]">AberoAI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
