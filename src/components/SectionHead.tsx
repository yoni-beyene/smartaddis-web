import type { ReactNode } from 'react';

/** Shared editorial section heading: gold rule + eyebrow, Fraunces title. */
export default function SectionHead({
  eyebrow,
  title,
  subtitle,
  action,
  center = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? 'mb-14 text-center' : 'mb-10 flex items-end justify-between gap-4 flex-wrap'}>
      <div className={center ? 'mx-auto max-w-xl' : ''}>
        <div className={`flex items-center gap-2.5 mb-3 ${center ? 'justify-center' : ''}`}>
          <span className="h-px w-7 bg-accent-gold" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-green">
            {eyebrow}
          </span>
        </div>
        <h2 className="font-display font-normal text-[2rem] md:text-[2.6rem] leading-[1.1] tracking-tight text-forest-ink">
          {title}
        </h2>
        {subtitle && <p className="text-gray-500 text-base leading-relaxed mt-4">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
