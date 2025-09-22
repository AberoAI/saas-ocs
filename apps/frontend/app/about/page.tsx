// apps/frontend/app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Navbar global ada di layout.tsx */}

      <main className="mx-auto max-w-4xl px-6 py-16 md:py-16">
        <h1 className="text-3xl font-bold mb-6">About AberoAI</h1>

        {/* 🎯 Our Mission */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🎯 Our Mission</h2>
          <p>
            More than 65% of customers abandon transactions simply because responses are delayed or
            inconsistent. The growing volume of messages overwhelms customer service teams, while
            customers are becoming increasingly impatient.
          </p>
          <p>
            Traditional WhatsApp Business auto-replies often feel rigid and generic, which means
            instant responses don’t actually solve the problem.
          </p>
          <p>
            AberoAI’s mission is to bridge that gap — delivering consistent, 24/7 instant responses,
            supporting multiple languages, and providing flexible answers tailored to each
            conversation.
          </p>
          <p>
            AberoAI also manages bookings and follow-ups while keeping your brand voice consistent
            across every interaction. It is efficient and scalable — handling thousands of
            conversations in seconds without additional staff, so your team can stay focused on
            high-value work.
          </p>
          <p>
            We believe fast, consistent conversations show genuine care for customers — and trust is
            the fuel for business growth.
          </p>
        </section>

        {/* ⚙️ What We Do */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">⚙️ What We Do</h2>
          <p>
            AberoAI helps businesses deliver customer service that is faster, more consistent, and
            more human. Built with the latest generation of AI technology and designed specifically
            for service industries, AberoAI provides conversational automation that goes beyond
            simple replies to actually resolving customer needs.
          </p>

          <h3 className="mt-6 text-lg font-semibold">🔹 Key Features</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Intuitive dashboard</strong> → easy to use, customizable to your business, and
              built for high-touch industries.
            </li>
            <li>
              <strong>24/7 multilingual responses</strong> → ensuring local and international
              customers are always served without barriers.
            </li>
            <li>
              <strong>Ready-made conversation flows</strong> → appointment booking, Q&amp;A,
              reminders, and follow-ups.
            </li>
            <li>
              <strong>Seamless integration</strong> → connect via the official WhatsApp Cloud API
              and AberoAI’s web dashboard, ready to use without complex setup.
            </li>
            <li>
              <strong>Human handoff (advanced)</strong> → smooth transitions to your team for
              complex cases that require a personal touch.
            </li>
            <li>
              <strong>Insights &amp; analytics (advanced)</strong> → helping businesses track
              performance and uncover opportunities for improvement.
            </li>
          </ul>

          <h3 className="mt-6 text-lg font-semibold">🔹 Added Value</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Flexible &amp; contextual</strong> → responses adapt to each customer’s
              situation, unlike old bots with rigid templates.
            </li>
            <li>
              <strong>Efficient &amp; scalable</strong> → capable of handling thousands of
              conversations in seconds without extra staff.
            </li>
            <li>
              <strong>Brand-first</strong> → tone, style, and language always reflect your brand
              identity.
            </li>
            <li>
              <strong>Collaborative</strong> → accessible to multiple team members at once for
              smoother coordination.
            </li>
            <li>
              <strong>Centralized &amp; documented</strong> → all conversations are stored in one
              place, no longer scattered across devices.
            </li>
            <li>
              <strong>Service-industry focus</strong> → purpose-built for high-touch sectors such as
              clinics, hospitality, and other service-driven businesses.
            </li>
          </ul>
        </section>

        {/* 💡 How We Work */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">💡 How We Work</h2>
          <p>
            We believe great customer service is not just about replying quickly, but also about
            understanding context and providing the right solution. That’s why AberoAI is designed
            to work as a proactive, adaptive digital assistant — not just another bot.
          </p>

          <h3 className="mt-6 text-lg font-semibold">🔹 AberoAI Principles</h3>
          <ul className="mt-2 list-disc pl-5 space-y-3">
            <li>
              <strong>Contextual &amp; proactive</strong> → AberoAI understands intent and suggests
              the next step.
              <br />
              <span className="text-black/70">
                Example: a patient asking about schedules can be guided directly to available booking
                slots, while a hotel guest asking about rooms can be directed straight to
                reservations.
              </span>
            </li>
            <li>
              <strong>Actionable by default</strong> → every interaction can be followed up
              immediately, from booking and confirmations to reminders. Not just canned responses,
              but flexible solutions that actually resolve customer needs.
            </li>
            <li>
              <strong>Seamless integration</strong> → connect with the official WhatsApp Cloud API
              or use AberoAI’s web dashboard — no technical hassle required.
            </li>
            <li>
              <strong>Human touch when needed</strong> → for complex conversations, AberoAI smoothly
              hands over to your team so customers always feel supported.
            </li>
            <li>
              <strong>Aligned with your brand</strong> → tone, style, and communication always match
              your brand, ensuring natural and consistent interactions.
            </li>
            <li>
              <strong>Secure &amp; controlled</strong> → all conversations are encrypted, private,
              and remain fully owned by your business, following modern security standards.
            </li>
          </ul>
        </section>

        {/* ✨ Outcomes */}
        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">✨ With this approach, your business can:</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Serve more customers without increasing headcount,</li>
            <li>Reduce transaction drop-offs caused by delayed responses,</li>
            <li>Improve customer satisfaction with instant, relevant replies,</li>
            <li>Build long-term trust through consistent and secure interactions.</li>
          </ul>
          <p className="mt-4">
            The result: greater efficiency, happier customers, and a stronger, more trusted brand.
            Every fast, consistent conversation is not just service — it’s proof of care that builds
            trust and sustainable growth for your business.
          </p>
        </section>

        <footer className="mt-12 border-t border-black/10 pt-6 text-sm text-black/60">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} AberoAI</span>
            <div className="space-x-3">
              <Link href="/privacy" className="underline">Privacy</Link>
              <span aria-hidden>·</span>
              <Link href="/terms" className="underline">Terms</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
