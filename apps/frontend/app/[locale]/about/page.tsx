// apps/frontend/app/[locale]/about/page.tsx
import type { Metadata } from "next";
import AboutView from "../../about/_AboutView";
import type { AboutCopy } from "../../about/types";
import { getLocale } from "next-intl/server";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    languages: {
      en: "/en/about",
      tr: "/tr/hakkinda",
    },
  },
};

export default async function AboutLocalePage() {
  const locale = (await getLocale()).toLowerCase();
  const isTR = locale.startsWith("tr");
  const localePrefix = isTR ? "/tr" : "/en";

  // Muat JSON per-locale; fallback aman ke EN kalau file tidak ditemukan
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
