// apps/frontend/tailwind.config.ts
import type { Config } from "tailwindcss";

const withOpacity =
  (variable: string) =>
  ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `rgb(var(${variable}))`
      : `rgb(var(${variable}) / ${opacityValue})`;

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // brand → text-brand, bg-brand, border-brand, etc.
        brand: withOpacity("--color-brand"),
      },
    },
  },
  plugins: [],
} satisfies Config;
