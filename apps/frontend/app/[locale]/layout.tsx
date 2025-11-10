// apps/frontend/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { I18nProvider } from "@/context/I18nContext";

import { locales as supportedLocales } from "../../i18n/routing";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Locale = (typeof supportedLocales)[number];
type Props = { children: React.ReactNode; params: { locale: string } };

const defaultLocale: Locale = "en";

const isLocale = (v: string | undefined): v is Locale =>
  !!v && (supportedLocales as readonly string[]).includes(v);

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

  // Beritahu next-intl tentang locale dari URL (untuk routing & SEO)
  setRequestLocale(routeLocale);

  const flagOn = process.env.NEXT_PUBLIC_UI_LOCALE_COOKIE === "true";

  const cookieStore = await cookies();

  const cookieKey = `ui-locale-v2-${routeLocale}`;
  const rawCookie = cookieStore.get(cookieKey)?.value;

  const uiLocale: Locale =
    flagOn && rawCookie && isLocale(rawCookie)
      ? (rawCookie as Locale)
      : routeLocale;

  const messages = (await loadMessages(uiLocale)) as AbstractIntlMessages;
  const site = getAbsoluteSiteUrl();

  return (
    <>
      <NextIntlClientProvider locale={uiLocale} messages={messages}>
        <I18nProvider routeLocale={routeLocale} uiLocale={uiLocale}>
          <Navbar />
          {/* Offset konten agar tidak tertutup navbar fixed */}
          <div className="pt-[72px]">
            {children}
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
    </>
  );
}
