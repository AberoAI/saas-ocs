// apps/frontend/app/[locale]/features/page.tsx
import FeaturesPage from "@/components/features/FeaturesPage";

export const metadata = {
  alternates: {
    languages: {
      en: "/en/features",
      tr: "/tr/ozellikler",
    },
  },
};

export default function Page() {
  // Provider sudah disiapkan di [locale]/layout.tsx; cukup render komponennya.
  return <FeaturesPage />;
}
