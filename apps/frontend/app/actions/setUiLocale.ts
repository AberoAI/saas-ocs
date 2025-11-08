// apps/frontend/app/actions/setUiLocale.ts
"use server";

import { cookies } from "next/headers";

type Locale = "en" | "tr";

/**
 * Set ui-locale untuk prefix route tertentu.
 * lc: bahasa UI yang dipilih user
 * routeLocale: prefix URL aktif (/en atau /tr)
 */
export async function setUiLocale(lc: Locale, routeLocale: Locale) {
  if ((lc !== "en" && lc !== "tr") || (routeLocale !== "en" && routeLocale !== "tr")) {
    return;
  }

  // Di environment kamu cookies() adalah Promise -> pakai await
  const store = await cookies();

  // Harus SELALU sama dengan key di layout.tsx
  const key = `ui-locale-v2-${routeLocale}`;

  store.set(key, lc, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
    sameSite: "lax",
    secure: true,
    // domain: ".aberoai.com", // aktifkan kalau pakai subdomain
  });
}
