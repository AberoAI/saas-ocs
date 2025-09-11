// apps/frontend/app/[locale]/layout.tsx
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, type AbstractIntlMessages} from 'next-intl';
// ⛔️ HAPUS: getMessages (sering memicu 500 di prod)
// import {getMessages} from 'next-intl/server';
import type {Metadata} from 'next';
import Script from 'next/script';
import {domain, locales, defaultLocale} from '../i18n';

export const dynamic = 'force-static'; // landing cenderung statis

type Locale = (typeof locales)[number];
type Props = {children: React.ReactNode; params: {locale: string}};

function isLocale(val: string): val is Locale {
  return (locales as readonly string[]).includes(val);
}

export async function generateMetadata(
  {params: {locale}}: Props
): Promise<Metadata> {
  const loc: Locale = isLocale(locale) ? locale : defaultLocale;

  return {
    metadataBase: new URL(domain),
    alternates: {
      canonical: `/${loc}`,
      languages: {
        en: '/en',
        tr: '/tr'
      }
    },
    title: loc === 'tr'
      ? 'AberoAI – WhatsApp AI Müşteri Hizmetleri Otomasyonu'
      : 'AberoAI – AI-Powered WhatsApp Customer Service Automation',
    description: loc === 'tr'
      ? '7/24 anında yanıt, tutarlı cevaplar ve ölçeklenebilir AI ile müşteri hizmetlerini otomatikleştirin.'
      : 'Automate customer service with 24/7 instant replies, consistent answers, and scalable AI.'
  };
}

export default async function LocaleLayout({children, params: {locale}}: Props) {
  const loc: Locale | undefined = isLocale(locale) ? locale : undefined;
  if (!loc) notFound();

  // ✅ FIX: muat messages langsung dari file JSON per-locale
  let messages: AbstractIntlMessages;
  try {
    // Path relatif dari app/[locale]/layout.tsx → ../../messages/{en|tr}.json
    messages = (await import(`../../messages/${loc}.json`)).default;
  } catch {
    notFound();
  }

  // Structured Data per-locale (aman tanpa harga; tambahkan offers nanti jika perlu)
  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AberoAI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "inLanguage": loc,
    "url": `${domain}/${loc}`,
    "description":
      loc === 'tr'
        ? "AberoAI, 7/24 anında yanıt ve aynı anda binlerce mesajı karşılayabilen yapay zekâ ile müşteri hizmetlerini otomatikleştirir."
        : "AberoAI automates customer service with 24/7 instant replies and AI that handles thousands of messages at once."
  };

  return (
    <html lang={loc}>
      <body>
        <NextIntlClientProvider messages={messages} locale={loc}>
          {children}
        </NextIntlClientProvider>

        {/* Structured Data (JSON-LD) */}
        <Script id="ld-softwareapp" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </body>
    </html>
  );
}
