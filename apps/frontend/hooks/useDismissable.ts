// apps/frontend/hooks/useDismissable.ts
import { useEffect } from "react";

export function useDismissable<T extends HTMLElement>(
  open: boolean,
  close: () => void,
  ref?: React.RefObject<T | null>
) {
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      const el = ref?.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) close();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref]);
}
