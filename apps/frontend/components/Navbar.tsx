// apps/frontend/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";

export default function Navbar() {
  const pathnameRaw = usePathname() || "/";
  const pathname = pathnameRaw.replace(/\/+$/, "") || "/";

  const t = useTranslations();
  const BRAND = "#26658C";
  const CTA_LOGIN_BG = "#F7F7F7";
  const name = "AberoAI";

  // Deteksi prefix locale dari path (mis. /tr, /en)
  const m = pathname.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";

  // Normalisasi trailing slash
  const norm = (p: string) => (p.replace(/\/+$/, "") || "/");

  // withLocale aman: hindari double prefix & dukung slug TR (sementara)
  const withLocale = (href: string) => {
    // eksternal / protokol / anchor tidak diubah
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return href;
    // Jika sudah ber-prefix locale yang sama, biarkan
    if (localePrefix && href.startsWith(`${localePrefix}/`)) return href;

    // Mapping slug per-locale (sementara di sini; idealnya satu sumber kebenaran)
    let localized = href;
    if (localePrefix === "/tr") {
      if (href === "/about") localized = "/hakkinda";
      else if (href === "/features") localized = "/ozellikler";
      else if (href === "/solutions") localized = "/cozumler";
    }
    return `${localePrefix}${localized}` || localePrefix || "/";
  };

  // ganti prefix locale pada path saat ini (untuk switcher EN sederhana)
  const switchLocaleHref = (target: string) => {
    if (localePrefix) return pathname.replace(new RegExp(`^${localePrefix}`), `/${target}`);
    return `/${target}${pathname === "/" ? "" : pathname}`;
  };

  // Label i18n untuk nav
  const links = NAV_LINKS.map((l) => {
    const label = l.key === "contact" ? t("cta.contact") : t(`nav.${l.key}`);
    return { key: l.key, label, href: withLocale(l.href) };
  });

  // Active state aman untuk / dan /tr
  const isActive = (href: string) => {
    const target = norm(href.startsWith("/") ? href : `/${href}`);
    const current = norm(pathname);
    if (target === "/" || target === localePrefix) {
      return current === "/" || current === localePrefix;
    }
    return current === target || current.startsWith(`${target}/`);
  };

  // State dropdown Product
  const [openProduct, setOpenProduct] = useState(false);
  const leaveTimer = useRef<number | null>(null);
  const handleEnter = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setOpenProduct(true);
  };
  const handleLeave = () => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setOpenProduct(false), 120);
  };

  const productActive = isActive(withLocale("/features")) || isActive(withLocale("/solutions"));
  const menuId = "nav-product-menu";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
        {/* KIRI: Brand + Nav */}
        <div className="flex items-center gap-8">
          {/* Brand */}
          <Link href={localePrefix || "/"} className="flex items-center gap-1" aria-label="AberoAI home">
            <Image
              src="/icon.svg"
              alt={name}
              width={32}
              height={32}
              className="object-contain"
              priority
              sizes="32px"
            />
            <span className="text-2xl font-semibold" style={{ color: BRAND }}>
              {name}
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {links.map((l) => {
              // "Product" sebagai dropdown (Features + Solutions)
              if (l.key === "product") {
                return (
                  <div
                    key="product-dropdown"
                    className="relative inline-flex items-center"
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                    onFocus={handleEnter}
                    onBlur={handleLeave}
                  >
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={openProduct}
                      aria-controls={menuId}
                      onClick={() => setOpenProduct((v) => !v)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setOpenProduct(false);
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const first = document.querySelector<HTMLAnchorElement>(`#${menuId} a`);
                          first?.focus();
                        }
                      }}
                      className={[
                        "inline-flex items-center gap-1 text-sm leading-none transition-colors cursor-pointer select-none",
                        productActive || openProduct
                          ? "text-foreground font-medium"
                          : "text-foreground/70 font-normal hover:text-foreground",
                      ].join(" ")}
                    >
                      {t("nav.product")}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className={[
                          "ml-0 h-[1em] w-[1em] shrink-0 align-middle relative top-[0.075em]",
                          "transition-transform duration-150",
                          openProduct ? "rotate-180" : "",
                        ].join(" ")}
                        focusable="false"
                      >
                        <path
                          d="M5.5 7.5L10 12l4.5-4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={openProduct ? 2 : 1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Hover-bridge transparan: cocokkan dengan jarak dropdown (mt-3) */}
                    <div className="absolute left-0 right-0 top-full h-3" aria-hidden="true" />

                    {openProduct && (
                      <div
                        id={menuId}
                        role="menu"
                        className="absolute left-0 top-full mt-3 min-w-[220px] rounded-xl border border-black/10 bg-white p-2 shadow-xl z-10"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setOpenProduct(false);
                        }}
                      >
                        <Link
                          role="menuitem"
                          href={withLocale("/features")}
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground focus:bg-black/5 focus:outline-none"
                        >
                          {t("nav.features")}
                        </Link>
                        <Link
                          role="menuitem"
                          href={withLocale("/solutions")}
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground focus:bg-black/5 focus:outline-none"
                        >
                          {t("nav.solutions")}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              // Default link (About, Pricing, Contact, dll.)
              return (
                <Link
                  key={`${l.href}-${l.label}`}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={[
                    "inline-flex items-center text-sm leading-none transition-colors",
                    isActive(l.href)
                      ? "text-foreground font-medium"
                      : "text-foreground/70 hover:text-foreground",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* KANAN: Locale + Auth */}
        <div className="flex items-center gap-2">
          {/* Locale badge sederhana (contoh: EN) */}
          <Link
            href={switchLocaleHref("en")}
            className="hidden md:inline-flex items-center px-2.5 py-1 text-xs font-medium uppercase text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Switch to English"
          >
            EN
          </Link>

          {/* Log in (BG #F7F7F7 – tanpa shadow, flat) */}
          <Link
            href={withLocale("/login")}
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition"
            style={{ backgroundColor: CTA_LOGIN_BG }}
          >
            {t("nav.signin")}
          </Link>

          {/* Sign in (BG #26658C – solid) */}
          <Link
            href={withLocale("/login")}
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-white transition"
            style={{ backgroundColor: BRAND }}
          >
            {t("cta.signin")}
          </Link>
        </div>
      </div>
    </header>
  );
}
