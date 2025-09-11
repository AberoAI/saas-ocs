// apps/frontend/lib/market.ts
export type Market = 'TR' | 'US';

// IP country -> market (sesuaikan kalau perlu)
export function mapCountryToMarket(country?: string): Market {
  return country?.toUpperCase() === 'TR' ? 'TR' : 'US';
}

export const MARKET_COOKIE = 'MARKET';

// (Opsional) Jika nanti butuh pricing table & formatter:
export const PRICING_TABLE = {
  basic: { US: 19,  TR: 499  },
  pro:   { US: 49,  TR: 1299 },
  ent:   { US: 199, TR: 4999 }
} as const;

export function formatPrice(amount: number, market: Market): string {
  const opt: Intl.NumberFormatOptions =
    market === 'TR'
      ? { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }
      : { style: 'currency', currency: 'USD', maximumFractionDigits: 2 };

  const localeForNumber = market === 'TR' ? 'tr-TR' : 'en-US';
  return new Intl.NumberFormat(localeForNumber, opt).format(amount);
}
