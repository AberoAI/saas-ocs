// .eslintrc.cjs (tambahkan ke rules atau buat file baru lalu merge)
module.exports = {
  rules: {
    // pseudo rule (pakai lint custom jika perlu):
    // "no-trpc-root-procedures": "error"
  },
  overrides: [
    {
      files: ["apps/backend/src/server/routers/index.ts"],
      rules: {
        "no-restricted-syntax": [
          "error",
          {
            selector: "Property[key.name=/^(Provider|useContext|useUtils|createClient)$/]",
            message:
              "Jangan menaruh prosedur di ROOT router dengan nama yang bertabrakan dengan helper React tRPC. Pindahkan ke namespace.",
          },
        ],
      },
    },
  ],
};
