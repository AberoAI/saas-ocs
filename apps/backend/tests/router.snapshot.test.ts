// apps/backend/tests/router.snapshot.test.ts
import { describe, it, expect } from "vitest";
import { appRouter } from "../src/server/routers";

describe("appRouter shape", () => {
  it("root hanya namespace & tidak mengandung nama tabu", () => {
    const rec = (appRouter as any)._def?.record ?? {};
    const keys = Object.keys(rec);

    // Tidak boleh ada prosedur/tabu di ROOT
    const forbidden = new Set([
      "Provider",
      "useContext",
      "useUtils",
      "createClient",
    ]);

    // Semua nilai root wajib router (punya _def.record)
    for (const k of keys) {
      const val = rec[k];
      expect(val?._def?.record).toBeDefined();
      expect(forbidden.has(k)).toBe(false);
    }

    // Snapshot agar gampang review perubahan struktur root
    expect(keys.sort()).toMatchInlineSnapshot(`
      [
        "admin",
        "billing",
        "chat",
        "customer",
        "provider",
        "system",
        "webhook",
      ]
    `);
  });

  it("system.healthcheck tetap ada & berfungsi sebagai procedure", async () => {
    const sys = (appRouter as any)._def.record.system;
    const health = sys?._def?.record?.healthcheck;
    expect(typeof health).toBe("object"); // procedure node
  });
});
