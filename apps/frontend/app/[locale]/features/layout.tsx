import LenisProvider from "@/components/providers/LenisProvider";

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  // Lenis + scrollerProxy hanya aktif di segmen /[locale]/features/**
  return <LenisProvider>{children}</LenisProvider>;
}
