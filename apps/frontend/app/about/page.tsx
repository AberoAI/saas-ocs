// apps/frontend/app/about/page.tsx
import Link from "next/link";
import Image from "next/image";

/** Navbar khusus halaman About:
 *  - Mirip navbar di landing
 *  - "About" diganti menjadi "Home" (ke "/")
 *  - Link section pakai "/#..." agar scroll di landing
 */
function SiteTopNavAbout() {
  const name = "AberoAI";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-lg border border-black/10 bg-white/70 p-1">
            <Image
              src="/icon-192.png"
              alt={name}
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-semibold">{name}</span>
        </Link>

        {/* Menu */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-black/70 hover:text-black">
            Home
          </Link>
          <Link href="/#features" className="text-sm text-black/70 hover:text-black">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm text-black/70 hover:text-black">
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

export default function AboutPage() {
  return (
    <>
      <SiteTopNavAbout />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">About AberoAI</h1>

        <p className="mb-4 text-black/70">
          AberoAI is a technology company based in Izmir, Turkey, specializing in{" "}
          <strong>Online Customer Service + AI (OCS+AI)</strong> solutions. Our
          platform integrates <strong>WhatsApp Cloud API</strong> with
          AI-powered automation to help businesses improve customer engagement and
          reduce operational costs.
        </p>

        <p className="mb-4 text-black/70">
          We support a wide range of industries, including{" "}
          <strong>clinics, hospitality, and retail</strong>, by providing:
        </p>

        <ul className="list-disc list-inside mb-6 text-black/70">
          <li>
            <strong>AI Autoreply</strong> – instant and consistent responses to
            customer inquiries.
          </li>
          <li>
            <strong>Multi-tenant Dashboard</strong> – manage multiple business
            units or branches in one place.
          </li>
          <li>
            <strong>Realtime Analytics</strong> – track SLA, response time, and
            customer satisfaction.
          </li>
        </ul>

        <p className="mb-6 text-black/70">
          Our mission is simple:{" "}
          <strong>
            to empower businesses of all sizes with smart automation tools that
            make customer service more efficient, reliable, and human-centered.
          </strong>
        </p>

        <p className="text-black/70">
          📬 Want to reach us? Visit our{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact page
          </Link>
          .
        </p>
      </main>
    </>
  );
}
