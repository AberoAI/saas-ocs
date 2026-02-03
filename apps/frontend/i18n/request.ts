// apps/frontend/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  const lc = (locales as readonly string[]).includes(locale) ? locale : "en";

  const common = (await import(`@/messages/${lc}/common.json`))
    .default as unknown as AbstractIntlMessages;

  const landing = (await import(`@/messages/${lc}/landing.json`))
    .default as unknown as AbstractIntlMessages;

  return {
    locale: lc,
    messages: {
      ...common,
      ...landing,
    } as AbstractIntlMessages,
  };
});
