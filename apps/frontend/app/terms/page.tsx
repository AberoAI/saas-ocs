export default function Terms() {
  const name = process.env.NEXT_PUBLIC_BIZ_NAME || "Your Company";
  const email = process.env.NEXT_PUBLIC_BIZ_EMAIL || "contact@example.com";
  const updated = new Date().toISOString().slice(0, 10);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">1. Acceptance</h2>
        <p>By using {name}’s services, you agree to these Terms. If you do not agree, please do not use the service.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">2. Service</h2>
        <p>{name} provides automation for customer service via WhatsApp Cloud API and AI features (inbox, auto-reply, dashboards). Availability may vary and features can change over time.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Comply with WhatsApp/Meta policies and applicable laws.</li>
          <li>Do not send spam or prohibited content.</li>
          <li>Keep your API keys and credentials secure.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">4. Data & Privacy</h2>
        <p>We process data to deliver the service as described in our <a className="underline" href="/privacy">Privacy Policy</a>.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">5. Messaging via WhatsApp</h2>
        <p>You are solely responsible for the content of messages and end-user consent. {name} is not liable for message delivery issues caused by third-party platforms.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">6. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, {name} is not liable for indirect, incidental, or consequential damages.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">7. Changes</h2>
        <p>We may update these Terms from time to time. Continued use of the service means you accept the revised Terms.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">8. Contact</h2>
        <p>Questions? Contact us at {email}.</p>
      </section>

      <p className="text-sm text-gray-500">Last updated: {updated}</p>
    </main>
  );
}
