"use client";

import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDismissable } from "@/hooks/useDismissable";

const UI_LOCALE_COOKIE = "ui-locale";

function setUiLocaleCookie(lc: "en" | "tr") {
  document.cookie = `${UI_LOCALE_COOKIE}=${lc}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function LocaleDropdown() {
  const cur = (useLocale() || "en").toLowerCase() as "en" | "tr";
  const choices = (["en", "tr"] as const).filter((x) => x !== cur);
  const label = cur.toUpperCase() as "EN" | "TR";

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  useDismissable(open, () => setOpen(false), menuRef);

  const switchLang = (to: "en" | "tr") => {
    setUiLocaleCookie(to);
    router.refresh(); // SSR akan baca cookie dan ganti teks
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="bg-transparent border-0 p-0 m-0"
      >
        <span className="text-xs font-medium uppercase text-foreground/60 hover:text-foreground">
          {label}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Change language"
          className="absolute left-0 top-full mt-2 min-w-[64px] rounded-md border border-black/10 bg-white p-1 shadow-md z-20"
        >
          <ul>
            {choices.map((lc) => (
              <li key={lc}>
                <button
                  role="menuitem"
                  className="block w-full rounded-[6px] px-2 py-1.5 text-xs font-medium uppercase text-foreground/70 hover:bg-black/5 hover:text-foreground text-left"
                  onClick={() => switchLang(lc)}
                >
                  {lc.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
