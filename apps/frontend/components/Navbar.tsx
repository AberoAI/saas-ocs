// apps/frontend/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const pathnameRaw = usePathname() || "/";
  const pathname = pathnameRaw.replace(/\/+$/, "") || "/";

  const t = useTranslations();
  const name = "AberoAI";

  // deteksi prefix locale dari path (mis. /tr, /en)
  const m = pathname.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";

  const withLocale = (href: string) => {
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) {
      return href;
    }
    return `${localePrefix}${href}`;
  };

  // map key → label i18n
  const links = NAV_LINKS.map((l) => {
    const label =
      l.key === "contact" ? t("cta.contact") : t(`nav.${l.key}`);
    return { label, href: withLocale(l.href) };
  });

  const isActive = (href: string) => {
    const target = href.replace(/\/+$/, "") || "/";
    if (target === "/" || target === localePrefix) {
      return pathname === "/" || pathname === localePrefix;
    }
    return pathname === target || pathname.startsWith(target + "/");
  };

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
            {links.map((l) => (
              <Link
                key={`${l.href}-${l.label}`}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={[
                  "text-sm transition-colors",
                  isActive(l.href)
                    ? "text-foreground font-medium"
                    : "text-foreground/70 hover:text-foreground",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}
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
