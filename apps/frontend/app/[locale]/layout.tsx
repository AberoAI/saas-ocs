// apps/frontend/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import type { Metadata } from "next";
import Script from "next/script";
import { domain, locales, defaultLocale } from "../i18n";
import Navbar from "@/components/Navbar"; // ✅ ADD
import { setRequestLocale } from "next-intl/server"; // ✅ [ADD] penting agar statik

export const dynamic = "force-static";

type Locale = (typeof locales)[number];
type Props = { children: React.ReactNode; params: { locale: string } };

function isLocale(val: string): val is Locale {
  return (locales as readonly string[]).includes(val);
}

// 🔑 Pastikan Next membangun /en dan /tr
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

import enMessages from "../../messages/en.json";
import trMessages from "../../messages/tr.json";
const MESSAGES: Record<"en" | "tr", AbstractIntlMessages> = {
  en: (enMessages as AbstractIntlMessages) ?? {},
  tr: (trMessages as AbstractIntlMessages) ?? {},
} as const;

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

  // ✅ [ADD] kunci locale di level layout agar next-intl tidak memicu dynamic headers
  setRequestLocale(loc);

  const messages = (MESSAGES[loc as "en" | "tr"] ?? {}) as AbstractIntlMessages;
  const site = getAbsoluteSiteUrl();

  return (
    <>
      <NextIntlClientProvider locale={loc} messages={messages}>
        {/* ✅ Navbar sekarang di dalam provider lokal → i18n benar di /tr & /en */}
        <Navbar />
        {children}
      </NextIntlClientProvider>

      {/* Structured Data (JSON-LD) */}
      <Script
        id="ld-softwareapp"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
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
