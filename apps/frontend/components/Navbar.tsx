// apps/frontend/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const name = "AberoAI";

  // Ubah About → Home ketika berada di /about
  const links = NAV_LINKS.map((l) =>
    l.href === "/about" && pathname.startsWith("/about")
      ? { label: "Home", href: "/" }
      : l
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-lg border border-black/10 bg-white/70 p-1">
            <Image
              src="/icon.svg"  // konsisten dengan layout.tsx
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
          {links.map((l) => {
            const isActive =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={`${l.href}-${l.label}`}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "text-sm transition-colors",
                  isActive ? "text-black" : "text-black/70 hover:text-black",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
