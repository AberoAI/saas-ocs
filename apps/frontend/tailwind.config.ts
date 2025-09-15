// apps/frontend/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // warna brand tidak perlu di-extend di sini,
      // karena sudah didefinisikan lewat @theme inline di globals.css
    },
  },
  plugins: [],
};

export default config;
