//apps/frontend/components/landingpage/animations/Page3AnimatedCubeShowCase.tsx
"use client";

import * as React from "react";

export default function Page3AnimatedCubeShowCase() {
  const rawId = React.useId();
  const filterId = `cubeShadow_${rawId.replace(/:/g, "")}`;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* Added vertical padding + overflow-visible so float animation never gets clipped */}
      <div className="relative overflow-visible pt-8 pb-2">
        {/* SVG inline (NOT <img/>) */}
        <svg
          width="423"
          height="451"
          viewBox="0 0 423 451"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="AberoAI System Cube"
          role="img"
          overflow="visible"
          className="h-auto w-[222px] md:w-[274px] lg:w-[308px]"
        >
          {/* 1) SHADOW */}
          <g className="cube-shadow" filter={`url(#${filterId})`}>
            <path
              d="M208.978 271.032C209.547 270.741 210.22 270.738 210.79 271.026L353.062 342.709C354.528 343.448 354.528 345.542 353.062 346.281L210.79 417.964C210.22 418.251 209.547 418.249 208.978 417.958L69.0982 346.275C67.6477 345.531 67.6477 343.458 69.0982 342.715L208.978 271.032Z"
              fill="black"
              fillOpacity="0.01"
            />
          </g>

          {/* 2) GLOW OUTLINES */}
          <g className="cube-glow">
            <path
              d="M208.573 163.53C209.034 163.264 209.602 163.261 210.064 163.524L418.901 282.203C419.913 282.778 419.913 284.236 418.901 284.811L210.064 403.489C209.602 403.752 209.034 403.75 208.573 403.483L3.24609 284.806C2.24693 284.228 2.24693 282.786 3.24609 282.208L208.573 163.53Z"
              stroke="#FA443E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M208.573 150.429C209.034 150.162 209.602 150.16 210.064 150.423L418.901 269.102C419.913 269.677 419.913 271.134 418.901 271.709L210.064 390.388C209.602 390.651 209.034 390.648 208.573 390.382L3.24609 271.704C2.24693 271.127 2.24693 269.684 3.24609 269.106L208.573 150.429Z"
              stroke="#3EFA7D"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M208.573 137.327C209.034 137.061 209.602 137.058 210.064 137.321L418.901 256C419.913 256.575 419.913 258.032 418.901 258.607L210.064 377.286C209.602 377.549 209.034 377.547 208.573 377.28L3.24609 258.603C2.24693 258.025 2.24693 256.582 3.24609 256.005L208.573 137.327Z"
              stroke="#3E7BFA"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* 3) CUBE BODY (float + tilt via nested group to avoid transform collision) */}
          <g className="cube-body">
            <g className="cube-body__tilt">
              <path
                d="M51.3516 97.1705C51.3516 94.3346 52.853 91.7105 55.298 90.2736L207.016 1.10381C209.538 -0.378356 212.667 -0.365985 215.177 1.13607L364.116 90.2639C366.53 91.7086 368.008 94.3152 368.008 97.1287V272.925C368.008 275.777 366.49 278.413 364.023 279.845L215.085 366.271C212.622 367.701 209.584 367.713 207.109 366.302L55.3903 279.834C52.8933 278.411 51.3516 275.758 51.3516 272.884V97.1705Z"
                fill="#CCDDFF"
              />
              <path
                d="M65.625 105.3C65.625 102.442 67.1499 99.8005 69.6253 98.3715L205.69 19.8227C208.165 18.3938 211.214 18.3938 213.689 19.8227L349.754 98.3715C352.229 99.8005 353.754 102.442 353.754 105.3V262.396C353.754 265.254 352.229 267.896 349.754 269.325L213.689 347.873C211.214 349.302 208.165 349.302 205.69 347.873L69.6253 269.325C67.1499 267.896 65.625 265.254 65.625 262.396V105.3Z"
                fill="#6698FA"
              />
              <path
                d="M208.25 185.177C208.25 179.025 211.776 173.419 217.321 170.755L348.009 107.965C350.664 106.689 353.741 108.624 353.741 111.57V263.807C353.741 266.659 352.223 269.295 349.757 270.726L214.258 349.374C211.591 350.922 208.25 348.998 208.25 345.915L208.25 265.567L208.25 185.177Z"
                fill="#3E7BFA"
              />
              <path
                d="M65.625 108.615C65.625 105.658 68.7215 103.724 71.3787 105.02L201.161 168.327C206.659 171.008 210.147 176.59 210.147 182.707V318.232C210.147 318.232 210.271 329.381 212.832 333.134C215.026 336.351 217.035 337.349 219.674 338.808C222.313 340.268 228.232 341.652 228.232 341.652L214.081 349.063C211.634 350.344 208.699 350.272 206.318 348.874L69.5736 268.563C67.1274 267.126 65.625 264.502 65.625 261.665V108.615Z"
                fill="#3568D4"
              />
            </g>
          </g>

          <defs>
            <filter
              id={filterId}
              x="36.0078"
              y="238.812"
              width="350.156"
              height="211.365"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="16" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.207843 0 0 0 0 0.407843 0 0 0 0 0.831373 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_869_511"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_869_511"
                result="shape"
              />
            </filter>
          </defs>
        </svg>

        {/* subtle label under the cube (dot breathing) */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="system-dot" aria-hidden="true" />
          <span className="font-poppins text-sm text-slate-600">
            AberoAI system
          </span>
        </div>
      </div>

      <style jsx>{`
        /* Keep animations “system-grade”: calm, not flashy */
        svg :global(.cube-body) {
          transform-origin: 50% 52%;
          animation: cubeFloat 2800ms ease-in-out infinite;
        }

        svg :global(.cube-body__tilt) {
          transform-origin: 50% 52%;
          animation: cubeTilt 4200ms ease-in-out infinite;
        }

        svg :global(.cube-shadow) {
          transform-origin: 50% 80%;
          animation: shadowBreath 2800ms ease-in-out infinite;
        }

        svg :global(.cube-glow) {
          transform-origin: 50% 60%;
          animation: glowPulse 1600ms ease-in-out infinite;
        }

        /* Dot breathing (active but calm) */
        .system-dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: #22c55e;
          box-shadow: 0 0 0 rgba(34, 197, 94, 0);
          animation: dotBreath 2800ms ease-in-out infinite;
        }

        @keyframes cubeFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -10px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes cubeTilt {
          0% {
            transform: rotate(1.2deg);
          }
          50% {
            transform: rotate(-1.2deg);
          }
          100% {
            transform: rotate(1.2deg);
          }
        }

        @keyframes shadowBreath {
          0% {
            transform: scale(0.98);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.55;
          }
          100% {
            transform: scale(0.98);
            opacity: 0.35;
          }
        }

        @keyframes glowPulse {
          0% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.62;
          }
          100% {
            opacity: 0.35;
          }
        }

        @keyframes dotBreath {
          0% {
            transform: scale(0.92);
            opacity: 0.7;
            box-shadow: 0 0 0 rgba(34, 197, 94, 0);
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
            box-shadow: 0 0 18px rgba(34, 197, 94, 0.22);
          }
          100% {
            transform: scale(0.92);
            opacity: 0.7;
            box-shadow: 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        /* Respect accessibility */
        @media (prefers-reduced-motion: reduce) {
          svg :global(.cube-body),
          svg :global(.cube-body__tilt),
          svg :global(.cube-shadow),
          svg :global(.cube-glow),
          .system-dot {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
