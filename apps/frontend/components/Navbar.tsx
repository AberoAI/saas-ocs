// apps/frontend/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Navbar() {
  const pathnameRaw = usePathname() || "/";
  const pathname = pathnameRaw.replace(/\/+$/, "") || "/";

  const t = useTranslations();
  const name = "AberoAI";

  // deteksi prefix locale dari path (mis. /tr, /en)
  const m = pathname.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";

  const withLocale = (href: string) => {
    // biarkan href eksternal/anchor
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) {
      return href;
    }
    // ➜ khusus locale TR: About → /hakkinda
    if (localePrefix === "/tr" && href === "/about") return "/tr/hakkinda";
    // ➜ khusus locale TR: Features & Solutions (jika kamu pakai URL lokal)
    if (localePrefix === "/tr" && href === "/features") return "/tr/ozellikler";
    if (localePrefix === "/tr" && href === "/solutions") return "/tr/cozumler";

    return `${localePrefix}${href}`;
  };

  // map key → label i18n
  const links = NAV_LINKS.map((l) => {
    const label = l.key === "contact" ? t("cta.contact") : t(`nav.${l.key}`);
    return { key: l.key, label, href: withLocale(l.href) };
  });

  const isActive = (href: string) => {
    const target = href.replace(/\/+$/, "") || "/";
    if (target === "/" || target === localePrefix) {
      return pathname === "/" || pathname === localePrefix;
    }
    return pathname === target || pathname.startsWith(target + "/");
  };

  // state dropdown Product
  const [openProduct, setOpenProduct] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
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
            />
            <span className="text-2xl font-semibold text-navbar">{name}</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {links.map((l) => {
              // render khusus untuk Product sebagai dropdown
              if (l.key === "product") {
                const activeInProduct =
                  isActive(withLocale("/features")) || isActive(withLocale("/solutions"));
                return (
                  <div
                    key="product-dropdown"
                    className="relative"
                    onMouseEnter={() => setOpenProduct(true)}
                    onMouseLeave={() => setOpenProduct(false)}
                  >
                    {/* trigger dropdown */}
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setOpenProduct((v) => !v);
                        if (e.key === "Escape") setOpenProduct(false);
                      }}
                      aria-haspopup="menu"
                      aria-expanded={openProduct}
                      className={[
                        // SAMAKAN BASELINE & DISPLAY dengan link lain
                        "inline-flex items-center gap-1 text-sm leading-none transition-colors cursor-pointer select-none",
                        // state warna/berat font
                        activeInProduct || openProduct
                          ? "text-foreground font-medium"
                          : "text-foreground/70 font-normal hover:text-foreground",
                      ].join(" ")}
                    >
                      {t("nav.product")}
                      <span aria-hidden className="relative top-px">▾</span>
                    </span>

                    {openProduct && (
                      <div
                        role="menu"
                        className="absolute left-0 mt-2 min-w-[220px] rounded-xl border border-black/10 bg-white p-2 shadow-xl"
                      >
                        <Link
                          role="menuitem"
                          href={withLocale("/features")}
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground"
                        >
                          {t("nav.features")}
                        </Link>
                        <Link
                          role="menuitem"
                          href={withLocale("/solutions")}
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground"
                        >
                          {t("nav.solutions")}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              // link default (About, Pricing, Contact, dll.) — tambahkan kelas align yang sama
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

        {/* KANAN: Log in + Sign in (localized) */}
        <div className="flex items-center gap-4">
          <Link
            href={withLocale("/login")}
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            {t("nav.signin")}
          </Link>
          <Link
            href={withLocale("/login")}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            {t("cta.signin")}
          </Link>
        </div>
      </div>
    </header>
  );
}
