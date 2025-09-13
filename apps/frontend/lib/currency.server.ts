// apps/frontend/lib/currency.server.ts
'use server';

import { cookies } from 'next/headers';
import type { Market } from './market';

export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

const ALLOWED: ReadonlyArray<Currency> = ['TRY', 'USD', 'EUR', 'GBP'] as const;

/**
 * Resolve currency sepenuhnya di server:
 * 1) Cookie override: CURRENCY_OVERRIDE (valid: TRY|USD|EUR|GBP)
 * 2) Fallback by market:
 *    - TR  -> TRY
 *    - selain TR (US/GLOBAL/dll) -> USD
 */
export async function resolveCurrency(market: Market): Promise<Currency> {
  const c = await cookies();

  // 1) Cookie override (distandarkan ke UPPERCASE + validasi whitelist)
  const raw = c.get('CURRENCY_OVERRIDE')?.value?.toUpperCase() as Currency | undefined;
  if (raw && ALLOWED.includes(raw)) {
    return raw;
  }

  // 2) Fallback by market
  return (market as any) === 'TR' ? 'TRY' : 'USD';
}
