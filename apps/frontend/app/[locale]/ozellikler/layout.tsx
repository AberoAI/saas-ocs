import LenisProvider from "@/components/providers/LenisProvider";

export default function OzelliklerLayout({ children }: { children: React.ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}
