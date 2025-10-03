"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

type AnimationName = "blurIn" | "blurInUp" | "fadeIn" | "fadeInUp";
type SplitBy = "none" | "character" | "word";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type TextAnimateProps = {
  as?: React.ElementType;
  animation?: AnimationName;
  once?: boolean;
  by?: SplitBy;
  className?: string;
  /** Delay mulai animasi dalam milidetik (opsional) */
  delayMs?: number;
  children: React.ReactNode;
};

function getChildVariant(animation: AnimationName, delaySec = 0) {
  switch (animation) {
    case "blurInUp":
      return {
        hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.45, ease: EASE_OUT, delay: delaySec },
        },
      };
    case "fadeInUp":
      return {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: EASE_OUT, delay: delaySec },
        },
      };
    case "fadeIn":
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT, delay: delaySec } },
      };
    case "blurIn":
    default:
      return {
        hidden: { opacity: 0, filter: "blur(8px)" },
        show: {
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.45, ease: EASE_OUT, delay: delaySec },
        },
      };
  }
}

export function TextAnimate({
  as,
  animation = "blurIn",
  once = false,
  by = "none",
  className,
  delayMs = 0,
  children,
}: TextAnimateProps) {
  const Tag = (as || "span") as React.ElementType;
  const childVar = getChildVariant(animation, Math.max(0, delayMs) / 1000);
  const isStringChild = typeof children === "string";

  if (!isStringChild || by === "none") {
    return (
      <Tag className={className}>
        <motion.span
          initial="hidden"
          whileInView="show"
          viewport={{ once }}
          variants={childVar as Variants}
          style={{ display: "inline-block" }}
        >
          {children}
        </motion.span>
      </Tag>
    );
  }

  const source = String(children);
  const units = by === "word" ? source.split(/(\s+)/) : [...source];
  const container: Variants = { show: { transition: { staggerChildren: 0.03 } } };

  return (
    <Tag className={className} aria-label={source}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once }}
        variants={container}
        style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      >
        {units.map((u, i) => (
          <motion.span key={i} variants={childVar as Variants} style={{ display: "inline-block" }}>
            {u}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

export default TextAnimate;
