// apps/frontend/app/page.tsx
// 100% statik, tanpa next-intl & tanpa headers. Aman untuk SSG.

import Link from "next/link";

export const dynamic = "force-static";

export default function RootLanding() {
  return (
    <html lang="en">
      <head>
        {/* SEO: beri tahu crawler bahwa /en adalah kanonik */}
        <link rel="canonical" href="/en" />
        {/* JS redirect (non-blocking) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace('/en');`,
          }}
        />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en" />
        </noscript>
      </head>
      <body>
        <main className="mx-auto max-w-xl p-8 text-center">
          <h1 className="text-xl font-semibold">Redirecting…</h1>
          <p className="mt-2 text-black/60">
            If you are not redirected automatically,{" "}
            <Link href="/en" className="underline">
              click here to continue to /en
            </Link>
            .
          </p>
        </main>
      </body>
    </html>
  );
}
