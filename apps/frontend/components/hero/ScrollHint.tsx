"use client";

import { memo, useCallback, useMemo } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { Inter } from "next/font/google";
import { useLocale } from "next-intl";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"], // clean & consistent typography
});

type ScrollHintProps = {
  targetId?: string;
  className?: string;
};

function ScrollHintBase({ targetId, className = "" }: ScrollHintProps) {
  const rawLocale = useLocale() || "en";
  const locale = rawLocale.toLowerCase();
  const reduceMotion = useReducedMotion();

  // Centralized label map
  const labelMap: Record<string, string> = {
    en: "Scroll",
    tr: "Aşağı kaydır",
    fr: "Faites défiler",
    id: "Gulir ke bawah",
  };

  const label = useMemo(() => labelMap[locale] ?? labelMap.en, [locale]);

  const ariaLabel = useMemo(() => {
    if (!targetId) return label;
    switch (locale) {
      case "tr":
        return "Bir sonraki bölüme aşağı kaydır";
      case "fr":
        return "Faites défiler jusqu'à la section suivante";
      case "id":
        return "Gulir ke bagian berikutnya";
      default:
        return "Scroll to next section";
    }
  }, [label, locale, targetId]);

  const handleClick = useCallback(() => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;

    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [targetId, reduceMotion]);

  // 🎯 Only bounce loop here — no initial delay/fade (diatur parent)
  const animate = reduceMotion ? { y: 0 } : { y: [0, -4, 0] };

  const transition: Transition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 1.4,
        ease: [0.45, 0, 0.55, 1],
        repeat: Infinity,
        repeatType: "mirror",
      };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={[
        "inline-flex items-center justify-center gap-2",
        "text-black/60 transition duration-200",
        "hover:text-[#26658C] hover:drop-shadow-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26658C]/30",
        "rounded-md select-none",
        inter.className,
        className,
      ].join(" ")}
      animate={animate}
      transition={transition}
      aria-label={ariaLabel}
      role="button"
    >
      <span className="tracking-wide text-[10px] md:text-[12px] leading-none">
        {label}
      </span>
      <svg
        className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] opacity-80"
        viewBox="0 0 24 24"
        fill="none"
        role="presentation"
        aria-hidden="true"
      >
        <path
          d="M12 5v12M12 17l-4-4M12 17l4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

const ScrollHint = memo(ScrollHintBase);
ScrollHint.displayName = "ScrollHint";

export default ScrollHint;
