/**
 * @file Button.tsx
 * @description Atomic, accessible button component with eco-luxury theme variants.
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const VARIANTS = {
  primary: 'bg-vana-600 hover:bg-vana-700 text-white shadow-md hover:shadow-lg focus:ring-vana-500',
  secondary: 'bg-timber-700 hover:bg-timber-800 text-sand-50 shadow-sm focus:ring-timber-600',
  outline: 'border border-vana-600 text-vana-700 hover:bg-vana-50 focus:ring-vana-500',
  gold: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md focus:ring-amber-500',
  ghost: 'text-vana-800 hover:bg-vana-100/50 focus:ring-vana-400',
  white: 'bg-white hover:bg-sand-50 text-vana-900 shadow-md focus:ring-vana-300',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm font-semibold rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-base font-semibold rounded-xl gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
