// apps/frontend/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { locales } from "./routing";

// Pakai alias "@/messages" → menuju app/messages/* (aman & konsisten dengan layout.tsx)
export default getRequestConfig(async ({ locale }) => {
  const lc = (locales as readonly string[]).includes(locale) ? locale : "en";

  const messages =
    (await import(`@/messages/${lc}.json`)).default as unknown as AbstractIntlMessages;

  return {
    locale: lc,
    messages,
  };
});
