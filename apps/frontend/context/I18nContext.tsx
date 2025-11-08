"use client";

import { createContext, useContext } from "react";

export type Lc = "en" | "tr";

type I18nContextValue = {
  routeLocale: Lc;
  uiLocale: Lc;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider(props: I18nContextValue & { children: React.ReactNode }) {
  const { routeLocale, uiLocale, children } = props;
  return (
    <I18nContext.Provider value={{ routeLocale, uiLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within <I18nProvider>.");
  }
  return ctx;
}
