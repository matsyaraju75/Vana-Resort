/**
 * @file SectionTitle.tsx
 * @description Reusable section header component with tag badge, serif title, and centered/left alignment.
 */

import React from 'react';

interface SectionTitleProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  tag,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const subtitleAlignment = align === 'center' ? 'mx-auto' : '';

  return (
    <div className={`max-w-3xl mb-12 ${alignment} ${className}`}>
      {tag && (
        <span className="inline-block text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100/80 px-3.5 py-1 rounded-full border border-vana-200 mb-3">
          {tag}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl ${subtitleAlignment}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
