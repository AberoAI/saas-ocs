'use client';
import {useTranslations} from 'next-intl';
import {PRICING_TABLE, formatPrice, type Market} from '../lib/market';

export default function PricingClient({market}:{market: Market}) {
  const t = useTranslations('pricing');

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-semibold">{t('title')}</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-prose">
        {t('subtitle')}
      </p>

      {/* Badge market (opsional, biar user paham currency) */}
      <div className="mt-2 text-sm text-muted-foreground">
        {market === 'TR' ? 'Currency: TRY' : 'Currency: USD'}
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <PlanCard
          name={t('plans.basic.name')}
          desc={t('plans.basic.desc')}
          price={formatPrice(PRICING_TABLE.basic[market], market)}
        />
        <PlanCard
          name={t('plans.pro.name')}
          desc={t('plans.pro.desc')}
          price={formatPrice(PRICING_TABLE.pro[market], market)}
          highlighted
        />
        <PlanCard
          name={t('plans.enterprise.name')}
          desc={t('plans.enterprise.desc')}
          price={formatPrice(PRICING_TABLE.ent[market], market)}
        />
      </div>
    </main>
  );
}

function PlanCard(
  {name, desc, price, highlighted}:
  {name:string; desc:string; price:string; highlighted?:boolean}
) {
  return (
    <div className={`border rounded-2xl p-6 ${highlighted ? 'ring-1 ring-black/10 shadow-sm' : ''}`}>
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6 text-3xl font-semibold">{price}</div>
    </div>
  );
}
