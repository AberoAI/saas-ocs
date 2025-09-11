'use client';
import {usePathname} from 'next/navigation';
import Link from 'next/link';

export default function LocaleSwitcher({current}:{current:'en'|'tr'}) {
  const pathname = usePathname();
  const other = current === 'en' ? 'tr' : 'en';
  // Ganti prefix /en/... ↔ /tr/...
  const nextPath = pathname.replace(/^\/(en|tr)/, `/${other}`);

  return (
    <Link href={nextPath} className="text-sm underline underline-offset-4">
      {other.toUpperCase()}
    </Link>
  );
}
