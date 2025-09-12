// apps/frontend/app/[locale]/pricing/page.tsx
import { cookies, headers } from 'next/headers';
import PricingClient from '../../../components/PricingClient';
import { MARKET_COOKIE, type Market, mapCountryToMarket } from '../../../lib/market';
import { resolveCurrency } from '../../../lib/currency.server';

// Penting: pastikan halaman ini selalu dinamis (menghormati cookie MARKET)
export const dynamic = 'force-dynamic';

type Params = { params: { locale: string } };

export default async function PricingPage({ params: { locale } }: Params) {
  // Next 15: cookies()/headers() → Promise<...>
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 1) Cookie override (valid: 'TR' | 'US')
  const cookieRaw = cookieStore.get(MARKET_COOKIE)?.value?.trim();
  const fromCookie: Market | undefined =
    cookieRaw === 'TR' || cookieRaw === 'US' ? (cookieRaw as Market) : undefined;

  // 2) Geo-IP fallback (Vercel edge header) → map ke Market
  const ipCountryRaw = headerStore.get('x-vercel-ip-country') || undefined;
  const ipCountry = ipCountryRaw ? ipCountryRaw.toUpperCase() : undefined;
  const fromGeo: Market | undefined = ipCountry ? mapCountryToMarket(ipCountry) : undefined;

  // 3) Default terakhir mengikuti locale route: /tr/* => TR, selain itu => US
  const loc = (locale || '').toLowerCase();
  const defaultMarket: Market = loc === 'tr' ? 'TR' : 'US';

  const market: Market = fromCookie ?? fromGeo ?? defaultMarket;

  // 4) Currency resolver (server-side, pakai helper async)
  const currency = await resolveCurrency(market);

  return <PricingClient market={market} currency={currency} />;
}
