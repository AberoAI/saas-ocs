// apps/frontend/i18n/getUiRequestConfig.ts
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import type { AbstractIntlMessages } from "next-intl";

const UI_LOCALE_COOKIE = "ui-locale";
const SUPPORTED: ReadonlyArray<"en" | "tr"> = ["en", "tr"];

async function defaultUILocaleForMarket(): Promise<"en" | "tr"> {
  try {
    const hdrs = await headers();
    const referer = hdrs.get("referer") || "";
    return referer.includes("/tr") ? "tr" : "en";
  } catch {
    return "en";
  }
}

export default getRequestConfig(async () => {
  // ✅ gunakan await di cookies() dan headers()
  const store = await cookies();
  const cookieVal = store.get(UI_LOCALE_COOKIE)?.value as "en" | "tr" | undefined;
  const uiLocale = cookieVal || (await defaultUILocaleForMarket());
  const locale: "en" | "tr" = SUPPORTED.includes(uiLocale) ? uiLocale : "en";

  const messages = (await import(`../messages/${locale}.json`))
    .default as AbstractIntlMessages;

  return { locale, messages };
});
