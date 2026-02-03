//apps/frontend/components/landingpage/animations/Page2DashboardShowCase.tsx
"use client";

import * as React from "react";
import { useLocale } from "next-intl";

export default function Page2DashboardShowCase() {
  const locale = useLocale();
  const isTr = locale === "tr";

  // Default ke EN untuk locale lain (stabil)
  const src = isTr
    ? "/icons/page2/dashboard_tr.svg"
    : "/icons/page2/dashboard_en.svg";

  return (
    <div className="w-full">
      {/* Keep it centered and responsive; sized down 2x without transform blur */}
      <div className="mx-auto w-full max-w-3xl overflow-visible">
        <div className="dashboard-showcase relative">
          <img
            src={src}
            alt="AberoAI Dashboard Showcase"
            className="relative z-10 h-auto w-full select-none"
            draggable={false}
            loading="eager"
          />
        </div>
      </div>

      <style jsx>{`
        .dashboard-showcase::before {
          content: "";
          position: absolute;

          /* 50% bigger than current:
             150% total size => extend 25% on each side */
          inset: -25%;

          background-image: url("/icons/page2/background.svg");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 1;
          z-index: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
