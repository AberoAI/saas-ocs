// apps/frontend/app/[locale]/about/page.tsx
import type { Metadata } from "next";
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

/** ── Raw shape dari about.json (longgar & optional-safe) ─────────────── */
type RawAbout = {
  title?: string;
  mission?: { title?: string; ps?: unknown };
  what?: { title?: string; p1?: unknown };
  features?: { title?: string; items?: unknown };
  value?: { title?: string; items?: unknown };
  how?: { title?: string; p1?: unknown };
  principles?: { title?: string; items?: unknown };
  outcomes?: { title?: string; items?: unknown; closer?: unknown };
  contact?: { prefix?: unknown; link?: unknown };
};

/** ── Type guards kecil ───────────────────────────────────────────────── */
function isString(v: unknown): v is string {
  return typeof v === "string";
}
function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}
function asString(v: unknown): string | undefined {
  return isString(v) ? v : undefined;
}

/** ── Adapter: RawAbout (kompleks) → AboutCopy (sederhana) ───────────── */
function toAboutCopy(rawUnknown: unknown, isTR: boolean, localePrefix: string): AboutCopy {
  const raw = (rawUnknown ?? {}) as RawAbout;

  const paragraphs: string[] = [];

  if (isStringArray(raw.mission?.ps)) {
    paragraphs.push(...raw.mission!.ps!);
  }
  const whatP1 = asString(raw.what?.p1);
  if (whatP1) paragraphs.push(whatP1);

  if (isStringArray(raw.features?.items) && raw.features!.items!.length) {
    paragraphs.push(isTR ? "Temel Özellikler:" : "Key Features:");
    paragraphs.push(
      ...raw.features!.items!.map((s) => (s.startsWith("•") ? s : `• ${s}`))
    );
  }

  if (isStringArray(raw.value?.items) && raw.value!.items!.length) {
    paragraphs.push(isTR ? "Katma Değer:" : "Added Value:");
    paragraphs.push(...raw.value!.items!.map((s) => (s.startsWith("•") ? s : `• ${s}`)));
  }

  const howP1 = asString(raw.how?.p1);
  if (howP1) paragraphs.push(howP1);

  if (isStringArray(raw.principles?.items) && raw.principles!.items!.length) {
    paragraphs.push(isTR ? "AberoAI’nin Çalışma İlkeleri:" : "AberoAI Principles:");
    paragraphs.push(
      ...raw.principles!.items!.map((s) => (s.startsWith("•") ? s : `• ${s}`))
    );
  }

  if (isStringArray(raw.outcomes?.items) && raw.outcomes!.items!.length) {
    paragraphs.push(isTR ? "Sonuçlar:" : "Outcomes:");
    paragraphs.push(
      ...raw.outcomes!.items!.map((s) => (s.startsWith("•") ? s : `• ${s}`))
    );
  }

  const closer = asString(raw.outcomes?.closer);
  if (closer?.trim()) paragraphs.push(closer.trim());

  const title =
    isString(raw.title) && raw.title.trim()
      ? raw.title
      : isTR
      ? "AberoAI Hakkında"
      : "About AberoAI";

  const contactLink =
    isString(raw.contact?.link) && raw.contact!.link!.trim()
      ? raw.contact!.link!
      : isTR
      ? "İletişim"
      : "Contact";

  return {
    title,
    paragraphs,
    ctaLabel: contactLink,
    ctaHref: `${localePrefix}/contact`,
  };
}

// ✅ Tidak memakai hooks; aman untuk prerender statik
export default async function AboutLocalePage({ params: { locale } }: PageProps) {
  const isTR = (locale ?? "").toLowerCase().startsWith("tr");
  const localePrefix = isTR ? "/tr" : "/en";

  // Import sebagai unknown → diadaptasikan via toAboutCopy (tanpa any)
  let rawUnknown: unknown;
  try {
    rawUnknown = (await import(`@/messages/${isTR ? "tr" : "en"}/about.json`)).default;
  } catch {
    rawUnknown = (await import("@/messages/en/about.json")).default;
  }

  const copy: AboutCopy = toAboutCopy(rawUnknown, isTR, localePrefix);
  return <AboutView copy={copy} localePrefix={localePrefix} />;
}
