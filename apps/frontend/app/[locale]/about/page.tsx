// apps/frontend/app/[locale]/about/page.tsx
import type { Metadata } from "next";
// ✅ Gunakan alias absolut agar stabil di TS & Next
import AboutView from "@/app/about/_AboutView";
import type { AboutCopy } from "@/app/about/types";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    languages: {
      en: "/en/about",
      tr: "/tr/hakkinda",
    },
  },
};

type PageProps = { params: { locale: string } };

// ✅ Adapter: mapping about.json (yang kompleks) → AboutCopy (sederhana)
function toAboutCopy(raw: any, isTR: boolean, localePrefix: string): AboutCopy {
  const paragraphs: string[] = [];

  if (Array.isArray(raw?.mission?.ps)) {
    paragraphs.push(...raw.mission.ps);
  }
  if (raw?.what?.p1) {
    paragraphs.push(raw.what.p1);
  }
  if (Array.isArray(raw?.features?.items) && raw.features.items.length) {
    paragraphs.push(isTR ? "Temel Özellikler:" : "Key Features:");
    paragraphs.push(
      ...raw.features.items.map((s: string) => (s?.startsWith("•") ? s : `• ${s}`))
    );
  }
  if (Array.isArray(raw?.value?.items) && raw.value.items.length) {
    paragraphs.push(isTR ? "Katma Değer:" : "Added Value:");
    paragraphs.push(
      ...raw.value.items.map((s: string) => (s?.startsWith("•") ? s : `• ${s}`))
    );
  }
  if (raw?.how?.p1) {
    paragraphs.push(raw.how.p1);
  }
  if (Array.isArray(raw?.principles?.items) && raw.principles.items.length) {
    paragraphs.push(isTR ? "AberoAI’nin Çalışma İlkeleri:" : "AberoAI Principles:");
    paragraphs.push(
      ...raw.principles.items.map((s: string) => (s?.startsWith("•") ? s : `• ${s}`))
    );
  }
  if (Array.isArray(raw?.outcomes?.items) && raw.outcomes.items.length) {
    paragraphs.push(isTR ? "Sonuçlar:" : "Outcomes:");
    paragraphs.push(
      ...raw.outcomes.items.map((s: string) => (s?.startsWith("•") ? s : `• ${s}`))
    );
  }
  if (typeof raw?.outcomes?.closer === "string" && raw.outcomes.closer.trim()) {
    paragraphs.push(raw.outcomes.closer.trim());
  }

  const title =
    typeof raw?.title === "string" && raw.title.trim()
      ? raw.title
      : isTR
      ? "AberoAI Hakkında"
      : "About AberoAI";

  const contactCta =
    raw?.contact && typeof raw.contact.link === "string"
      ? raw.contact.link
      : isTR
      ? "İletişim"
      : "Contact";

  const ctaHref = `${localePrefix}/contact`;

  return {
    title,
    paragraphs,
    ctaLabel: contactCta,
    ctaHref,
  };
}

// ✅ Gunakan params.locale (bukan hooks) → aman untuk prerender statik
export default async function AboutLocalePage({ params: { locale } }: PageProps) {
  const isTR = (locale ?? "").toLowerCase().startsWith("tr");
  const localePrefix = isTR ? "/tr" : "/en";

  // Muat about.json sesuai locale (fallback ke EN bila tidak ada)
  let raw: any;
  try {
    raw = (await import(`@/messages/${isTR ? "tr" : "en"}/about.json`)).default;
  } catch {
    raw = (await import("@/messages/en/about.json")).default;
  }

  const copy: AboutCopy = toAboutCopy(raw, isTR, localePrefix);
  return <AboutView copy={copy} localePrefix={localePrefix} />;
}
