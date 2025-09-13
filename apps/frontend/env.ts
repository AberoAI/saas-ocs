// apps/frontend/env.ts
// Ringan: kumpulkan & validasi ENV di satu tempat

const toBool = (v?: string) => (v ?? '').toLowerCase() === 'true';
const toStr  = (v?: string) => (v ?? '').trim();

export const ENV = {
  NODE_ENV: toStr(process.env.NODE_ENV),                                      // 'development' | 'production' | 'test'
  ENABLE_OVERRIDE: toBool(process.env.NEXT_PUBLIC_ENABLE_LOCALE_GEO_OVERRIDE),// true kalau mau pakai ?hl=&geo=&currency= (dev/preview)
  DEV_SECRET: toStr(process.env.DEV_OVERRIDE_SECRET),                         // token rahasia override dev/preview
  DEFAULT_LOCALE: (toStr(process.env.NEXT_PUBLIC_DEFAULT_LOCALE) || 'en').toLowerCase(), // fallback 'en'
} as const;

// (opsional) helper boolean
export const IS_PROD = ENV.NODE_ENV === 'production';
