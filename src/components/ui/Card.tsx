/**
 * @file Card.tsx
 * @description Surface container component with subtle borders, warm sand tints, and soft shadows.
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  elevation?: 'flat' | 'card' | 'elevated';
}

const SHADOW_MAP = {
  flat: 'border border-sand-border bg-white',
  card: 'border border-sand-border bg-white shadow-card hover:shadow-elevated transition-shadow duration-300',
  elevated: 'border border-sand-border bg-sand-surface shadow-elevated',
};

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  elevation = 'card',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${SHADOW_MAP[elevation]} ${
        interactive ? 'cursor-pointer transform hover:-translate-y-1 transition-transform duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
