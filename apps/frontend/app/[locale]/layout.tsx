// apps/frontend/app/[locale]/layout.tsx
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type {Metadata} from 'next';
import Script from 'next/script'; // <-- DITAMBAHKAN
import {domain, locales, defaultLocale} from '../i18n';

export const dynamic = 'force-static'; // landing cenderung statis

type Props = {children: React.ReactNode; params: {locale: string}};

export async function generateMetadata(
  {params: {locale}}: Props
): Promise<Metadata> {
  // kecil: hindari reassign parameter
  const loc = (locales as readonly string[]).includes(locale) ? locale : defaultLocale;

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
  if (!(locales as readonly string[]).includes(locale)) notFound();
  const messages = await getMessages();

  // Structured Data per-locale (aman tanpa harga; tambahkan offers nanti jika perlu)
  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AberoAI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "inLanguage": locale,
    "url": `${domain}/${locale}`,
    "description":
      locale === 'tr'
        ? "AberoAI, 7/24 anında yanıt ve aynı anda binlerce mesajı karşılayabilen yapay zekâ ile müşteri hizmetlerini otomatikleştirir."
        : "AberoAI automates customer service with 24/7 instant replies and AI that handles thousands of messages at once."
    // "brand": {"@type":"Brand","name":"AberoAI"},
    // "sameAs": ["https://x.com/aberoai","https://www.linkedin.com/company/aberoai"]
    // "offers": { "@type":"Offer", "price": "49", "priceCurrency": "USD" } // jika harga publik & stabil
  };

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale as any}>
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
