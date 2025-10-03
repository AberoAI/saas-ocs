"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Engine scroll multi-step untuk viewport sticky. Dipakai ulang lintas halaman. */
type UseStepScrollOpts = {
  totalSteps: number;
  reduceMotion?: boolean;         // dari useReducedMotion()
  enabled?: boolean;              // default true
  viewportStickySelector?: string; // default containerRef.current
};

export function useStepScroll(opts: UseStepScrollOpts) {
  const {
    totalSteps,
    reduceMotion = false,
    enabled = true,
    viewportStickySelector,
  } = opts;

  // ===== Constants & easing (hanya di hook)
  const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const cubicBezierY = (p0y: number, p1y: number) => (t: number) => {
    const u = 1 - t;
    return 3 * u * u * t * p0y + 3 * u * t * t * p1y + t * t * t;
  };
  const easeFn = cubicBezierY(EASE[1], EASE[3]);

  const getVVH = (): number =>
    typeof window === "undefined" ? 0 : (window.visualViewport?.height ?? window.innerHeight);

  const isEditable = (el: EventTarget | null): boolean => {
    const node = el as HTMLElement | null;
    if (!node) return false;
    const tag = node.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    let cur: HTMLElement | null = node;
    while (cur) {
      if (cur.getAttribute?.("contenteditable") === "true") return true;
      cur = cur.parentElement;
    }
    return false;
  };
  const isInteractive = (el: EventTarget | null): boolean => {
    const node = el as HTMLElement | null;
    if (!node) return false;
    const tag = node.tagName?.toLowerCase();
    if (["a", "button", "summary", "details"].includes(tag)) return true;
    if (node.getAttribute?.("role") === "button") return true;
    return isEditable(node);
  };
  const canScrollWithin = (target: EventTarget | null): boolean => {
    let cur = target as HTMLElement | null;
    let depth = 0;
    while (cur && depth++ < 12) {
      if (cur.dataset?.nativeScroll === "true") return true;
      if (cur.getAttribute?.("role") === "dialog") return true;
      const style = typeof window !== "undefined" ? window.getComputedStyle(cur) : null;
      const oy = style?.overflowY;
      const canScrollY = !!style && (oy === "auto" || oy === "scroll") && cur.scrollHeight > cur.clientHeight;
      if (canScrollY) return true;
      cur = cur.parentElement;
    }
    return false;
  };
  const normalizeWheelDelta = (e: WheelEvent, vhPx: number) => {
    if (e.deltaMode === 1) return e.deltaY * 16;      // line → px approx
    if (e.deltaMode === 2) return e.deltaY * vhPx;    // page → 1vh
    return e.deltaY;                                   // already px
  };

  // ===== Refs & state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [step, _setStep] = useState(0);
  const stepRef = useRef(0);
  const setStep = useCallback((v: number) => {
    stepRef.current = v;
    _setStep(v);
  }, []);

  const modeRef = useRef<"idle" | "gesturing" | "animating">("idle");
  const ignoreScrollUntilRef = useRef(0);
  const lastDirRef = useRef<1 | -1 | 0>(0);
  const lastChangeAtRef = useRef(0);

  const containerTopRef = useRef(0);
  const viewportHRef = useRef(0);

  const wheelAccRef = useRef(0);
  const gestureTimerRef = useRef<number | null>(null);

  const animRef = useRef<number | null>(null);
  const cancelAnim = useCallback(() => {
    if (animRef.current != null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  // ===== Geometry recalc
  const recalc = useCallback(() => {
    if (typeof window === "undefined") return;
    const root = containerRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    containerTopRef.current = window.scrollY + rect.top;
    const h = getVVH();
    viewportHRef.current = h;
    root.style.setProperty("--vvh", `${h}px`);
  }, []);

  // Recalc before first paint (hindari jump 1 frame)
  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    recalc();
  }, [enabled, recalc]);

  // Recalc on resize/viewport/orientation
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    recalc();

    const ctrl = new AbortController();
    const { signal } = ctrl;

    window.addEventListener("resize", recalc, { passive: true, signal });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", recalc, { signal });
      window.visualViewport.addEventListener("scroll", recalc, { signal });
    }

    window.addEventListener("orientationchange", recalc, { passive: true, signal });

    return () => ctrl.abort();
  }, [enabled, recalc]);

  // ===== Helpers
  const vh = useCallback(() => viewportHRef.current || getVVH() || 1, []);
  const inViewport = useCallback(() => {
    if (typeof window === "undefined") return false;
    const root = containerRef.current;
    if (!root) return false;
    const rect = root.getBoundingClientRect();
    const h = getVVH();
    return rect.top < h * 0.85 && rect.bottom > h * 0.15;
  }, []);
  const getHystPx = useCallback(() => {
    const base = vh() * 0.18;
    return Math.min(base || 120, 140) || 120;
  }, [vh]);

  // ===== Scroll animation to a step index
  const animateTo = useCallback(
    (to: number, duration = 420) => {
      if (typeof window === "undefined") return;

      cancelAnim();

      const start = window.scrollY;
      const dist = to - start;
      if (Math.abs(dist) < 1) {
        window.scrollTo({ top: to, behavior: "auto" });
        lastChangeAtRef.current = performance.now();
        ignoreScrollUntilRef.current = performance.now() + 120;
        modeRef.current = "idle";
        return;
      }

      modeRef.current = "animating";
      const t0 = performance.now();
      const d = Math.max(0, reduceMotion ? 0 : duration);

      const tick = (now: number) => {
        const p = d === 0 ? 1 : Math.min(1, (now - t0) / d);
        const eased = reduceMotion ? p : easeFn(p);
        const y = start + dist * eased;
        window.scrollTo({ top: y, behavior: "auto" });

        if (p < 1 && modeRef.current === "animating") {
          animRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = null;
          window.scrollTo({ top: to, behavior: "auto" }); // align
          lastChangeAtRef.current = performance.now();
          ignoreScrollUntilRef.current = performance.now() + 160;
          setTimeout(() => {
            if (modeRef.current === "animating") modeRef.current = "idle";
          }, 60);
        }
      };

      animRef.current = requestAnimationFrame(tick);
    },
    [cancelAnim, reduceMotion]
  );

  const scrollToStep = useCallback(
    (next: number, dir: 1 | -1) => {
      const top = containerTopRef.current + next * vh();
      setStep(next);
      lastDirRef.current = dir;
      lastChangeAtRef.current = typeof performance !== "undefined" ? performance.now() : 0;
      animateTo(top, reduceMotion ? 0 : 420);
    },
    [setStep, vh, animateTo, reduceMotion]
  );

  // ===== Interception: wheel/touch/key
  useEffect(() => {
    if (!enabled || reduceMotion || typeof window === "undefined") return;
    const root = (viewportStickySelector
      ? (document.querySelector(viewportStickySelector) as HTMLDivElement | null)
      : containerRef.current) as HTMLDivElement | null;
    if (!root) return;

    const ctrl = new AbortController();
    const { signal } = ctrl;

    const endGestureSoon = () => {
      if (gestureTimerRef.current) window.clearTimeout(gestureTimerRef.current);
      gestureTimerRef.current = window.setTimeout(() => {
        if (modeRef.current === "gesturing") modeRef.current = "idle";
        gestureTimerRef.current = null;
        wheelAccRef.current = 0;
      }, 180);
    };

    const go = (dir: 1 | -1) => {
      if (modeRef.current === "animating") return;
      const next = Math.max(0, Math.min(totalSteps - 1, stepRef.current + dir));
      if (next !== stepRef.current) {
        wheelAccRef.current = 0;
        modeRef.current = "animating";
        scrollToStep(next, dir);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!inViewport()) return;
      if (modeRef.current === "animating") return;
      if (e.ctrlKey || isEditable(e.target) || isInteractive(e.target)) return;
      if (canScrollWithin(e.target)) return;

      e.preventDefault();
      modeRef.current = "gesturing";
      endGestureSoon();

      const delta = normalizeWheelDelta(e, vh());
      if (Math.sign(delta) !== Math.sign(wheelAccRef.current)) wheelAccRef.current = 0;
      wheelAccRef.current += delta;

      const threshold = Math.max(60, Math.min(180, vh() * 0.09));
      if (Math.abs(wheelAccRef.current) >= threshold) {
        const dir: 1 | -1 = wheelAccRef.current > 0 ? 1 : -1;
        go(dir);
      }
    };

    // Touch
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!inViewport()) return;
      if (isEditable(e.target) || isInteractive(e.target)) return;
      startY = e.touches[0].clientY;
      cancelAnim();
      modeRef.current = "gesturing";
      endGestureSoon();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inViewport()) return;
      if (modeRef.current === "animating") return;
      if (isEditable(e.target) || isInteractive(e.target)) return;
      if (canScrollWithin(e.target)) return;

      const delta = startY - e.touches[0].clientY;
      const thresh = Math.max(26, vh() * 0.03);
      if (Math.abs(delta) < thresh) return;
      e.preventDefault();
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      startY = e.touches[0].clientY;
      endGestureSoon();
      go(dir);
    };
    const onTouchEnd = () => endGestureSoon();

    // Keyboard
    const onKey = (e: KeyboardEvent) => {
      if (!inViewport()) return;
      if (modeRef.current === "animating") return;
      if (isEditable(e.target) || isInteractive(e.target)) return;

      let dir: 1 | -1 | 0 | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) dir = -1;
      else if (e.key === "Home") dir = 0;
      else if (e.key === "End") dir = 0;
      else return;

      e.preventDefault();
      if (dir === 0) {
        const next = e.key === "Home" ? 0 : totalSteps - 1;
        if (next !== stepRef.current) {
          modeRef.current = "animating";
          scrollToStep(next, (lastDirRef.current || 1) as 1 | -1);
        }
        return;
      }
      modeRef.current = "gesturing";
      endGestureSoon();
      scrollToStep(Math.max(0, Math.min(totalSteps - 1, stepRef.current + (dir as 1 | -1))), dir as 1 | -1);
    };

    root.addEventListener("wheel", onWheel, { passive: false, signal });
    root.addEventListener("touchstart", onTouchStart, { passive: true, signal });
    root.addEventListener("touchmove", onTouchMove, { passive: false, signal });
    root.addEventListener("touchend", onTouchEnd, { passive: true, signal });
    window.addEventListener("keydown", onKey, { signal });

    return () => ctrl.abort();
  }, [enabled, reduceMotion, totalSteps, inViewport, scrollToStep, cancelAnim, vh, viewportStickySelector]);

  // Sync saat drag scrollbar (tanpa snap otomatis)
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || reduceMotion) return;

    const ctrl = new AbortController();
    const { signal } = ctrl;

    const onScroll = () => {
      if (!inViewport()) return;
      if (modeRef.current === "animating") return;

      const now = performance.now();
      if (now < ignoreScrollUntilRef.current) return;

      const pos = window.scrollY - containerTopRef.current;
      const h = vh();
      const progress = pos / (h || 1);
      const targetIdx = Math.round(progress);
      const distPx = Math.abs(progress - stepRef.current) * h;

      if (
        targetIdx !== stepRef.current &&
        Math.abs(progress - stepRef.current) > 0.55 &&
        distPx > getHystPx()
      ) {
        const dir: 1 | -1 = targetIdx > stepRef.current ? 1 : -1;
        lastDirRef.current = dir;
        lastChangeAtRef.current = now;
        setStep(Math.max(0, Math.min(totalSteps - 1, targetIdx)));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true, signal });
    return () => ctrl.abort();
  }, [enabled, reduceMotion, totalSteps, inViewport, setStep, vh, getHystPx]);

  return { containerRef, step, setStep };
}

export default useStepScroll;
