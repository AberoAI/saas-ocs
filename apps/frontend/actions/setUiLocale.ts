"use server";

import { cookies } from "next/headers";

/**
 * Menulis cookie ui-locale secara aman dari server.
 */
export async function setUiLocale(lc: "en" | "tr") {
  if (lc !== "en" && lc !== "tr") return;

  const store = await cookies(); // ✅ Next 15: async
  store.set("ui-locale", lc, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
    sameSite: "lax",
    secure: true,
    // domain: ".aberoai.com", // aktifkan kalau pakai subdomain
  });
}
