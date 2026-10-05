/**
 * @file Input.tsx
 * @description Form input, select, and textarea fields with eco-luxury styling and error states.
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', id, ...props }) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-timber-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-timber-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white border text-sm text-slate-earth rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
            icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 py-2.5 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-sand-border focus:border-vana-600 focus:ring-vana-100'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const textareaId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-timber-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={3}
        className={`w-full bg-white border text-sm text-slate-earth rounded-lg p-3.5 transition-colors duration-150 focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-sand-border focus:border-vana-600 focus:ring-vana-100'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
