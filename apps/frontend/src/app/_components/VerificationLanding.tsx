"use client";

export default function VerificationLanding() {
  const name = process.env.NEXT_PUBLIC_BIZ_NAME || "Your Company";
  const tagline =
    process.env.NEXT_PUBLIC_BIZ_TAGLINE || "Customer Service Automation";
  const email = process.env.NEXT_PUBLIC_BIZ_EMAIL || "contact@example.com";
  const phone = process.env.NEXT_PUBLIC_BIZ_PHONE || "+00 000 000 0000";
  const domain = process.env.NEXT_PUBLIC_BIZ_DOMAIN || "https://example.com";

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-3xl px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {name}
        </h1>
        <p className="mt-3 text-gray-700">{tagline}</p>

        <section className="mt-6 space-y-2 text-gray-800">
          <p>
            <strong>About:</strong> We provide AI-powered WhatsApp Cloud API
            automation for customer service (OCS + AI), including real-time
            inbox, auto-replies, and dashboards.
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              className="underline"
              href={domain}
              target="_blank"
              rel="noreferrer"
            >
              {domain}
            </a>
          </p>
          <p>
            <strong>Contact:</strong> {email} · {phone}
          </p>
          <p>
            <strong>Legal:</strong> Business operates under applicable terms &
            privacy policies. Request available upon review.
          </p>
        </section>

        <footer className="mt-10 text-sm text-gray-500">
          This page is provided to support Facebook Business verification.
        </footer>
      </div>
    </main>
  );
}
