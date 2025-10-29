// apps/frontend/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import Script from "next/script";
import { domain, locales, defaultLocale } from "../../i18n";
import Navbar from "@/components/Navbar";
import { setRequestLocale } from "next-intl/server";
import getUiRequestConfig from "@/i18n/getUiRequestConfig";

export const dynamic = "force-static";

type Locale = (typeof locales)[number];
type Props = { children: React.ReactNode; params: { locale: string } };

function isLocale(val: string): val is Locale {
  return (locales as readonly string[]).includes(val);
}

export function generateStaticParams() {
  return locales.map((l) => ({ locale: l }));
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

export async function generateMetadata(
  { params: { locale } }: Props
): Promise<Metadata> {
  const loc: Locale = isLocale(locale) ? locale : defaultLocale;
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
  const loc: Locale | undefined = isLocale(locale) ? locale : undefined;
  if (!loc) notFound();

  setRequestLocale(loc);

  // ✅ panggil dengan argumen minimal yang memenuhi tipe GetRequestConfigParams
  const { locale: uiLocale, messages } = await getUiRequestConfig({
    locale: loc,
    requestLocale: loc,
  } as any);

  const site = getAbsoluteSiteUrl();

  return (
    <>
      <NextIntlClientProvider locale={uiLocale} messages={messages}>
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
            inLanguage: uiLocale,
            url: `${site}/${loc}`,
            description:
              uiLocale === "tr"
                ? "AberoAI, 7/24 anında yanıt ve aynı anda binlerce mesajı karşılayabilen yapay zekâ ile müşteri hizmetlerini otomatikleştirir."
                : "AberoAI automates customer service with 24/7 instant replies and AI that handles thousands of messages at once.",
          }),
        }}
      />
    </>
  );
}
