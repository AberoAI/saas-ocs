// apps/frontend/app/components/site-header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* logo minimal pakai favicon/icon */}
          <div className="size-8 rounded-lg border border-black/10 bg-white/70 p-1">
            <img
              src="/favicon.ico"
              alt="AberoAI"
              className="size-full object-contain"
            />
          </div>
          <span className="text-lg font-semibold">AberoAI</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-black/70 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Sign in
          </Link>
        </nav>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex size-9 items-center justify-center rounded-lg border border-black/10"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* mobile nav sheet */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-black/10 bg-[var(--background)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-black/80"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-2 text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
