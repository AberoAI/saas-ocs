// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1800px] px-6 py-12 md:py-16">
        {/* Showcase container dengan clip-path */}
        <div
          className="relative w-full h-[600px] md:h-[680px] lg:h-[720px] overflow-hidden 
          bg-gradient-to-b from-[#C1EEFF] via-[#DBF8EF]/50 to-[#EDF6FF]/50 rounded-[48px]"
          style={{
            clipPath:
              "path('M0 77C0 34.4741 34.4741 0 77 0H1805C1847.53 0 1882 34.4741 1882 77V820.5C1882 863.026 1847.53 897.5 1805 897.5H1598.25C1561.11 897.5 1531 927.609 1531 964.75C1531 1001.89 1500.89 1032 1463.75 1032H77C34.4741 1032 0 997.526 0 955V77Z')",
          }}
        >
          {/* Isi showcase opsional */}
          <div className="absolute bottom-5 left-8 text-[13px] text-black/60">
            Live chat powered by <span className="font-semibold text-[#26658C]">AberoAI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
