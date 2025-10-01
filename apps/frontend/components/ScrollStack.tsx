// apps/frontend/components/ScrollStack.tsx
"use client";

import React, {
  useLayoutEffect,
  useRef,
  useCallback,
  useEffect,
  type PropsWithChildren,
} from "react";

// Opsional: aktifkan Lenis kalau di-install
let LenisCtor: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LenisCtor = require("lenis").default ?? require("lenis");
} catch {
  // tidak apa-apa; fallback ke native scroll
}

type VoidFn = () => void;

export const ScrollStackItem: React.FC<
  PropsWithChildren<{ itemClassName?: string }>
> = ({ children, itemClassName = "" }) => (
  <div
    className={[
      "relative w-full rounded-[22px] bg-white/90 border border-white/60",
      "backdrop-blur-md shadow-[0_20px_60px_-18px_rgba(0,0,0,0.18)]",
      itemClassName,
    ].join(" ")}
  >
    {children}
  </div>
);

export type ScrollStackProps = {
  className?: string;

  /** Spasi antar kartu (px) */
  itemDistance?: number;
  /** Skala berkurang per kedalaman (0.03 = 3%) */
  itemScale?: number;
  /** Jarak tumpukan (px) saat pinned */
  itemStackDistance?: number;

  /** Posisi stack relatif viewport; px atau % */
  stackPosition?: number | string;
  /** Posisi akhir transisi scale; px atau % */
  scaleEndPosition?: number | string;

  /** Skala dasar kartu paling depan */
  baseScale?: number;

  /** Rotasi per kedalaman (derajat) */
  rotationAmount?: number;
  /** Blur per kedalaman (px) */
  blurAmount?: number;

  /** Pakai scroll window (true) atau wrapper internal (false) */
  useWindowScroll?: boolean;

  /** Aktifkan smooth scrolling via Lenis jika tersedia */
  enableLenis?: boolean;

  /** Dipanggil saat kartu terakhir sedang “pinned/in-view” */
  onStackComplete?: VoidFn;
};

