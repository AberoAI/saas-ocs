// apps/frontend/components/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function FeaturesPage() {
  const t = useTranslations("features");
  const pathnameRaw = usePathname() || "/";
  const m = pathnameRaw.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";

  const withLocale = (href: string) => {
    if (/^https?:\/\//.test(href)) return href; // eksternal/absolute
    if (href.startsWith("#")) return href;      // anchor lokal
    return `${localePrefix}${href.startsWith("/") ? href : `/${href}`}`;
  };

  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant",      icon: "⚡️" },
    { key: "multitenant",  icon: "🏢" },
    { key: "analytics",    icon: "📊" },
    { key: "handoff",      icon: "🤝" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking",      icon: "📅" },
  ];

  // BRAND color dipakai halus untuk badge/icon background (tidak mengubah sistem warna lain)
  const BRAND = "#26658C";

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* HERO — tampil di tengah layar saat pertama kali masuk */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs text-foreground/70"
          style={{ background: `${BRAND}14` }}
        >
          {t("badge")}
        </span>

        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
          {t("title")}
        </h1>

        <p className="mt-3 max-w-2xl text-base sm:text-lg text-foreground/70">
          {t("subtitle")}
        </p>

        {/* scroll cue */}
        <a
          href="#feature-list"
          className="mt-10 inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition"
          aria-label="Scroll to features"
        >
          <span className="text-sm">Scroll</span>
          <span className="animate-bounce" aria-hidden>↓</span>
        </a>
      </section>

      {/* FEATURES GRID */}
      <section id="feature-list" className="py-14">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ key, icon }) => (
            <div
              key={String(key)}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                aria-hidden
                style={{ background: `${BRAND}14`, color: BRAND }}
              >
                {icon}
              </div>

              <h3 className="text-base font-medium">{t(`cards.${key}.title`)}</h3>
              <p className="mt-1 text-sm text-foreground/70">{t(`cards.${key}.desc`)}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#demo"
            className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow transition"
            style={{ backgroundColor: BRAND }}
          >
            {t("cta.primary")}
          </a>

          <a
            href={withLocale("/contact")}
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 transition"
          >
            {t("cta.secondary")}
          </a>
        </div>
      </section>
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
      multitenant: { title: string; desc: string };
      analytics: { title: string; desc: string };
      handoff: { title: string; desc: string };
      multilingual: { title: string; desc: string };
      booking: { title: string; desc: string };
    };
    cta: { primary: string; secondary: string };
  };
};
