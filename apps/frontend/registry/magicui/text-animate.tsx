// apps/frontend/components/registry/magicui/text-animate.tsx
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
      <Tag className={className}>
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

  const source = String(children);

  // ===== "by=character" dengan kontrol pemenggalan kata & layout =====
  if (by === "character") {
    const tokens = source.split(/(\s+)/);

    // Container untuk stagger per huruf
    const container: Variants = { show: { transition: { staggerChildren: 0.03 } } };

    // Helper: render satu KATA per karakter (tetap animasi per huruf)
    const renderWord = (word: string, key: React.Key) => {
      const chars = [...word];
      return (
        <span
          key={`word-${key}`}
          style={{
            display: "inline-block", // mencegah line-break di dalam kata
            whiteSpace: "nowrap",
          }}
        >
          {chars.map((ch, j) => (
            <motion.span
              key={`ch-${key}-${j}`}
              variants={childVar as Variants}
              style={{ display: "inline-block" }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      );
    };

    // OUTPUT dengan kontrol khusus TR: pecah sebelum "Güçlü Özellikler"
    const out: React.ReactNode[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];

      // 1) Jika token spasi dan setelahnya "Güçlü Özellikler", ganti spasi tsb dengan <br />
      if (
        /^\s+$/.test(tok) &&
        tokens[i + 1] === "Güçlü" &&
        /^\s+$/.test(tokens[i + 2] || "") &&
        tokens[i + 3] === "Özellikler"
      ) {
        out.push(<br key={`br-tr-${i}`} />);
        continue; // jangan render spasi ini
      }

      // 2) Jika token saat ini adalah "Güçlü" diikuti spasi + "Özellikler",
      //    bungkus KEDUANYA dalam satu inline-block agar tak terpecah lagi.
      if (
        tok === "Güçlü" &&
        /^\s+$/.test(tokens[i + 1] || "") &&
        tokens[i + 2] === "Özellikler"
      ) {
        out.push(
          <span
            key={`phrase-tr-${i}`}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {renderWord("Güçlü", `g-${i}`)}
            {/* spasi biasa di dalam wrapper supaya tetap satu baris */}
            {" "}
            {renderWord("Özellikler", `o-${i + 2}`)}
          </span>
        );
        i += 2; // lewati spasi + "Özellikler"
        continue;
      }

      // Token spasi (default)
      if (/^\s+$/.test(tok)) {
        out.push(<span key={`space-${i}`}>{tok}</span>);
        continue;
      }

      // Token kata biasa (default)
      out.push(renderWord(tok, i));
    }

    return (
      <Tag className={className} aria-label={source}>
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
          {out}
        </motion.span>
      </Tag>
    );
  }
  // ===== END (by="character") =====

  if (by === "word") {
    const units = source.split(/(\s+)/);
    const container: Variants = { show: { transition: { staggerChildren: 0.03 } } };

    return (
      <Tag className={className} aria-label={source}>
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

  // Fallback
  return (
    <Tag className={className}>
      <motion.span
        {...common}
        {...triggerProps}
        style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      >
        {String(children)}
      </motion.span>
    </Tag>
  );
}

export default TextAnimate;
