// apps/frontend/lib/market.server.ts
'use server';

import { cookies, headers } from 'next/headers';
import {
  MARKET_COOKIE,
  CURRENCY_OVERRIDE,
  GEO_OVERRIDE,
  type Market,
  type Currency,
} from './market/shared';

/** Urutan: cookie → geo-IP → default('TR') */
export async function resolveMarket(): Promise<Market> {
  const c = await cookies();
  const h = await headers();

  const cookieVal = c.get(MARKET_COOKIE)?.value;
  if (cookieVal === 'TR' || cookieVal === 'US') return cookieVal as Market;

  const geo =
    c.get(GEO_OVERRIDE)?.value ??
    h.get('x-vercel-ip-country') ??
    'TR';

  return geo.toUpperCase() === 'TR' ? 'TR' : 'US';
}

/** Currency: cookie override → by market ('TR'→TRY, selain itu → USD) */
export async function resolveCurrency(): Promise<Currency> {
  const c = await cookies();
  const cur = c.get(CURRENCY_OVERRIDE)?.value as Currency | undefined;
  if (cur && ['TRY', 'USD', 'EUR', 'GBP'].includes(cur)) return cur;
  const market = await resolveMarket();
  return market === 'TR' ? 'TRY' : 'USD';
}
