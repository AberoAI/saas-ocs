export default function Page() {
  const email = process.env.NEXT_PUBLIC_BIZ_EMAIL || "contact@example.com";
  const updated = new Date().toISOString().slice(0, 10);
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="mt-4">
        We collect and process data solely to deliver our customer service automation features
        (WhatsApp Cloud API + AI). We do not sell personal data. For access or deletion requests,
        contact us at {email}.
      </p>
      <p className="mt-4">Last updated: {updated}</p>
    </main>
  );
}
