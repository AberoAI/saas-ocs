module.exports = {
  // Meng-extend konfigurasi dasar dari Next.js, Turbo, dan Prettier
  extends: [
    "next", // ESLint config Next.js
    "turbo", // ESLint config dari turbo repo
    "prettier", // Supaya tidak konflik dengan Prettier formatting
  ],
  // Aturan tambahan (optional)
  rules: {
    // Contoh: mematikan warning unused vars
    "no-unused-vars": "warn",

    // Contoh: menonaktifkan aturan yang dianggap kurang relevan
    "react/react-in-jsx-scope": "off",
  },
  // Parser options bisa ditambah kalau perlu
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: [
    // Daftar plugin yang digunakan, jika ada
  ],
};
