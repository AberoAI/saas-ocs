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

  // ambil copy dari messages JSON per-locale (sejalan dengan Features)
  const copy = (await import(`@/messages/${isTR ? "tr" : "en"}/about.json`))
    .default as AboutCopy;

  // prefix untuk tautan internal (mis. /en/contact atau /tr/contact)
  const localePrefix = isTR ? "/tr" : "/en";

  return <AboutView copy={copy} localePrefix={localePrefix} />;
}
