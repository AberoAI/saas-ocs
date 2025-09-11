// apps/frontend/app/api/diag/route.ts
import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';
import {MARKET_COOKIE} from '../../../lib/market';

export const dynamic = 'force-dynamic';

// ✅ mapping eksplisit ke file JSON (hindari masalah context)
const MESSAGE_PROBES = {
  en: () => import('../../../messages/en.json'),
  tr: () => import('../../../messages/tr.json')
} as const;

export async function GET() {
  const c = await cookies();
  const market = c.get(MARKET_COOKIE)?.value || null;
  const nextLocale = c.get('NEXT_LOCALE')?.value || null;

  let hasEn = false, hasTr = false, err: unknown = null;
  try { await MESSAGE_PROBES.en(); hasEn = true; } catch (e) { err = e; }
  try { await MESSAGE_PROBES.tr(); hasTr = true; } catch (e) { err = err ?? e; }

  return NextResponse.json({
    ok: true,
    cookies: { MARKET: market, NEXT_LOCALE: nextLocale },
    messagesFound: { en: hasEn, tr: hasTr },
    note: 'If any is false, cek path: apps/frontend/messages/*.json (dan rebuild).',
    errorSample: err ? String((err as any)?.message ?? err) : null
  });
}
