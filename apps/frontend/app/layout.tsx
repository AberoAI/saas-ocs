// apps/frontend/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// Font configuration (CSS vars dipakai di globals.css)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AberoAI",
  description: "AI-powered Online Customer Service Automation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "min-h-screen antialiased",
          // gunakan CSS vars dari globals.css (scalable untuk theming)
          "bg-[var(--background)] text-[var(--foreground)]",
        ].join(" ")}
      >
        {/* Global providers (NextAuth, tRPC, Theme, dsb) */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
