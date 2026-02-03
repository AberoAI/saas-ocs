// apps/frontend/components/Navbar.tsx
"use client";

import Image from "next/image";
import { NAV_LINKS } from "@/lib/nav";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Link, usePathname as useIntlPathname } from "@/i18n/routing";
import { useDismissable } from "@/hooks/useDismissable";
import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/context/I18nContext";

type LinkHref = React.ComponentProps<typeof Link>["href"];

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

/** Locale dropdown: switch bahasa = switch URL prefix (/en <-> /tr) */
function LocaleDropdown() {
  const { uiLocale } = useI18n();
  const cur = uiLocale;
  const other: "en" | "tr" = cur === "en" ? "tr" : "en";

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const [pending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname() || "/";

  useDismissable<HTMLDivElement>(open, () => setOpen(false), menuRef);

  const openMenu = () => {
    setOpen(true);
    queueMicrotask(() => firstItemRef.current?.focus());
  };
  const closeMenu = () => {
    setOpen(false);
    btnRef.current?.focus();
  };

  function buildNextPath(nextLocale: "en" | "tr") {
    const p = normalizePath(pathname);
    const base = p.replace(/^\/(en|tr)(?=\/|$)/, "") || "/";
    if (base === "/" || base === "") return `/${nextLocale}`;
    return `/${nextLocale}${base.startsWith("/") ? "" : "/"}${base}`;
  }

  function onPick(lc: "en" | "tr") {
    if (lc === cur) {
      setOpen(false);
      return;
    }

    const nextPath = buildNextPath(lc);

    startTransition(() => {
      setOpen(false);
      router.push(nextPath);
    });
  }

  const label = cur.toUpperCase() as "EN" | "TR";
  const otherLabel = other.toUpperCase() as "EN" | "TR";

  return (
    <div className="relative inline-block align-middle" ref={menuRef}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        className="bg-transparent border-0 p-0 m-0 align-middle focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-[3px]"
        style={{ lineHeight: "inherit", verticalAlign: "baseline" }}
        disabled={pending}
      >
        <span className="text-xs font-medium uppercase text-foreground/60 hover:text-foreground transition-colors align-middle">
          {pending ? "…" : label}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Change language"
          className="absolute left-0 top-full mt-2 min-w-[64px] rounded-md border border-black/10 bg-white p-1 shadow-md z-20"
        >
          <ul>
            <li>
              <a
                ref={firstItemRef}
                href="#"
                role="menuitem"
                className="block rounded-[6px] px-2 py-1.5 text-xs font-medium uppercase text-foreground/70 hover:bg-black/5 hover:text-foreground focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  onPick(other);
                }}
              >
                {otherLabel}
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations();
  const { uiLocale } = useI18n();
  const locale = uiLocale;

  const pathnameRaw = useIntlPathname() || "/";
  const pathname = normalizePath(pathnameRaw);

  const isTR = locale === "tr";
  const LOGIN_LABEL = isTR ? "Giriş" : "Log in";
  const DEMO_LABEL = isTR ? "Demo Talep Et" : "Book a Demo";

  const links = useMemo(
    () =>
      NAV_LINKS.map((l) => ({
        key: l.key,
        label: t(`nav.${l.key}`),
        href: l.href,
      })),
    [t],
  );

  const localePrefix = `/${locale}`;
  const current = pathname;

  const isActive = (href: string) => {
    const target = normalizePath(
      href.startsWith("/") ? `${localePrefix}${href}` : href,
    );
    if (target === "/" || target === localePrefix) {
      return current === "/" || current === localePrefix;
    }
    return current === target || current.startsWith(`${target}/`);
  };

  const navItemClass = (active: boolean, hoverable: boolean) =>
    [
      "inline-flex items-center text-sm leading-none transition-colors",
      active ? "text-foreground font-medium" : "text-foreground/70 font-normal",
      hoverable ? "hover:text-foreground" : "",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-md",
    ].join(" ");

  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  useDismissable<HTMLDivElement>(
    mobileOpen,
    () => setMobileOpen(false),
    mobileRef,
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function AuthButtons({ onClick }: { onClick?: () => void }) {
    return (
      <>
        {/* Log in as plain text (no container), same tone as navbar items */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm leading-none text-foreground/70 font-normal hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-md"
          onClick={onClick}
        >
          {LOGIN_LABEL}
        </Link>

        {/* CTA: smaller width/height; not round */}
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white transition bg-[var(--brand)] rounded-[12px] shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          onClick={onClick}
        >
          {DEMO_LABEL}
        </Link>
      </>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] w-full bg-white/95 backdrop-blur">
      <div
        className="mx-auto grid max-w-screen-xl grid-cols-[1fr_auto_1fr] items-center px-6 py-3.5 md:px-8 lg:px-10"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 justify-self-start">
          <Link
            href="/"
            className="flex items-center gap-1"
            aria-label="AberoAI home"
          >
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

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center justify-center gap-6 justify-self-center"
          aria-label="Main"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={navItemClass(isActive(l.href), true)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center justify-self-end">
          <LocaleDropdown />
          <div className="ml-[18px] flex items-center gap-6">
            <AuthButtons />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center justify-self-end rounded-md p-2 text-foreground/80 hover:text-foreground focus:outline-none"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
