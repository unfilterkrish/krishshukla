import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  className = '',
  containerClassName = '',
  labelClassName = '',
  required = false,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-slate-700 mb-1.5 ${labelClassName}`}
        >
          {label} {required && <span className="text-purple-400">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded border bg-white ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/25'
          } px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none ${
            Icon ? 'pl-10' : ''
          } ${rightElement ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  rows = 4,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-purple-400">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full rounded bg-white border ${
          error
            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/25'
        } px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition-colors focus:outline-none resize-y ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
