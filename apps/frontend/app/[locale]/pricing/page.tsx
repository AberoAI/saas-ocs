// apps/frontend/app/[locale]/pricing/page.tsx
import {cookies} from 'next/headers';
import PricingClient from '../../../components/PricingClient';
import {MARKET_COOKIE, type Market} from '../../../lib/market';

// Penting: pastikan halaman ini selalu dinamis (menghormati cookie MARKET)
export const dynamic = 'force-dynamic';

type Params = { params: { locale: string } };

export default async function PricingPage({ params: { locale } }: Params) {
  // Next 15: cookies() → Promise<ReadonlyRequestCookies>
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get(MARKET_COOKIE)?.value;

  // Validasi cookie: hanya terima 'TR' atau 'US'
  const fromCookie = cookieVal === 'TR' || cookieVal === 'US' ? (cookieVal as Market) : undefined;

  // Default market mengikuti locale route: /tr/* => TR, selain itu => US
  const defaultMarket: Market = locale?.toLowerCase() === 'tr' ? 'TR' : 'US';

  const market: Market = fromCookie ?? defaultMarket;

  return <PricingClient market={market} />;
}