export const ScrollStack: React.FC<PropsWithChildren<ScrollStackProps>> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "18%",
  scaleEndPosition = "8%",
  baseScale = 0.86,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  enableLenis = true,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lenisRef = useRef<any | null>(null);

  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTRef = useRef<Map<number, { y: number; s: number; r: number; b: number }>>(new Map());
  const doneRef = useRef(false);
  const busyRef = useRef(false);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toPx = useCallback((v: number | string, h: number) => {
    return typeof v === "string" && v.includes("%") ? (parseFloat(v) / 100) * h : Number(v);
  }, []);

  const getScroll = useCallback(() => {
    if (useWindowScroll) {
      return { top: window.scrollY, h: window.innerHeight };
    }
    const el = scrollerRef.current!;
    return { top: el.scrollTop, h: el.clientHeight };
  }, [useWindowScroll]);

  const getOffset = useCallback(
    (el: HTMLElement) => {
      if (useWindowScroll) {
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY;
      }
      return el.offsetTop;
    },
    [useWindowScroll]
  );

  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const prog = (x: number, a: number, b: number) => (a === b ? 1 : clamp01((x - a) / (b - a)));

  const update = useCallback(() => {
    if (!cardsRef.current.length || busyRef.current) return;
    busyRef.current = true;

    const { top, h } = getScroll();
    const stackY = toPx(stackPosition, h);
    const scaleEndY = toPx(scaleEndPosition, h);

    const root = useWindowScroll ? document : scrollerRef.current;
    const endEl = root?.querySelector(".scroll-stack-end") as HTMLElement | null;
    const endTop = endEl ? getOffset(endEl) : 0;

    cardsRef.current.forEach((card, i) => {
      const cardTop = getOffset(card);
      const start = cardTop - stackY - itemStackDistance * i;
      const end = cardTop - scaleEndY;
      const pinStart = start;
      const pinEnd = endTop - h / 2;

      const p = prog(top, start, end);
      const sTarget = baseScale + i * itemScale;
      const s = 1 - p * (1 - sTarget);
      const r = rotationAmount ? i * rotationAmount * p : 0;

      let b = 0;
      if (blurAmount) {
        let topIdx = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jt = getOffset(cardsRef.current[j]!);
          const js = jt - stackY - itemStackDistance * j;
          if (top >= js) topIdx = j;
        }
        if (i < topIdx) b = Math.max(0, (topIdx - i) * blurAmount);
      }

      let y = 0;
      const pinned = top >= pinStart && top <= pinEnd;
      if (pinned) y = top - cardTop + stackY + itemStackDistance * i;
      else if (top > pinEnd) y = pinEnd - cardTop + stackY + itemStackDistance * i;

      const tr = {
        y: Math.round(y * 100) / 100,
        s: Math.round(s * 1000) / 1000,
        r: Math.round(r * 100) / 100,
        b: Math.round(b * 100) / 100,
      };

      const last = lastTRef.current.get(i);
      const changed =
        !last ||
        Math.abs(last.y - tr.y) > 0.1 ||
        Math.abs(last.s - tr.s) > 0.001 ||
        Math.abs(last.r - tr.r) > 0.1 ||
        Math.abs(last.b - tr.b) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${tr.y}px, 0) scale(${tr.s}) rotate(${tr.r}deg)`;
        card.style.filter = tr.b > 0 ? `blur(${tr.b}px)` : "";
        lastTRef.current.set(i, tr);
      }

      // callback saat kartu terakhir pinned
      if (i === cardsRef.current.length - 1) {
        const inView = top >= pinStart && top <= pinEnd;
        if (inView && !doneRef.current) {
          doneRef.current = true;
          onStackComplete?.();
        } else if (!inView && doneRef.current) {
          doneRef.current = false;
        }
      }
    });

    busyRef.current = false;
  }, [
    baseScale,
    blurAmount,
    getOffset,
    getScroll,
    itemScale,
    itemStackDistance,
    onStackComplete,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
    toPx,
    useWindowScroll,
  ]);

  const onScroll = useCallback(() => update(), [update]);

  const setupLenis = useCallback(() => {
    if (!enableLenis || !LenisCtor || prefersReduced) return null;
    if (lenisRef.current) return lenisRef.current;

    if (useWindowScroll) {
      const lenis = new LenisCtor({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });
      lenis.on("scroll", onScroll);
      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
      return lenis;
    }

    const wrapper = scrollerRef.current;
    if (!wrapper) return null;

    const lenis = new LenisCtor({
      wrapper,
      content: wrapper.querySelector(".scroll-stack-inner") as HTMLElement | undefined,
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      normalizeWheel: true,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    });
    lenis.on("scroll", onScroll);
    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;
    return lenis;
  }, [enableLenis, onScroll, prefersReduced, useWindowScroll]);

  useLayoutEffect(() => {
    // Kartu
    const root = useWindowScroll ? document : scrollerRef.current;
    const cards = Array.from(root?.querySelectorAll(".scroll-stack-card") ?? []) as HTMLElement[];
    cardsRef.current = cards;

    // Gaya dasar kartu
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
    });

    // Listener native jika tanpa Lenis
    if (!LenisCtor || !enableLenis || prefersReduced) {
      const handler = () => update();
      const el = useWindowScroll ? window : scrollerRef.current;
      el?.addEventListener("scroll", handler, { passive: true });
      update();

      // resize → update
      const onResize = () => update();
      window.addEventListener("resize", onResize, { passive: true });

      return () => {
        el?.removeEventListener("scroll", handler as any);
        window.removeEventListener("resize", onResize as any);
        cardsRef.current = [];
        lastTRef.current.clear();
        doneRef.current = false;
      };
    }

    // Smooth via Lenis
    setupLenis();
    update();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) {
        lenisRef.current.off?.("scroll", onScroll);
        lenisRef.current.destroy?.();
      }
      lenisRef.current = null;
      cardsRef.current = [];
      lastTRef.current.clear();
      doneRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    enableLenis,
    prefersReduced,
    setupLenis,
    update,
    onScroll,
  ]);

  // Reduced motion → render biasa (tanpa transform)
  if (prefersReduced) {
    return (
      <div className={["relative w-full", className].join(" ")}>
        <div className="relative w-full">
          {children}
          <div className="h-[40vh]" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollerRef}
      className={["relative w-full overflow-visible", className].join(" ")}
      data-window-scroll={useWindowScroll ? "true" : "false"}
    >
      <div className="scroll-stack-inner relative w-full">
        {children}
        {/* spacer agar pin terakhir release mulus */}
        <div className="scroll-stack-end h-[50vh]" />
      </div>
    </div>
  );
};

export default ScrollStack;
