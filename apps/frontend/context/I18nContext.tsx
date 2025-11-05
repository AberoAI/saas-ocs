"use client";

import { createContext, useContext } from "react";

export type Lc = "en" | "tr";

/**
 * Context i18n ringan untuk memberi akses { routeLocale, uiLocale } ke komponen client.
 * (Akan dipakai jika layout kamu nantinya menyuntikkan nilai ini via I18nProvider.)
 */
export const I18nContext = createContext<{ routeLocale: Lc; uiLocale: Lc } | null>(null);

export function useI18nContext() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Tidak fatal untuk navbar sekarang, tapi lebih aman diberi error agar cepat ketahuan saat di-wire di layout.
    throw new Error("I18nContext missing. Wrap subtree with <I18nProvider> in the server layout.");
  }
  return ctx;
}
