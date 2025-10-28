// apps/frontend/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import type { Metadata } from "next";
import Script from "next/script";
import { domain, locales, defaultLocale } from "../../i18n";
import Navbar from "@/components/Navbar";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";

type Locale = (typeof locales)[number];
type Props = { children: React.ReactNode; params: { locale: string } };

function isLocale(val: string): val is Locale {
  return (locales as readonly string[]).includes(val);
}

export function generateStaticParams() {
  return (locales as ReadonlyArray<Locale>).map((l: Locale) => ({ locale: l }));
}

function getAbsoluteSiteUrl(): string {
  const fromConfig = (domain ?? "").trim();
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "";
  const raw = fromConfig || fromEnv || "https://aberoai.com";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

// === loader yang merge root + per-namespace (features, dst.)
async function loadMessages(loc: Locale): Promise<AbstractIntlMessages> {
  const base =
    (await import(`../../messages/${loc}.json`)
      .then((m) => m.default)
      .catch(() => ({}))) as AbstractIntlMessages;

  const namespaces = ["features"] as const;

  const extraPairs = await Promise.all(
    namespaces.map(async (ns) => {
      try {
        const mod = (await import(`@/messages/${loc}/${ns}.json`)).default;
        return { [ns]: mod } as AbstractIntlMessages;
      } catch {
        return {} as AbstractIntlMessages;
      }
    })
  );

  return Object.assign({}, base, ...extraPairs);
}

export async function generateMetadata(
  { params: { locale } }: Props
): Promise<Metadata> {
  const loc: Locale = isLocale(locale) ? locale : defaultLocale;
  const site = getAbsoluteSiteUrl();

  const title =
    loc === "tr"
      ? "AberoAI – WhatsApp AI Müşteri Hizmetleri Otomasyonu"
      : "AberoAI – AI-Powered WhatsApp Customer Service Automation";

  const description =
    loc === "tr"
      ? "7/24 anında yanıt, tutarlı cevaplar ve ölçeklenebilir AI ile müşteri hizmetlerini otomatikleştirin."
      : "Automate customer service with 24/7 instant replies, consistent answers, and scalable AI.";

  const url = `${site}/${loc}`;
  // Siapkan gambar OG per-locale bila tersedia; fallback aman.
  const image = `${site}/og-${loc}.png`;

  return {
    metadataBase: new URL(site),
    alternates: {
      canonical: `/${loc}`,
      languages: { "x-default": "/", en: "/en", tr: "/tr" },
    },
    title,
    description,
    // ✅ Open Graph dinamis per locale
    openGraph: {
      title,
      description,
      url,
      siteName: "AberoAI",
      locale: loc,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "AberoAI Hero",
        },
      ],
    },
    // ✅ Twitter Card dinamis per locale
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  const loc: Locale | undefined = isLocale(locale) ? locale : undefined;
  if (!loc) notFound();

  setRequestLocale(loc);

  const messages = (await loadMessages(loc)) as AbstractIntlMessages;
  const site = getAbsoluteSiteUrl();

  return (
    <>
      <NextIntlClientProvider locale={loc} messages={messages}>
        <Navbar />
        {children}
      </NextIntlClientProvider>

      <Script
        id="ld-softwareapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AberoAI",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            inLanguage: loc,
            url: `${site}/${loc}`,
            description:
              loc === "tr"
                ? "AberoAI, 7/24 anında yanıt ve aynı anda binlerce mesajı karşılayabilen yapay zekâ ile müşteri hizmetlerini otomatikleştirir."
                : "AberoAI automates customer service with 24/7 instant replies and AI that handles thousands of messages at once.",
          }),
        }}
      />
    </>
  );
}
