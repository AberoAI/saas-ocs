// apps/frontend/components/footer/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

type Lc = "en" | "tr";
type FooterVariant = "onDark" | "onLight";

type FooterProps = {
  variant?: FooterVariant;
};

export default function Footer({ variant = "onDark" }: FooterProps) {
  const locale = useLocale() as Lc;
  const isTr = locale === "tr";

  const titleCompany = isTr ? "Şirket" : "Company";
  const titleProduct = isTr ? "Ürün" : "Product";
  const titleService = isTr ? "Hizmet" : "Service";
  const titleContact = isTr ? "İletişim" : "Contact";

  const about = isTr ? "Hakkında" : "About us";
  const features = isTr ? "Özellikler" : "Features";
  const solutions = isTr ? "Çözümler" : "Solutions";
  const pricing = isTr ? "Fiyatlar" : "Pricing";
  const faq = isTr ? "SSS" : "FAQ";

  const privacy = isTr ? "Gizlilik" : "Privacy";
  const legalSecurity = isTr ? "Yasal & güvenlik" : "Legal & Security";

  const isDark = variant === "onDark";

  // Footer no longer sets background. Wrapper/page controls background.
  const rootText = isDark ? "text-white" : "text-slate-900";
  const taglineText = isDark ? "text-white/70" : "text-slate-600";
  const socialBorder = isDark
    ? "border-white/10 hover:border-white/25"
    : "border-slate-900/10 hover:border-slate-900/20";
  const divider = isDark ? "bg-white/10" : "bg-slate-900/10";
  const copyrightText = isDark ? "text-white/55" : "text-slate-500";
  const legalWrapText = isDark ? "text-white/70" : "text-slate-600";

  // Use the new logo location you provided (white mark)
  const brandMark = isDark
    ? "/brands/aberoai-mark-white.svg"
    : "/brand/aberoai-mark.svg";

  const tagline = isTr
    ? "Konuşmalar, yönetilir.\nİlişkiler, korunur."
    : "Conversations, governed.\nRelationships, preserved.";

  return (
    <footer className={rootText}>
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Reduced bottom padding to avoid excess space after legal bar */}
        <div className="pt-14 pb-10 md:pt-16 md:pb-10">
          {/* Top grid */}
          <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
            {/* Brand */}
            <div>
              <div className="flex items-start gap-4">
                <Image
                  src={brandMark}
                  alt="AberoAI"
                  width={36}
                  height={36}
                  className="h-9 w-9 translate-y-[5px]"
                />
                <p
                  className={`max-w-sm text-sm leading-relaxed whitespace-pre-line ${taglineText}`}
                >
                  {tagline}
                </p>
              </div>
            </div>

            {/* Right area: columns (top) + social (bottom-right) */}
            <div className="flex flex-col gap-10 md:gap-0 md:justify-between md:min-h-[140px]">
              {/* Columns */}
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                <FooterCol title={titleCompany} variant={variant}>
                  <FooterLink href={`/${locale}#about`} variant={variant}>
                    {about}
                  </FooterLink>
                </FooterCol>

                <FooterCol title={titleProduct} variant={variant}>
                  <FooterLink href={`/${locale}#page-3`} variant={variant}>
                    {features}
                  </FooterLink>
                  <FooterLink href={`/${locale}#page-4`} variant={variant}>
                    {solutions}
                  </FooterLink>
                </FooterCol>

                <FooterCol title={titleService} variant={variant}>
                  <FooterLink href={`/${locale}#pricing`} variant={variant}>
                    {pricing}
                  </FooterLink>
                  <FooterLink href={`/${locale}#page-8`} variant={variant}>
                    {faq}
                  </FooterLink>
                </FooterCol>

                <FooterCol title={titleContact} variant={variant}>
                  <FooterLink href={`/${locale}#contact`} variant={variant}>
                    {isTr ? "İletişime geç" : "Contact us"}
                  </FooterLink>
                </FooterCol>
              </div>

              {/* Social (right-bottom, above divider) */}
              {/* NOTE: translate-y moves visually without changing layout flow,
                  so divider position stays exactly the same. */}
              <div className="flex items-center gap-3 md:justify-end md:translate-y-6">
                <Link
                  href="#"
                  aria-label="X"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${socialBorder}`}
                >
                  <Image
                    src="/icons/x_white.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Link>

                <Link
                  href="#"
                  aria-label="YouTube"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${socialBorder}`}
                >
                  <Image
                    src="/icons/youtube_white.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Link>

                <Link
                  href="#"
                  aria-label="LinkedIn"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${socialBorder}`}
                >
                  <Image
                    src="/icons/linkedin_white.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Link>

                <Link
                  href="#"
                  aria-label="Facebook"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${socialBorder}`}
                >
                  <Image
                    src="/icons/facebook_white.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Link>

                <Link
                  href="#"
                  aria-label="Instagram"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${socialBorder}`}
                >
                  <Image
                    src="/icons/instagram_white.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={`mt-12 h-px w-full ${divider}`} />

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className={`text-xs ${copyrightText}`}>
              {isTr
                ? "© 2025 AberoAI. Tüm hakları saklıdır."
                : "© 2025 AberoAI. All rights reserved."}
            </div>

            <div
              className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs ${legalWrapText}`}
            >
              <FooterLink href={`/${locale}/privacy`} variant={variant}>
                {privacy}
              </FooterLink>
              <FooterLink href={`/${locale}/legal`} variant={variant}>
                {legalSecurity}
              </FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  variant,
}: {
  title: string;
  children: React.ReactNode;
  variant: FooterVariant;
}) {
  const titleClass =
    variant === "onDark" ? "text-white/90" : "text-slate-900/90";

  return (
    <div>
      <div className={`text-sm font-semibold ${titleClass}`}>{title}</div>
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant: FooterVariant;
}) {
  const linkClass =
    variant === "onDark"
      ? "text-sm text-white/70 hover:text-white"
      : "text-sm text-slate-600 hover:text-slate-900";

  return (
    <Link href={href} className={`${linkClass} transition-colors`}>
      {children}
    </Link>
  );
}
