// apps/frontend/app/[locale]/layout.tsx

import { notFound } from "next/navigation";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { setRequestLocale } from "next-intl/server";
import { I18nProvider } from "@/context/I18nContext";
import Providers from "../providers";

import Footer from "@/components/footer";
import {
  locales as supportedLocales,
  defaultLocale,
  type Locale,
} from "@/i18n/config";

type Props = { children: React.ReactNode; params: { locale: string } };

const isLocale = (v: string | undefined): v is Locale =>
  !!v && (supportedLocales as readonly string[]).includes(v);

export function generateStaticParams() {
  return (supportedLocales as ReadonlyArray<Locale>).map((l) => ({
    locale: l,
  }));
}

function getAbsoluteSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "";
  const raw = fromEnv || "https://aberoai.com";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

async function loadMessages(loc: Locale): Promise<AbstractIntlMessages> {
  const common = (await import(`@/messages/${loc}/common.json`)
    .then((m) => m.default)
    .catch(() => ({}))) as AbstractIntlMessages;

  const landing = (await import(`@/messages/${loc}/landing.json`)
    .then((m) => m.default)
    .catch(() => ({}))) as AbstractIntlMessages;

  const namespaces = [
    "features",
    "foundation",
    "product",
    "solutions",
  ] as const;

  const extraPairs = await Promise.all(
    namespaces.map(async (ns) => {
      try {
        const mod = (await import(`@/messages/${loc}/${ns}.json`)).default;
        return { [ns]: mod } as AbstractIntlMessages;
      } catch {
        return {} as AbstractIntlMessages;
      }
    }),
  );

  return Object.assign({}, common, landing, ...extraPairs);
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const routeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const site = getAbsoluteSiteUrl();

  return {
    metadataBase: new URL(site),
    alternates: {
      canonical: `/${routeLocale}`,
      languages: { "x-default": "/", en: "/en", tr: "/tr" },
    },
    title:
      routeLocale === "tr"
        ? "AberoAI – WhatsApp AI Müşteri Hizmetleri Otomasyonu"
        : "AberoAI – AI-Powered WhatsApp Customer Service Automation",
    description:
      routeLocale === "tr"
        ? "7/24 anında yanıt, tutarlı cevaplar ve ölçeklenebilir AI ile müşteri hizmetlerini otomatikleştirin."
        : "Automate customer service with 24/7 instant replies, consistent answers, and scalable AI.",
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  const routeLocale: Locale | undefined = isLocale(locale) ? locale : undefined;
  if (!routeLocale) notFound();

  // ✅ Single source of truth for locale binding (DO NOT duplicate in pages)
  setRequestLocale(routeLocale);

  const uiLocale: Locale = routeLocale;
  const messages = (await loadMessages(uiLocale)) as AbstractIntlMessages;
  const site = getAbsoluteSiteUrl();
  const showGlobalFooter = false;

  return (
    <Providers>
      <NextIntlClientProvider locale={uiLocale} messages={messages}>
        <I18nProvider routeLocale={routeLocale} uiLocale={uiLocale}>
          <Navbar />
          <div className="pt-[72px]">
            {children}
            {showGlobalFooter ? <Footer /> : null}
          </div>
        </I18nProvider>
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
            inLanguage: routeLocale,
            url: `${site}/${routeLocale}`,
            description:
              routeLocale === "tr"
                ? "AberoAI, 7/24 anında yanıt ve aynı anda binlerce mesajı karşılayabilen yapay zekâ ile müşteri hizmetlerini otomatikleştirir."
                : "AberoAI automates customer service with 24/7 instant replies and AI that handles thousands of messages at once.",
          }),
        }}
      />
    </Providers>
  );
}
