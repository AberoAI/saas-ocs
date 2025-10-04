"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

type AnimationName = "blurIn" | "blurInUp" | "fadeIn" | "fadeInUp";
type SplitBy = "none" | "character" | "word";
type Trigger = "inView" | "mount"; // NEW

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type TextAnimateProps = {
  as?: React.ElementType;
  animation?: AnimationName;
  once?: boolean;
  by?: SplitBy;
  className?: string;
  children: React.ReactNode;
  /** dipanggil setelah animasi selesai (seluruh blok/urutan) */
  onDone?: () => void;
  /** NEW: tentukan pemicu animasi. default: "inView" (scroll). gunakan "mount" untuk hanya saat komponen di-mount. */
  trigger?: Trigger;
};

function getChildVariant(animation: AnimationName) {
  switch (animation) {
    case "blurInUp":
      return {
        hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE_OUT } },
      };
    case "fadeInUp":
      return {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
      };
    case "fadeIn":
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } },
      };
    case "blurIn":
    default:
      return {
        hidden: { opacity: 0, filter: "blur(8px)" },
        show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE_OUT } },
      };
  }
}

export function TextAnimate({
  as,
  animation = "blurIn",
  once = false,
  by = "none",
  className,
  children,
  onDone,
  trigger = "inView", // NEW default
}: TextAnimateProps) {
  const Tag = (as || "span") as React.ElementType;
  const childVar = getChildVariant(animation);

  const isStringChild = typeof children === "string";
  const common = {
    initial: "hidden" as const,
    variants: childVar as Variants,
    onAnimationComplete: () => onDone?.(),
  };

  // Helper untuk memilih prop animate/whileInView
  const triggerProps =
    trigger === "mount"
      ? { animate: "show" as const } // animate sekali saat mount
      : { whileInView: "show" as const, viewport: { once } as const }; // perilaku lama

  if (!isStringChild || by === "none") {
    return (
      <Tag className={className} style={{ textWrap: "balance" } as React.CSSProperties}>
        <motion.span
          {...common}
          {...triggerProps}
          style={{ display: "inline-block" }}
        >
          {children}
        </motion.span>
      </Tag>
    );
  }

  // ====== PRE-PROCESS TEKS ======
  // Ikat frasa kunci TR agar tidak pecah baris: "Güçlü Özellikler" -> "Güçlü&nbsp;Özellikler"
  // (NBSP mencegah break di antara kedua kata tsb, tanpa menyentuh frasa lain)
  const NBSP = "\u00A0";
  let source = String(children).replace(/Güçlü Özellikler/g, `Güçlü${NBSP}Özellikler`);
  // =================================

  // ===== FIX: "by=character" tapi JAGA batas kata agar tidak patah di tengah huruf =====
  // Strategi:
  // - Split ke token kata & spasi: /(\s+)/
  // - Token spasi dirender apa adanya
  // - Setiap KATA dibungkus span inline-block (mencegah line break di dalam kata)
  // - Huruf2 tetap di-animate (inline-block)
  if (by === "character") {
    const tokens = source.split(/(\s+)/);
    const container: Variants = { show: { transition: { staggerChildren: 0.03 } } };

    return (
      <Tag className={className} aria-label={source} style={{ textWrap: "balance" } as React.CSSProperties}>
        <motion.span
          aria-hidden
          initial="hidden"
          variants={container}
          {...(trigger === "mount"
            ? { animate: "show" as const }
            : { whileInView: "show" as const, viewport: { once } as const })}
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          onAnimationComplete={() => onDone?.()}
        >
          {tokens.map((tok, i) => {
            if (/^\s+$/.test(tok)) {
              return <span key={`space-${i}`}>{tok}</span>;
            }
            const chars = [...tok];
            return (
              <span
                key={`word-${i}`}
                style={{
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}
              >
                {chars.map((ch, j) => (
                  <motion.span
                    key={`ch-${i}-${j}`}
                    variants={childVar as Variants}
                    style={{ display: "inline-block" }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </motion.span>
      </Tag>
    );
  }
  // ===== END FIX =====

  if (by === "word") {
    const units = source.split(/(\s+)/);
    const container: Variants = { show: { transition: { staggerChildren: 0.03 } } };

    return (
      <Tag className={className} aria-label={source} style={{ textWrap: "balance" } as React.CSSProperties}>
        <motion.span
          aria-hidden
          initial="hidden"
          variants={container}
          {...(trigger === "mount"
            ? { animate: "show" as const }
            : { whileInView: "show" as const, viewport: { once } as const })}
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          onAnimationComplete={() => onDone?.()}
        >
          {units.map((u, i) =>
            /^\s+$/.test(u) ? (
              <span key={i}>{u}</span>
            ) : (
              <motion.span key={i} variants={childVar as Variants} style={{ display: "inline-block" }}>
                {u}
              </motion.span>
            )
          )}
        </motion.span>
      </Tag>
    );
  }

  // Fallback (by: "none" sudah ditangani di atas, ini praktis tidak terpakai)
  return (
    <Tag className={className} style={{ textWrap: "balance" } as React.CSSProperties}>
      <motion.span
        {...common}
        {...triggerProps}
        style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      >
        {source}
      </motion.span>
    </Tag>
  );
}

export default TextAnimate;
