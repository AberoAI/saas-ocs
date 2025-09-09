// apps/frontend/app/page.tsx
export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-10">
        <h1 className="text-4xl font-semibold">AberoAI</h1>
        <p className="mt-2 text-lg">AI-powered Online Customer Service Automation</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-medium">Why AberoAI</h2>
        <ul className="list-disc pl-5">
          <li>Whatsapp Cloud API + AI untuk balasan otomatis</li>
          <li>Multi-tenant: cocok untuk klinik, hospitality, furniture</li>
          <li>Realtime dashboard & analytics</li>
        </ul>
      </section>

      <div className="mt-10 flex gap-4">
        <a
          href="/contact"
          className="rounded-xl border px-5 py-3"
        >
          Contact
        </a>
        <a
          href="/login"
          className="rounded-xl bg-black px-5 py-3 text-white"
        >
          Sign in
        </a>
      </div>

      <footer className="mt-16 text-sm text-neutral-500">
        <a href="/privacy-policy" className="underline">Privacy Policy</a> ·{" "}
        <a href="/terms-of-service" className="underline">Terms of Service</a>
      </footer>
    </main>
  );
}
