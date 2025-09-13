// apps/frontend/lib/market.ts
import type { Currency } from './currency.server';

export type Market = 'TR' | 'US';

// IP country -> market (sesuaikan kalau perlu)
export function mapCountryToMarket(country?: string): Market {
  const c = (country || '').toUpperCase();
  return c === 'TR' ? 'TR' : 'US';
}

export const MARKET_COOKIE = 'MARKET' as const;

// (Opsional) Jika nanti butuh pricing table & formatter:
export const PRICING_TABLE = {
  basic: { US: 19,  TR: 499  },
  pro:   { US: 49,  TR: 1299 },
  ent:   { US: 199, TR: 4999 }
} as const;

/**
 * Format harga sesuai market & currency
 */
export function formatPrice(amount: number, market: Market, currency: Currency): string {
  const opt: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'TRY' ? 0 : 2,
  };

  const localeForNumber = market === 'TR' ? 'tr-TR' : 'en-US';
  return new Intl.NumberFormat(localeForNumber, opt).format(amount);
}
