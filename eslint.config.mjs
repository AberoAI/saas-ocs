// eslint.config.mjs (root)
import next from "eslint-config-next";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...next, // Next.js rules (flat config)
  ...tseslint.configs.recommended, // TS rules (tanpa type-aware, cepat di CI)
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      // tambahkan output lain bila perlu
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // tambah aturan lain di sini bila perlu
    },
  },
];
