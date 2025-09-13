// tests/i18n-override.spec.ts
import { test, expect } from '@playwright/test';

// ENV yang dibutuhkan saat jalan:
// PREVIEW_URL = https://<preview>.vercel.app (deployment Preview terbaru)
// PROD_URL    = https://aberoai.com             (atau domain produksi kamu)
// DEV_OVERRIDE_SECRET = token yang kamu set di Vercel Preview/Dev

const PREVIEW_BASE = process.env.PREVIEW_URL;
const PROD_BASE = process.env.PROD_URL;
const SECRET = process.env.DEV_OVERRIDE_SECRET;

test.describe('Locale/Geo override sanity', () => {
  test('Preview: override aktif (redirect + cookies terpasang)', async ({ page }) => {
    test.skip(!PREVIEW_BASE || !SECRET, 'Butuh PREVIEW_URL & DEV_OVERRIDE_SECRET');

    const url = `${PREVIEW_BASE}/tr/pricing?dev=${SECRET}&hl=en&geo=US&currency=USD`;
    const resp = await page.goto(url);

    // Harus ada redirect (>= 300)
    expect(resp?.status(), 'harus terjadi redirect').toBeGreaterThanOrEqual(300);

    // Mendarat di /en/pricing
    await page.waitForURL(/\/en\/pricing$/);

    // Cek cookies override
    const cookies = await page.context().cookies();
    const names = cookies.map(c => c.name);
    expect(names).toContain('NEXT_LOCALE');
    expect(names).toContain('GEO_COUNTRY_OVERRIDE');
    expect(names).toContain('CURRENCY_OVERRIDE');
  });

  test('Production: override tidak aktif', async ({ page }) => {
    test.skip(!PROD_BASE || !SECRET, 'Butuh PROD_URL & DEV_OVERRIDE_SECRET');

    const url = `${PROD_BASE}/tr/pricing?dev=${SECRET}&hl=en&geo=US&currency=USD`;
    await page.goto(url);

    // Tidak wajib redirect; yang penting cookie override TIDAK muncul
    const cookies = await page.context().cookies();
    const names = cookies.map(c => c.name);
    expect(names).not.toContain('GEO_COUNTRY_OVERRIDE');
    expect(names).not.toContain('CURRENCY_OVERRIDE');
  });
});
