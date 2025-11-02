// apps/frontend/app/[locale]/verify/layout.tsx
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  // Keep simple, just hreflang alternates for SEO
  alternates: {
    languages: {
      en: '/en/verify',
      tr: '/tr/verify',
    },
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  // No wrappers needed; just render children
  return children;
}
