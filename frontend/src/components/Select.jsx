import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  options = [],
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-purple-400">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded border bg-white ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/25'
          } px-4 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-slate-900 text-slate-100">
                {text}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
