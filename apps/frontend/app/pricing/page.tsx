// apps/frontend/app/pricing/page.tsx
import Link from "next/link";
import Image from "next/image";

/** Navbar untuk halaman Pricing (mirip /about) */
function SiteTopNavPricing() {
  const name = "AberoAI";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-lg border border-black/10 bg-white/70 p-1">
            <Image src="/icon-192.png" alt={name} width={32} height={32} className="object-contain" priority />
          </div>
          <span className="text-lg font-semibold">{name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-black/70 hover:text-black">
            Home
          </Link>
          <Link href="/#features" className="text-sm text-black/70 hover:text-black">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-black hover:text-black font-medium">
            Pricing
          </Link>
          <Link href="/#faq" className="text-sm text-black/70 hover:text-black">
            FAQ
          </Link>
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

/** Komponen Plan (copy dari landing agar file ini mandiri) */
function Plan({
  name,
  price,
  items,
  cta,
  highlight,
}: {
  name: string;
  price: string;
  items: string[];
  cta: { href: string; label: string };
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-6 shadow-sm",
        highlight ? "border-black bg-black text-white" : "border-black/10 bg-white",
      ].join(" ")}
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="mt-2 text-3xl font-bold">{price}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span className={highlight ? "mt-1 size-2 rounded-full bg-white/70" : "mt-1 size-2 rounded-full bg-black/50"} />
            <span className={highlight ? "text-white/90" : "text-black/70"}>{it}</span>
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={[
          "mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
          highlight ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90",
        ].join(" ")}
      >
        {cta.label}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <SiteTopNavPricing />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold md:text-4xl">Pricing</h1>
        <p className="mt-2 text-black/70 md:text-lg">Mulai gratis, upgrade kapan saja.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Plan
            name="Starter"
            price="Gratis"
            items={["100 percakapan/bulan", "1 nomor WhatsApp", "AI Autoreply dasar"]}
            cta={{ href: "/login", label: "Mulai" }}
          />
          <Plan
            name="Pro"
            price="$29/bulan"
            items={["Percakapan wajar tanpa batas", "Multi-tenant", "Analytics realtime"]}
            cta={{ href: "/login", label: "Coba 14 hari" }}
            highlight
          />
          <Plan
            name="Business"
            price="Hubungi kami"
            items={["SLA & dukungan prioritas", "Integrasi khusus", "Onboarding tim"]}
            cta={{ href: "/contact", label: "Kontak sales" }}
          />
        </div>
      </main>
    </>
  );
}
