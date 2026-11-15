'use client';

import { RiStethoscopeLine } from 'react-icons/ri';

export function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: { w: 6, h: 6, text: 'text-xs', gap: 1.5 },
    md: { w: 8, h: 8, text: 'text-sm', gap: 2 },
    lg: { w: 10, h: 10, text: 'text-base', gap: 2.5 },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-${s.gap} ${className}`}>
      <div
        className={`w-${s.w} h-${s.h} rounded-[var(--radius-control)] bg-[var(--color-accent)]/10 flex items-center justify-center border border-[var(--color-accent)]/20 shrink-0`}
      >
        <RiStethoscopeLine className={`w-${s.w === 6 ? 3 : s.w === 8 ? 4 : 5} h-${s.w === 6 ? 3 : s.w === 8 ? 4 : 5} text-[var(--color-accent)]`} />
      </div>
      <span className={`font-bold tracking-tighter ${s.text} text-[var(--color-text)]`}>PromptBiotics</span>
    </div>
  );
}

export function LogoIcon({ size = 'md', className = '' }) {
  const sizes = { sm: 3, md: 4, lg: 5 };
  return (
    <div className={`rounded-[var(--radius-control)] bg-[var(--color-accent)]/10 flex items-center justify-center border border-[var(--color-accent)]/20 shrink-0 ${className}`}>
      <RiStethoscopeLine className={`w-${sizes[size]} h-${sizes[size]} text-[var(--color-accent)]`} />
    </div>
  );
}