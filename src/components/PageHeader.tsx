import type { ReactNode } from 'react';
import Bloom from './Bloom';

/** Editorial page header: gold-rule eyebrow, Fraunces title, ambient bloom.
    `children` slots in below for search bars, filters, etc. */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
      <Bloom className="pointer-events-none absolute -right-14 -top-24 w-[300px] opacity-[0.07] hidden md:block" />
      <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-10">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="h-px w-7 bg-accent-gold" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-green">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-display font-normal text-[2.4rem] md:text-[3.25rem] leading-[1.05] tracking-tight text-forest-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 text-lg mt-4 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
