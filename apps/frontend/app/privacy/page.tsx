//apps/frontend/app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy | AberoAI",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[#3A3A3A]">
          Privacy Policy
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[#404040]">
          AberoAI Ops provides managed WhatsApp-based communication support for
          clinics.
        </p>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-[#404040]">
          <p>
            We process limited personal data such as names, phone numbers, and
            message content solely for operational follow-up and aftercare
            purposes on behalf of clinics.
          </p>

          <p>
            AberoAI Ops acts as a service provider. Clinics remain the data
            controllers for patient communications.
          </p>

          <p>We do not sell personal data.</p>

          <p>
            For questions related to data handling, please contact:{" "}
            <a
              className="underline underline-offset-4 hover:opacity-80"
              href="mailto:info@aberoai.com"
            >
              info@aberoai.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
