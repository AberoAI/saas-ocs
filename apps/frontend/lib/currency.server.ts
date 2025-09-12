// apps/frontend/lib/currency.server.ts
'use server';

import { cookies } from 'next/headers';
import type { Market } from './market';

export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

export async function resolveCurrency(market: Market): Promise<Currency> {
  const c = await cookies();
  const cur = c.get('CURRENCY_OVERRIDE')?.value as Currency | undefined;
  if (cur && ['TRY','USD','EUR','GBP'].includes(cur)) return cur;
  return market === 'TR' ? 'TRY' : 'USD';
}
