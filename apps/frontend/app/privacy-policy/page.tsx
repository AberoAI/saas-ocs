// apps/frontend/app/privacy-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – AberoAI",
  description:
    "How AberoAI collects, uses, and protects data for WhatsApp Cloud API + AI customer service automation.",
  alternates: { canonical: "/privacy-policy" },
};

function getLastUpdated(): string {
  // Lebih stabil: kontrol via ENV (server-side env, tidak perlu NEXT_PUBLIC)
  // Format YYYY-MM-DD, contoh: 2025-09-01
  const fromEnv = process.env.POLICY_LAST_UPDATED?.trim();
  if (fromEnv) return fromEnv;

  // Fallback aman (isi tanggal rilis dokumen kamu)
  return "2025-09-01";
}

function getContactEmail(): string {
  // Bisa pakai server env biasa (lebih baik) atau fallback ke NEXT_PUBLIC jika itu yang sudah kamu gunakan.
  return (
    process.env.CONTACT_EMAIL ||
    process.env.NEXT_PUBLIC_BIZ_EMAIL ||
    "contact@example.com"
  );
}

export default function PrivacyPolicyPage() {
  const email = getContactEmail();
  const updated = getLastUpdated();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>

      <p className="mt-4 text-sm text-neutral-600">
        This page describes how AberoAI collects, uses, and protects data for
        our Online Customer Service + AI (WhatsApp Cloud API + AI) features.
      </p>

      <section className="mt-8 space-y-4 text-[0.98rem] leading-relaxed text-neutral-800">
        <p>
          <strong>Data Collection:</strong> We collect only the data necessary
          to deliver messaging, automation, and analytics features. This may
          include message content, timestamps, sender IDs, and integration
          metadata required by WhatsApp Cloud API.
        </p>

        <p>
          <strong>Use of Data:</strong> Data is used to enable real-time
          messaging, automated replies, routing, and dashboard reporting. We do
          <em> not</em> sell personal data.
        </p>

        <p>
          <strong>Retention:</strong> Retention periods follow the minimum time
          needed to provide the service and to meet legal/operational needs.
          Where possible, we support deletion upon request.
        </p>

        <p>
          <strong>Security:</strong> We apply industry-standard safeguards and
          principle of least privilege. Access to production data is limited to
          authorized personnel and systems.
        </p>

        <p>
          <strong>Third Parties:</strong> We integrate with WhatsApp Cloud API
          (Meta) and may rely on sub-processors (e.g., hosting, storage). These
          providers are vetted for security and compliance.
        </p>

        <p>
          <strong>Your Rights:</strong> For access, correction, export, or
          deletion requests, contact us at <a className="underline" href={`mailto:${email}`}>{email}</a>.
        </p>
      </section>

      <p className="mt-10 text-sm text-neutral-500">Last updated: {updated}</p>
    </main>
  );
}
