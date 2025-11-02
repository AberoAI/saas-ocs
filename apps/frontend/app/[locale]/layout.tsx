// apps/frontend/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { setRequestLocale } from "next-intl/server";

// Pakai locales dari routing
import { locales as supportedLocales } from "../../i18n/routing";

export const dynamic = "force-static";

type Locale = (typeof supportedLocales)[number];
type Props = { children: React.ReactNode; params: { locale: string } };

const defaultLocale: Locale = "en";

function isLocale(val: string): val is Locale {
  return (supportedLocales as readonly string[]).includes(val);
}

export function generateStaticParams() {
  return (supportedLocales as ReadonlyArray<Locale>).map((l) => ({ locale: l }));
}

function getAbsoluteSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "";
  const raw = fromEnv || "https://aberoai.com";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

// Merge root messages + namespace opsional (mis. "features")
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
  const loc: Locale = isLocale(locale) ? (locale as Locale) : defaultLocale;
  const site = getAbsoluteSiteUrl();

  return {
    metadataBase: new URL(site),
    alternates: {
      canonical: `/${loc}`,
      languages: { "x-default": "/", en: "/en", tr: "/tr" },
    },
    title:
      loc === "tr"
        ? "AberoAI – WhatsApp AI Müşteri Hizmetleri Otomasyonu"
        : "AberoAI – AI-Powered WhatsApp Customer Service Automation",
    description:
      loc === "tr"
        ? "7/24 anında yanıt, tutarlı cevaplar ve ölçeklenebilir AI ile müşteri hizmetlerini otomatikleştirin."
        : "Automate customer service with 24/7 instant replies, consistent answers, and scalable AI.",
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  const loc: Locale | undefined = isLocale(locale) ? (locale as Locale) : undefined;
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
