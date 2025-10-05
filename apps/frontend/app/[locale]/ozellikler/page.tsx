import FeaturesPage from "@/components/features/FeaturesPage";

export const metadata = {
  alternates: {
    languages: {
      en: "/en/features",
      tr: "/tr/ozellikler",
    },
  },
};

export default function OzelliklerPage() {
  return <FeaturesPage />;
}
