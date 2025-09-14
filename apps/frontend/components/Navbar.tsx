// apps/frontend/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";

export default function Navbar() {
  const pathnameRaw = usePathname() || "/";
  // Normalisasi trailing slash agar perbandingan stabil
  const pathname = pathnameRaw.replace(/\/+$/, "") || "/";

  const name = "AberoAI";

  // Deteksi prefix locale (contoh: /en, /id, /en-US)
  const m = pathname.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";

  // Prefix href dengan locale bila perlu
  const withLocale = (href: string) => {
    // eksternal / anchor / hash-only → biarkan
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) {
      return href;
    }
    return `${localePrefix}${href}`;
  };

  // Bangun daftar link TANPA mengganti “About” → “Home”
  const links = NAV_LINKS.map((l) => ({ label: l.label, href: withLocale(l.href) }));

  // Penanda aktif (exact atau prefix)
  const isActive = (href: string) => {
    const target = href.replace(/\/+$/, "") || "/";
    // Home aktif di "/" atau "/<locale>"
    if (target === "/" || target === localePrefix) {
      return pathname === "/" || pathname === localePrefix;
    }
    return pathname === target || pathname.startsWith(target + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href={localePrefix || "/"} className="flex items-center gap-3" aria-label="AberoAI home">
          <div className="rounded-lg border border-black/10 bg-white/70 p-1">
            <Image
              src="/icon.svg"
              alt={name}
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-semibold">{name}</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={`${l.href}-${l.label}`}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={[
                "text-sm transition-colors",
                isActive(l.href) ? "text-black font-medium" : "text-black/70 hover:text-black",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}

          <Link
            href={withLocale("/login")}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
