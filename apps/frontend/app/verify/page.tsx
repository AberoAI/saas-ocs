// apps/frontend/app/verify/page.tsx
import type { Metadata } from "next";
import VerificationLanding from "../_components/VerificationLanding";

export const metadata: Metadata = {
  title: "Business Verification – AberoAI",
  description:
    "Public verification page for AberoAI (WhatsApp Cloud API + AI customer service).",
  alternates: { canonical: "/verify" },
};

export default function VerifyPage() {
  return <VerificationLanding />;
}
