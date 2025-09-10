// apps/frontend/app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

/** -- Metadata (tetap) -- */
export const metadata: Metadata = {
  title: "AberoAI – AI-powered Online Customer Service Automation",
  description:
    "Automate customer service with WhatsApp Cloud API + AI. Multi-tenant, real-time dashboard, and analytics.",
  alternates: { canonical: "/" },
};

/** -- Helper (tetap) -- */
function getBizName(): string {
  return process.env.BIZ_NAME || process.env.NEXT_PUBLIC_BIZ_NAME || "AberoAI";
}
function getTagline(): string {
  return (
    process.env.BIZ_TAGLINE ||
    process.env.NEXT_PUBLIC_BIZ_TAGLINE ||
    "AI-powered Online Customer Service Automation"
  );
}

/** ---------- Komponen kecil ---------- */

function SiteTopNav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-lg border border-black/10 bg-white/70 p-1">
            <Image
              src="/icon-192.png" // kecil & cepat; ada di /public
              alt={name}
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-semibold">{name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-black/70 hover:text-black">
            Features
          </a>
          <a href="#pricing" className="text-sm text-black/70 hover:text-black">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-black/70 hover:text-black">
            FAQ
          </a>
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

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-black/90 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-black/70">{desc}</p>
    </div>
  );
}

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
            <span
              className={
                highlight ? "mt-1 size-2 rounded-full bg-white/70" : "mt-1 size-2 rounded-full bg-black/50"
              }
            />
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

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-2xl border border-black/10 bg-white p-5">
      <summary className="cursor-pointer list-none text-base font-medium">{q}</summary>
      <p className="mt-2 text-sm text-black/70">{a}</p>
    </details>
  );
}

/** ---------- Halaman ---------- */

export default function HomePage() {
  const name = getBizName();
  const tagline = getTagline();

  return (
    <>
      <SiteTopNav name={name} />

      {/* Hero: kontenmu dipertahankan */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/70">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              Now live • WhatsApp AI Support
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{name}</h1>
            <p className="mt-2 text-lg text-black/70 md:text-xl">{tagline}</p>

            <div className="mt-8 flex gap-4">
              <Link href="/contact" className="rounded-xl border border-black/10 px-5 py-3 hover:bg-black/5">
                Contact
              </Link>
              <Link href="/login" className="rounded-xl bg-black px-5 py-3 text-white hover:bg-black/90">
                Sign in
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-black/60">
              <span>Tanpa kartu kredit</span>
              <span>•</span>
              <span>Cancel kapan saja</span>
            </div>
          </div>

          {/* Mock UI */}
          <div className="relative">
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-black/10 bg-black/5 px-4 py-2">
                <span className="size-2.5 rounded-full bg-red-400"></span>
                <span className="size-2.5 rounded-full bg-amber-400"></span>
                <span className="size-2.5 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs text-black/60">AberoAI Bot</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="max-w-[80%] rounded-2xl bg-black/5 px-3 py-2 text-sm">
                  Halo! Ada yang bisa kami bantu?
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl bg-black px-3 py-2 text-sm text-white">
                  Jadwal buka klinik hari ini?
                </div>
                <div className="max-w-[80%] rounded-2xl bg-black/5 px-3 py-2 text-sm">
                  Klinik buka 09.00–21.00 WIB. Ingin buat janji?
                </div>
                <div className="mt-4 rounded-xl bg-black/90 px-3 py-2 text-center text-xs text-white">
                  Dibalas oleh AI • &lt;1 detik
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features (+ list aslimu dipertahankan) */}
      <section id="features" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-medium md:text-3xl">Why {name}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              title="AI Autoreply"
              desc="Balasan cepat & konsisten untuk pertanyaan umum, terhubung WhatsApp Cloud API."
            />
            <FeatureCard
              title="Multi-tenant"
              desc="Cocok untuk klinik, hospitality, furniture—kelola banyak unit bisnis."
            />
            <FeatureCard
              title="Realtime Analytics"
              desc="Pantau metrik penting: SLA, waktu respon, topik percakapan."
            />
          </div>

          <ul className="mt-8 list-disc pl-5 text-black/75">
            <li>WhatsApp Cloud API + AI untuk balasan otomatis</li>
            <li>Multi-tenant: cocok untuk klinik, hospitality, furniture</li>
            <li>Realtime dashboard &amp; analytics</li>
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">Pricing</h2>
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
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">FAQ</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Faq q="Apakah butuh server sendiri?" a="Tidak. Semuanya dikelola di cloud. Kamu cukup menghubungkan WhatsApp Cloud API." />
            <Faq q="Bisakah pakai banyak cabang?" a="Bisa. Fitur multi-tenant memudahkan kelola banyak unit bisnis dalam satu akun." />
            <Faq q="Ada free trial?" a="Ada. Daftar dan mulai uji coba langsung tanpa kartu kredit." />
            <Faq q="Bisa integrasi sistem internal?" a="Bisa. Hubungi kami untuk integrasi custom (CRM, ticketing, dsb.)." />
          </div>
        </div>
      </section>

      {/* Footer: link aslimu dipertahankan, pakai Link */}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-black/60">© {new Date().getFullYear()} {name}</p>
          <div className="text-sm text-neutral-500">
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link> ·{" "}
            <Link href="/terms-of-service" className="underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
