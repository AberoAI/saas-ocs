export default function VerifyPage() {
  const name = process.env.NEXT_PUBLIC_BIZ_NAME ?? "Your Company";
  const tagline = process.env.NEXT_PUBLIC_BIZ_TAGLINE ?? "Customer Service Automation";
  const email = process.env.NEXT_PUBLIC_BIZ_EMAIL ?? "contact@example.com";
  const phone = process.env.NEXT_PUBLIC_BIZ_PHONE ?? "+00 000 000 0000";
  const domain = process.env.NEXT_PUBLIC_BIZ_DOMAIN ?? "https://example.com";
  const address = process.env.NEXT_PUBLIC_BIZ_ADDRESS ?? "City, Country";

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-3xl px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {name}
        </h1>
        <p className="mt-3 text-gray-700">{tagline}</p>

        <section className="mt-6 space-y-2 text-gray-800 leading-relaxed">
          <p>
            <strong>About:</strong> We provide AI-powered WhatsApp Cloud API automation
            for customer service (OCS + AI), including real-time inbox,
            auto-replies, dashboards, and analytics.
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a className="underline" href={domain} target="_blank" rel="noreferrer">
              {domain}
            </a>
          </p>
          <p>
            <strong>Contact:</strong> {email} · {phone}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Legal:</strong> Our Privacy Policy and Terms are available below.
          </p>
        </section>

        <div className="mt-6 flex gap-4">
          <a className="underline" href="/privacy">
            Privacy Policy
          </a>
          <a className="underline" href="/terms">
            Terms of Service
          </a>
        </div>

        <footer className="mt-10 text-sm text-gray-500">
          This page is provided to support Facebook Business verification.
        </footer>
      </div>
    </main>
  );
}
