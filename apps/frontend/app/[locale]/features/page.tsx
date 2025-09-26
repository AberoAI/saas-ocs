// apps/frontend/app/[locale]/features/page.tsx
import {NextIntlClientProvider} from "next-intl";
import {getLocale} from "next-intl/server";
import FeaturesPage from "@/components/FeaturesPage";

export const metadata = {
  alternates: {
    languages: {
      en: "/en/features",
      tr: "/tr/ozellikler",
    },
  },
};

export default async function Page() {
  const locale = await getLocale();
  // muat hanya namespace 'features' untuk locale aktif
  const features = (await import(`@/messages/${locale}/features.json`)).default;

  return (
    <NextIntlClientProvider messages={{features}}>
      <FeaturesPage />
    </NextIntlClientProvider>
  );
}
