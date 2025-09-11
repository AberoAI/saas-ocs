// apps/frontend/app/terms-of-service/page.tsx
import type { Metadata } from "next";
import Link from "next/link"; // ← tambahkan

export const metadata: Metadata = {
  title: "Terms of Service – AberoAI",
  description:
    "Terms governing the use of AberoAI's WhatsApp Cloud API + AI customer service automation.",
  alternates: { canonical: "/terms-of-service" },
};

function getBizName(): string {
  return (
    process.env.BIZ_NAME ||
    process.env.NEXT_PUBLIC_BIZ_NAME ||
    "Your Company"
  );
}

function getContactEmail(): string {
  return (
    process.env.CONTACT_EMAIL ||
    process.env.NEXT_PUBLIC_BIZ_EMAIL ||
    "contact@example.com"
  );
}

function getLastUpdated(): string {
  // Gunakan ENV agar stabil (format YYYY-MM-DD), contoh: 2025-09-01
  const fromEnv = process.env.TERMS_LAST_UPDATED?.trim();
  if (fromEnv) return fromEnv;
  // Fallback aman: isi tanggal rilis dokumen awalmu
  return "2025-09-01";
}

export default function TermsOfServicePage() {
  const name = getBizName();
  const email = getContactEmail();
  const updated = getLastUpdated();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-6">
      <h1 className="text-3xl font-semibold">Terms of Service</h1>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">1. Acceptance</h2>
        <p>
          By using {name}&rsquo;s services, you agree to these Terms. If you do
          not agree, please do not use the service.
        </p>
      </section>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">2. Service</h2>
        <p>
          {name} provides automation for customer service via WhatsApp Cloud API
          and AI features (inbox, auto-reply, dashboards). Availability may vary
          and features can change over time.
        </p>
      </section>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Comply with WhatsApp/Meta policies and applicable laws.</li>
          <li>Do not send spam or prohibited content.</li>
          <li>Keep your API keys and credentials secure.</li>
        </ul>
      </section>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">4. Data &amp; Privacy</h2>
        <p>
          We process data to deliver the service as described in our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">5. Messaging via WhatsApp</h2>
        <p>
          You are solely responsible for the content of messages and end-user
          consent. {name} is not liable for message delivery issues caused by
          third-party platforms.
        </p>
      </section>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, {name} is not liable for
          indirect, incidental, or consequential damages.
        </p>
      </section>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">7. Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the
          service means you accept the revised Terms.
        </p>
      </section>

      <section className="space-y-3 text-[0.98rem] leading-relaxed text-neutral-800">
        <h2 className="text-lg font-medium">8. Contact</h2>
        <p>
          Questions? Contact us at{" "}
          <a className="underline" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      </section>

      <p className="text-sm text-neutral-500">Last updated: {updated}</p>

      {/* Catatan non-hukum (opsional) */}
      <p className="text-xs text-neutral-400">
        This page provides general terms and does not constitute legal advice.
      </p>
    </main>
  );
}
