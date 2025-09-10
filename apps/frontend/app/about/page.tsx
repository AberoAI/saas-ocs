// apps/frontend/app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
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
  );
}
