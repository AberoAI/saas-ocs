// apps/frontend/app/[locale]/foundation/page.tsx
import type { Metadata } from "next";
import { type Locale, locales, defaultLocale } from "@/i18n/config";

import Hero from "@/components/foundationpage/Hero";
import Page1 from "@/components/foundationpage/Page1";
import Page2 from "@/components/foundationpage/Page2";
import Page3 from "@/components/foundationpage/Page3";
import Page4 from "@/components/foundationpage/Page4";
import Page5 from "@/components/foundationpage/Page5";
import Page6 from "@/components/foundationpage/Page6";

type Props = { params: { locale: string } };

function getAbsoluteSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "";
  const raw = fromEnv || "https://aberoai.com";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function normalizeLocale(v: string | undefined): Locale {
  const val = (v ?? "").toLowerCase();
  return (locales as readonly string[]).includes(val)
    ? (val as Locale)
    : defaultLocale;
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const routeLocale = normalizeLocale(locale);
  const site = getAbsoluteSiteUrl();

  return {
    metadataBase: new URL(site),
    alternates: {
      canonical: `/${routeLocale}/foundation`,
      languages: {
        "x-default": "/en/foundation",
        en: "/en/foundation",
        tr: "/tr/foundation",
      },
    },
  };
}

export default function FoundationLocalePage() {
  return (
    <main className="relative bg-white overflow-x-hidden">
      <Hero />
      <Page1 />
      <Page2 />
      <Page3 />
      <Page4 />
      <Page5 />
      <Page6 />
    </main>
  );
}
