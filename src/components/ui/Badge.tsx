/**
 * @file Badge.tsx
 * @description Compact status/feature tag element for room specs, ratings, and eco badges.
 */

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'timber' | 'sand' | 'gold' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

const BADGE_VARIANTS = {
  forest: 'bg-vana-100 text-vana-800 border-vana-200',
  timber: 'bg-timber-100 text-timber-800 border-timber-200',
  sand: 'bg-sand-surface text-timber-700 border-sand-border',
  gold: 'bg-amber-100 text-amber-900 border-amber-200 font-semibold',
  outline: 'bg-transparent text-slate-700 border-slate-300',
};

const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'forest',
  size = 'md',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium uppercase tracking-wider ${BADGE_VARIANTS[variant]} ${BADGE_SIZES[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
