// apps/frontend/app/[locale]/layout.tsx
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, type AbstractIntlMessages} from 'next-intl';
import type {Metadata} from 'next';
import Script from 'next/script';
import {domain, locales, defaultLocale} from '../i18n';

export const dynamic = 'force-static';

type Locale = (typeof locales)[number];
type Props = {children: React.ReactNode; params: {locale: string}};

function isLocale(val: string): val is Locale {
  return (locales as readonly string[]).includes(val);
}

/** Pastikan URL absolut (hindari throw di new URL()) */
function getAbsoluteSiteUrl(): string {
  const fromConfig = (domain ?? '').trim();
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    '';
  const raw = fromConfig || fromEnv || 'https://aberoai.com';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

// Muat messages via mapping eksplisit (stabil di prod)
const MESSAGE_LOADERS: Record<Locale, () => Promise<{default: AbstractIntlMessages}>> = {
  en: () => import('../../messages/en.json'),
  tr: () => import('../../messages/tr.json')
};

export async function generateMetadata(
  {params: {locale}}: Props
): Promise<Metadata> {
  const loc: Locale = isLocale(locale) ? locale : defaultLocale;
  const site = getAbsoluteSiteUrl();

  return {
    metadataBase: new URL(site),
    alternates: {
      canonical: `/${loc}`,
      languages: { en: '/en', tr: '/tr' }
    },
    title:
      loc === 'tr'
        ? 'AberoAI – WhatsApp AI Müşteri Hizmetleri Otomasyonu'
        : 'AberoAI – AI-Powered WhatsApp Customer Service Automation',
    description:
      loc === 'tr'
        ? '7/24 anında yanıt, tutarlı cevaplar ve ölçeklenebilir AI ile müşteri hizmetlerini otomatikleştirin.'
        : 'Automate customer service with 24/7 instant replies, consistent answers, and scalable AI.'
  };
}

export default async function LocaleLayout({children, params: {locale}}: Props) {
  const loc: Locale | undefined = isLocale(locale) ? locale : undefined;
  if (!loc) notFound();

  let messages: AbstractIntlMessages;
  try {
    messages = (await MESSAGE_LOADERS[loc]()).default;
  } catch (e) {
    // fallback ke defaultLocale bila paket pesan locale gagal dimuat
    try {
      messages = (await MESSAGE_LOADERS[defaultLocale as Locale]()).default;
    } catch {
      notFound();
    }
  }

  const site = getAbsoluteSiteUrl();

  // ⚠️ TIDAK ADA <html> / <body> DI SINI — itu milik app/layout.tsx
  return (
    <>
      <NextIntlClientProvider
        messages={messages}
        locale={loc}
        /** Jangan crash jika key belum tersedia */
        getMessageFallback={({key}) => key}
        onError={() => { /* swallow intl errors in prod */ }}
      >
        {children}
      </NextIntlClientProvider>

      {/* Structured Data (JSON-LD) */}
      <Script
        id="ld-softwareapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AberoAI",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "inLanguage": loc,
            "url": `${site}/${loc}`,
            "description":
              loc === 'tr'
                ? "AberoAI, 7/24 anında yanıt ve aynı anda binlerce mesajı karşılayabilen yapay zekâ ile müşteri hizmetlerini otomatikleştirir."
                : "AberoAI automates customer service with 24/7 instant replies and AI that handles thousands of messages at once."
          })
        }}
      />
    </>
  );
}
