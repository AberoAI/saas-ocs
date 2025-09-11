// apps/frontend/app/[locale]/pricing/page.tsx
import {cookies} from 'next/headers';
import PricingClient from '../../../components/PricingClient';
import {MARKET_COOKIE, type Market} from '../../../lib/market';

// Penting: pastikan halaman ini selalu dinamis (menghormati cookie MARKET)
export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const cookieStore = await cookies(); // Next 15: Promise<ReadonlyRequestCookies>
  const marketCookie = cookieStore.get(MARKET_COOKIE)?.value as Market | undefined;
  const market: Market = marketCookie === 'TR' ? 'TR' : 'US'; // default US bila tak ada cookie

  return <PricingClient market={market} />;
}
