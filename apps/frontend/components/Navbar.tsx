// apps/frontend/components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/nav";

export default function Navbar() {
  const name = "AberoAI";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-lg border border-black/10 bg-white/70 p-1">
            <Image
              src="/icon.svg"   // pakai asset yang pasti ada (lihat layout.tsx)
              alt={name}
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-semibold">{name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-black/70 hover:text-black">
              {l.label}
            </Link>
          ))}
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
