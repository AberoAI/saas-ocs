// apps/frontend/app/[locale]/about/page.tsx
import type { Metadata } from "next";
import AboutView from "../../about/_AboutView";
import type { AboutCopy } from "../../about/types";

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

// ✅ Ambil locale dari params (BUKAN getLocale) agar TR benar-benar memuat copy TR
export default async function AboutLocalePage({ params: { locale } }: PageProps) {
  const isTR = (locale ?? "").toLowerCase().startsWith("tr");
  const localePrefix = isTR ? "/tr" : "/en";

  // Muat JSON per-locale; fallback aman ke EN jika file tidak ditemukan
  let copy: AboutCopy;
  try {
    copy = (
      await import(`@/messages/${isTR ? "tr" : "en"}/about.json`)
    ).default as AboutCopy;
  } catch {
    copy = (await import("@/messages/en/about.json")).default as AboutCopy;
  }

  return <AboutView copy={copy} localePrefix={localePrefix} />;
}
