"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { useDismissable } from "@/hooks/useDismissable";

/** Path normalizer */
function normalizePath(p: string) {
  try {
    const withoutHash = (p || "/").split("#")[0] ?? "/";
    const withoutQuery = (withoutHash || "/").split("?")[0] ?? "/";
    const raw = decodeURI(withoutQuery || "/");
    if (raw.length > 1 && raw.endsWith("/")) return raw.slice(0, -1);
    return raw || "/";
  } catch {
    return "/";
  }
}

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale() || "en";
  const pathnameRaw = usePathname() || "/";
  const pathname = normalizePath(pathnameRaw);

  /** Locale toggle (tidak mengubah server route, hanya bahasa UI) */
  const switchLocale = locale === "en" ? "tr" : "en";

  /** Auth labels */
  const isTR = locale.toLowerCase().startsWith("tr");
  const LOGIN_LABEL = isTR ? "Giriş" : "Log in";
  const SIGNIN_LABEL = isTR ? "Giriş yap" : "Sign in";

  /** Links */
  const links = useMemo(
    () =>
      NAV_LINKS.map((l) => ({
        key: l.key,
        label: l.key === "contact" ? t("cta.contact") : t(`nav.${l.key}`),
        href: l.href,
      })),
    [t]
  );

  /** Active link */
  const localePrefix = `/${locale}`;
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

  /** Dropdown */
  const [openProduct, setOpenProduct] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const productButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);
  const menuId = "product-menu";

  const handleEnter = () => setOpenProduct(true);
  const handleLeave = () => setOpenProduct(false);
  const openMenu = () => {
    setOpenProduct(true);
    queueMicrotask(() => firstMenuItemRef.current?.focus());
  };
  const closeMenu = () => {
    setOpenProduct(false);
    productButtonRef.current?.focus();
  };

  useDismissable<HTMLDivElement>(openProduct, () => setOpenProduct(false), menuRef);

  const productActive = isActive("/features") || isActive("/solutions");

  const navItemClass = (active: boolean, hoverable: boolean) =>
    [
      "inline-flex items-center text-sm leading-none transition-colors",
      active ? "text-foreground font-medium" : "text-foreground/70 font-normal",
      hoverable ? "hover:text-foreground" : "",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-md",
    ].join(" ");

  /** Mobile menu */
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  useDismissable<HTMLDivElement>(mobileOpen, () => setMobileOpen(false), mobileRef);

  useEffect(() => {
    setOpenProduct(false);
    setMobileOpen(false);
  }, [pathname]);

  type LinkHref = React.ComponentProps<typeof Link>["href"];

  /** Auth Buttons */
  function AuthButtons({ onClick }: { onClick?: () => void }) {
    return (
      <>
        <Link
          href="/login"
          className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition bg-[#F7F7F7]"
          onClick={onClick}
        >
          {LOGIN_LABEL}
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-white transition bg-[var(--brand)]"
          onClick={onClick}
        >
          {SIGNIN_LABEL}
        </Link>
      </>
    );
  }

  /** Flat Language Text (no bubble) */
  function LocaleText({ pathname }: { pathname: LinkHref }) {
    const cur = (useLocale() || "en").toUpperCase();
    const next = cur === "EN" ? "tr" : "en";
    return (
      <Link
        href={pathname}
        locale={next}
        prefetch={false}
        className="text-xs font-medium uppercase text-foreground/60 hover:text-foreground transition-colors"
      >
        {cur}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div
        className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3.5 md:px-8 lg:px-10"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Brand */}
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
            <span className="text-2xl font-medium text-navbar">AberoAI</span>
          </Link>
        </div>

        {/* Nav */}
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
                  ref={productButtonRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openProduct}
                  aria-controls={menuId}
                  onClick={() => (openProduct ? closeMenu() : openMenu())}
                  className="inline-flex items-center focus:outline-none"
                >
                  <span
                    className={[
                      "text-sm leading-none",
                      productActive ? "text-foreground font-medium" : "text-foreground/70 font-normal",
                    ].join(" ")}
                  >
                    {t("nav.product")}
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    className={[
                      "ml-1 h-[1em] w-[1em] transition-transform duration-150",
                      openProduct ? "rotate-180" : "",
                    ].join(" ")}
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
                          ref={firstMenuItemRef}
                          href="/features"
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground"
                          onClick={() => setOpenProduct(false)}
                        >
                          {t("nav.features")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/solutions"
                          className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground"
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
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={navItemClass(isActive(l.href), true)}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        {/* Right: HANYA ubah jarak EN/TR → Log in = 18px, tidak mengubah Log in ↔ Sign in */}
        <div className="hidden items-center md:flex">
          <LocaleText pathname={pathname as LinkHref} />
          {/* wrapper tombol: ml-[18px] untuk jarak dari LocaleText, internal gap tetap 12px (gap-3) */}
          <div className="ml-[18px] flex items-center gap-3">
            <AuthButtons />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground/80 hover:text-foreground focus:outline-none"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
