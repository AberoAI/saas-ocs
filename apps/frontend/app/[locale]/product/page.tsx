// apps/frontend/app/[locale]/product/page.tsx

import Hero from "@/components/productpage/Hero";
import Page1 from "@/components/productpage/Page1";
import Page2 from "@/components/productpage/Page2";
import Page3 from "@/components/productpage/Page3";
import Page4 from "@/components/productpage/Page4";
import Page5 from "@/components/productpage/Page5";
import Page6 from "@/components/productpage/Page6";
import Page7 from "@/components/productpage/Page7";
import Page8 from "@/components/productpage/Page8";
import Page9 from "@/components/productpage/Page9";
import Page10 from "@/components/productpage/Page10";
import Page11 from "@/components/productpage/Page11";

export default function ProductLocalePage() {
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
      <Page8 />
      <Page9 />
      <Page10 />
      <Page11 />
    </main>
  );
}
