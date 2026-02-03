// apps/frontend/app/[locale]/solutions/page.tsx

import Hero from "@/components/solutionspage/Hero";
import Page1 from "@/components/solutionspage/Page1";
import Page2 from "@/components/solutionspage/Page2";
import Page3 from "@/components/solutionspage/Page3";
import Page4 from "@/components/solutionspage/Page4";
import Page5 from "@/components/solutionspage/Page5";
import Page6 from "@/components/solutionspage/Page6";
import Page7 from "@/components/solutionspage/Page7";

export default function SolutionsLocalePage() {
  return (
    <main className="relative bg-white overflow-x-hidden">
      <Hero />
      <Page1 />
      <Page2 />
      <Page3 />
      <Page4 />
      <Page5 />
      <Page6 />
      <Page7 />
    </main>
  );
}
