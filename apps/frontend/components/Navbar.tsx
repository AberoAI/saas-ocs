"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";

function normalizePath(p: string) {
  const url = p.split("#")[0].split("?")[0] || "/";
  if (url.length > 1 && url.endsWith("/")) return url.slice(0, -1);
  return url || "/";
}

export default function Navbar() {
  const t = useTranslations();
  const pathnameRaw = usePathname() || "/";
  const pathname = normalizePath(pathnameRaw);

  const m = pathname.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const locale = m?.[1] || "en";
  const localePrefix = `/${locale}`;

  const links = useMemo(
    () =>
      NAV_LINKS.map((l) => ({
        key: l.key,
        label: l.key === "contact" ? t("cta.contact") : t(`nav.${l.key}`),
        href: l.href,
      })),
    [t]
  );

  const current = pathname;
  const isActive = (href: string) => {
    const target = normalizePath(
      href.startsWith("/") ? `${localePrefix}${href}` : href
    );
    if (target === "/" || target === localePrefix) {
      return current === "/" || current === localePrefix;
    }
    return current === target || current.startsWith(`${target}/`);
  };

  const [openProduct, setOpenProduct] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = () => setOpenProduct(true);
  const handleLeave = () => setOpenProduct(false);

  useEffect(() => {
    if (!openProduct) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpenProduct(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenProduct(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openProduct]);

  const productActive = isActive("/features") || isActive("/solutions");

  const navItemClass = (active: boolean, hoverable: boolean) =>
    [
      "inline-flex items-center text-sm leading-none transition-colors",
      active ? "text-foreground font-medium" : "text-foreground/70 font-normal",
      hoverable ? "hover:text-foreground" : "",
    ].join(" ");

  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!mobileRef.current) return;
      if (!mobileRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div
        className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3.5 md:px-8 lg:px-10"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* LEFT: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1" aria-label="AberoAI home">
            <Image
              src="/icon.svg"
              alt="AberoAI"
              width={32}
              height={32}
              className="object-contain"
              priority={pathname === "/" || pathname === `/${locale}`}
              sizes="32px"
            />
            <span className="text-2xl font-medium text-navbar">
              AberoAI
            </span>
          </Link>
        </div>

        {/* CENTER: Nav (desktop) */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((l) =>
            l.key === "product" ? (
              <div
                key="product-dropdown"
                className="relative inline-flex items-center"
                onPointerEnter={handleEnter}
                onPointerLeave={handleLeave}
                ref={menuRef}
              >
                <button
                  type="button"
                  aria-expanded={openProduct}
                  onClick={() => setOpenProduct((v) => !v)}
                  className="appearance-none bg-transparent p-0 border-0 outline-none cursor-pointer select-none inline-flex items-center"
                >
                  <span
                    className={[
                      "text-sm leading-none",
                      productActive ? "!text-foreground !font-medium" : "!text-foreground/70 !font-normal",
                    ].join(" ")}
                  >
                    {t("nav.product")}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className={[
                      "ml-1 h-[1em] w-[1em] shrink-0 align-middle relative top-[0.075em]",
                      "transition-transform duration-150",
                      productActive ? "text-current" : "text-foreground/70",
                      openProduct ? "rotate-180" : "",
                    ].join(" ")}
                    focusable="false"
                  >
                    <path
                      d="M5.5 7.5L10 12l4.5-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {openProduct && (
                  <div className="absolute left-0 top-full mt-3 min-w-[220px] rounded-xl border border-black/10 bg-white p-2 shadow-xl z-10">
                    <ul className="flex flex-col">
                      <li>
                        <Link
                          href="/features"
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground focus:bg-black/5 focus:outline-none"
                          onClick={() => setOpenProduct(false)}
                        >
                          {t("nav.features")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/solutions"
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground focus:bg-black/5 focus:outline-none"
                          onClick={() => setOpenProduct(false)}
                        >
                          {t("nav.solutions")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={`${l.href}-${l.label}`}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={navItemClass(isActive(l.href), true)}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        {/* RIGHT: Locale + Auth (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          {/* ✅ Type-safe locale switch */}
          <Link
            href="/"
            locale="en"
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium uppercase text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Switch to English"
          >
            EN
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition bg-cta-login-bg"
          >
            {t("nav.signin")}
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-white transition bg-[var(--brand)]"
          >
            {t("cta.signin")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground/80 hover:text-foreground"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div ref={mobileRef} className="md:hidden border-t border-black/10 bg-white">
          <div className="mx-auto max-w-screen-xl px-6 py-3 md:px-8 lg:px-10">
            <nav className="flex flex-col gap-1">
              {links.map((l) =>
                l.key === "product" ? (
                  <details key="m-product" className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-black/5">
                      <span>{t("nav.product")}</span>
                      <span className="transition-transform group-open:rotate-180">
                        <svg viewBox="0 0 20 20" width="16" height="16">
                          <path d="M5.5 7.5L10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="ml-2 mt-1 flex flex-col gap-1">
                      <Link
                        href="/features"
                        className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t("nav.features")}
                      </Link>
                      <Link
                        href="/solutions"
                        className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t("nav.solutions")}
                      </Link>
                    </div>
                  </details>
                ) : (
                  <Link
                    key={`m-${l.href}-${l.label}`}
                    href={l.href}
                    className={navItemClass(isActive(l.href), false) + " rounded-lg px-3 py-2"}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                )
              )}
            </nav>

            <div className="mt-3 flex items-center gap-2">
              <Link
                href="/"
                locale="en"
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Switch to English"
              >
                EN
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition bg-cta-login-bg"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("nav.signin")}
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-white transition bg-[var(--brand)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("cta.signin")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
