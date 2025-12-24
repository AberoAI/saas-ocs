//apps/frontend/app/system-status/[locale]/page.tsx

import type { Metadata } from "next";
import SystemStatusView from "../../../components/system-status/SystemStatusView";
import { SYSTEM_STATUS_COPY_BY_LOCALE } from "../../../components/system-status/copy";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "AberoAI — System Status",
  description: "System status notification for AberoAI.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SystemStatusLocalePage({
  params,
}: {
  params: { locale: string };
}) {
  const uiLocale = params.locale === "tr" ? "tr" : "en";
  const copy = SYSTEM_STATUS_COPY_BY_LOCALE[uiLocale];
  return <SystemStatusView copy={copy} />;
}
