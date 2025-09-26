// apps/frontend/app/[locale]/features/page.tsx
import FeaturesPage from "@/components/FeaturesPage";

export const metadata = {
  // Alternates per-bahasa untuk SEO yang rapi
  alternates: {
    languages: {
      en: "/en/features",
      tr: "/tr/ozellikler",
    },
  },
};

export default function Page() {
  return <FeaturesPage />;
}
