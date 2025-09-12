// apps/frontend/lib/market/shared.ts
export type Market = 'TR' | 'US';
export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

export const MARKET_COOKIE = 'MARKET';
export const CURRENCY_OVERRIDE = 'CURRENCY_OVERRIDE';
export const GEO_OVERRIDE = 'GEO_COUNTRY_OVERRIDE';

export const PRICING_TABLE = {
  basic: { US: 19,  TR: 499  },
  pro:   { US: 49,  TR: 1299 },
  ent:   { US: 199, TR: 4999 },
} as const;
