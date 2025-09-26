// apps/frontend/components/FeaturesPage.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function FeaturesPage() {
  const t = useTranslations("features");
  const locale = useLocale();
  const pathnameRaw = usePathname() || "/";
  const m = pathnameRaw.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : ""; // konsisten dgn Navbar-mu

  const withLocale = (href: string) => {
    // biarkan external/absolute apa adanya
    if (/^https?:\/\//.test(href)) return href;
    // kalau anchor lokal (mis. "#demo"), tetap relatif
    if (href.startsWith("#")) return href;
    // pastikan prefix locale
    return `${localePrefix}${href.startsWith("/") ? href : `/${href}`}`;
  };

  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant", icon: "⚡️" },
    { key: "whatsapp", icon: "💬" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking", icon: "📅" },
    { key: "handoff", icon: "🤝" },
    { key: "analytics", icon: "📊" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <span className="inline-block rounded-full bg-black/5 px-3 py-1 text-xs text-foreground/70">
          {t("badge")}
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-foreground/70">{t("subtitle")}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ key, icon }) => (
          <div
            key={String(key)}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 text-2xl" aria-hidden>
              {icon}
            </div>
            <h3 className="text-base font-medium">{t(`cards.${key}.title`)}</h3>
            <p className="mt-1 text-sm text-foreground/70">{t(`cards.${key}.desc`)}</p>
          </div>
        ))}
      </section>

      <div className="mt-10 flex gap-3">
        {/* anchor lokal: tetap di halaman saat ini */}
        <a
          href="#demo"
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          {t("cta.primary")}
        </a>
        {/* route lain: locale-aware */}
        <a
          href={withLocale("/contact")}
          className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5"
        >
          {t("cta.secondary")}
        </a>
      </div>
    </main>
  );
}

type IntlMessages = {
  features: {
    badge: string;
    title: string;
    subtitle: string;
    cards: {
      instant: { title: string; desc: string };
      whatsapp: { title: string; desc: string };
      multilingual: { title: string; desc: string };
      booking: { title: string; desc: string };
      handoff: { title: string; desc: string };
      analytics: { title: string; desc: string };
    };
    cta: { primary: string; secondary: string };
  };
};
