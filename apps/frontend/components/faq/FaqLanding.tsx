// apps/frontend/components/faq/FaqLanding.tsx

"use client";

import { useTranslations } from "next-intl";
import FaqSection from "./FaqSection";

type FaqItem = {
  q: string;
  a: string;
};

export default function FaqLanding() {
  const t = useTranslations();

  const headline = t("page8.headline");
  const items = t.raw("page8.items") as FaqItem[];

  return <FaqSection headline={headline} items={items} />;
}
