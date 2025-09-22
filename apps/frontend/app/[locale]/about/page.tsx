// apps/frontend/app/[locale]/about/page.tsx
"use client";
import { useLocale } from "next-intl";
import AboutView from "../../about/_AboutView";
import { aboutEn } from "../../about/en";
import { aboutTr } from "../../about/tr";

export default function AboutLocalePage() {
  const locale = useLocale();
  const copy = locale.toLowerCase().startsWith("tr") ? aboutTr : aboutEn;
  return <AboutView copy={copy} />;
}
