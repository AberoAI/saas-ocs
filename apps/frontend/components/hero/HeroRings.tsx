// apps/frontend/components/hero/HeroRings.tsx

"use client";

export default function HeroRings() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex w-full items-center justify-center"
      style={{
        opacity: 0.4, // ↓ Mengurangi keseluruhan opacity menjadi 40% (pengurangan 60%)
        WebkitMaskImage:
          "linear-gradient(to bottom," +
          "rgba(0,0,0,1) 0%," +
          "rgba(0,0,0,1) 68%," +
          "rgba(0,0,0,0.35) 86%," +
          "rgba(0,0,0,0.08) 94%," +
          "rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom," +
          "rgba(0,0,0,1) 0%," +
          "rgba(0,0,0,1) 68%," +
          "rgba(0,0,0,0.35) 86%," +
          "rgba(0,0,0,0.08) 94%," +
          "rgba(0,0,0,0) 100%)",
      }}
    >
      <svg
        viewBox="0 0 576 560"
        role="presentation"
        className="h-[120vh] w-auto max-w-[90vw] xl:h-[140vh]"
      >
        <defs>
          <linearGradient
            id="abero-ring-lg-grad"
            x1="238.5"
            y1="18"
            x2="238.5"
            y2="560"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#64A4ED" stopOpacity="0.85" />
            <stop offset="0.47" stopColor="#37477C" stopOpacity="0.39" />
            <stop offset="0.73" stopColor="#2E3C69" stopOpacity="0.10" />
            <stop offset="0.92" stopColor="#1F2846" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient
            id="abero-ring-sm-grad"
            x1="513"
            y1="0"
            x2="513"
            y2="126"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#64A4ED" stopOpacity="0.85" />
            <stop offset="0.47" stopColor="#37477C" stopOpacity="0.39" />
            <stop offset="0.81" stopColor="#2E3C69" stopOpacity="0.10" />
            <stop offset="1" stopColor="#1F2846" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Ring besar */}
        <path
          d="M238.5 40.5C355.179 40.5 454.5 148.97 454.5 289C454.5 429.03 355.179 537.5 238.5 537.5C121.821 537.5 22.5 429.03 22.5 289C22.5 148.97 121.821 40.5 238.5 40.5Z"
          stroke="url(#abero-ring-lg-grad)"
          strokeOpacity={0.65}
          strokeWidth={45}
          fill="none"
        />

        {/* Ring kecil */}
        <circle
          cx="513"
          cy="63"
          r="53"
          stroke="url(#abero-ring-sm-grad)"
          strokeOpacity={0.6}
          strokeWidth={20}
          fill="none"
        />
      </svg>
    </div>
  );
}
