// apps/frontend/components/landingpage/animations/Page6BubbleTagShowcase.tsx
"use client";

type Page6BubbleTagShowcaseProps = {
  lines: string[];
  className?: string; // untuk posisi absolute
};

export default function Page6BubbleTagShowcase({
  lines,
  className = "",
}: Page6BubbleTagShowcaseProps) {
  return (
    <div className={`absolute ${className}`}>
      {/* Shadow bubble (blur) - behind image */}
      <div className="absolute inset-0 z-10 rounded-[14px] bg-[#D0C9C9] blur-[8px] opacity-60 translate-y-2 translate-x-1" />

      {/* Main bubble (sharp) - in front of image */}
      <div className="relative z-30 inline-block rounded-[14px] bg-white/98 px-4 py-3 border-[0.5px] border-[#757575]/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-2">
          <span className="text-[11px] md:text-[13px] leading-relaxed text-slate-700 translate-y-[0.12em]">
            •
          </span>
          <div className="text-[11px] md:text-[13px] leading-relaxed text-slate-700">
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
