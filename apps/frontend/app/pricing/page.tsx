// apps/frontend/app/pricing/page.tsx
import Link from "next/link";

/** Komponen Plan (tetap) */
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
      {/* Navbar global ada di layout.tsx */}

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
