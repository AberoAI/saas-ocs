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

  // Locale detection
  const m = pathname.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";

  const norm = (p: string) => (p.replace(/\/+$/, "") || "/");

  // Locale-safe href builder
  const withLocale = (href: string) => {
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return href;
    if (localePrefix && href.startsWith(`${localePrefix}/`)) return href;

    let localized = href;
    if (localePrefix === "/tr") {
      if (href === "/about") localized = "/hakkinda";
      else if (href === "/features") localized = "/ozellikler";
      else if (href === "/solutions") localized = "/cozumler";
    }
    return `${localePrefix}${localized}` || localePrefix || "/";
  };

  const switchLocaleHref = (target: string) => {
    if (localePrefix) return pathname.replace(new RegExp(`^${localePrefix}`), `/${target}`);
    return `/${target}${pathname === "/" ? "" : pathname}`;
  };

  // Build links
  const links = NAV_LINKS.map((l) => {
    const label = l.key === "contact" ? t("cta.contact") : t(`nav.${l.key}`);
    return { key: l.key, label, href: withLocale(l.href) };
  });

  // Active state
  const isActive = (href: string) => {
    const target = norm(href.startsWith("/") ? href : `/${href}`);
    const current = norm(pathname);
    if (target === "/" || target === localePrefix) {
      return current === "/" || current === localePrefix;
    }
    return current === target || current.startsWith(`${target}/`);
  };

  // Dropdown state
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

  const productActive =
    isActive(withLocale("/features")) || isActive(withLocale("/solutions"));
  const menuId = "nav-product-menu";

  // ✅ Helper: seragamkan style item nav (Link & Product)
  const navItemClass = (active: boolean) =>
    [
      "inline-flex items-center text-sm leading-none transition-colors",
      active
        ? "text-foreground font-medium"
        : "text-foreground/70 hover:text-foreground font-normal",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* LEFT: Brand + Nav */}
        <div className="flex items-center gap-8">
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
            <span className="text-2xl font-medium" style={{ color: BRAND }}>
              {name}
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {links.map((l) =>
              l.key === "product" ? (
                <div
                  key="product-dropdown"
                  className="relative inline-flex items-center group"
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
                    // 🔒 Reset UA styles pada button + seragamkan weight
                    className={[
                      "appearance-none bg-transparent p-0 border-0 outline-none cursor-pointer select-none",
                      navItemClass(productActive || openProduct),
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center gap-1">
                      {t("nav.product")}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className={[
                          "h-[1em] w-[1em] shrink-0 align-middle relative top-[0.075em]",
                          "transition-transform duration-150",
                          // caret mengikuti warna teks (redup saat idle)
                          productActive || openProduct
                            ? "text-current"
                            : "text-foreground/70 group-hover:text-foreground",
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
                    </span>
                  </button>

                  {/* Hover bridge */}
                  <div className="absolute left-0 right-0 top-full h-3" aria-hidden="true" />

                  {openProduct && (
                    <div
                      id={menuId}
                      role="menu"
                      className="absolute left-0 top-full mt-3 min-w-[220px] rounded-xl border border-black/10 bg-white p-2 shadow-xl z-10"
                      onKeyDown={(e) => e.key === "Escape" && setOpenProduct(false)}
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
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground focus:outline-none"
                      >
                        {t("nav.solutions")}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={`${l.href}-${l.label}`}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={navItemClass(isActive(l.href))}
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* RIGHT: Locale + Auth */}
        <div className="flex items-center gap-2">
          <Link
            href={switchLocaleHref("en")}
            className="hidden md:inline-flex items-center px-2.5 py-1 text-xs font-medium uppercase text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Switch to English"
          >
            EN
          </Link>

          <Link
            href={withLocale("/login")}
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition"
            style={{ backgroundColor: CTA_LOGIN_BG }}
          >
            {t("nav.signin")}
          </Link>

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
