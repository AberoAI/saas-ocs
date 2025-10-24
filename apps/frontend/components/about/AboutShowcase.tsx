// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1800px] px-6 py-12 md:py-16">
        {/* Wrapper utama */}
        <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-b from-[#C1EEFF] via-[#DBF8EF]/50 to-[#EDF6FF]/50 w-full aspect-[1.82/1] shadow-sm">
          {/* Bagian kanan bawah dengan radius lembut */}
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-white rounded-tl-[48px]" />

          {/* Label teks contoh */}
          <div className="absolute bottom-4 left-6 text-[12px] text-black/50">
            Live chat powered by AberoAI
          </div>
        </div>
      </div>
    </section>
  );
}
