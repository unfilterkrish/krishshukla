import React from 'react';

const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="relative">
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-purple-500/20 border-t-purple-500 animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeClasses[size] || sizeClasses.md} rounded-full border-cyan-400/10 border-b-cyan-400 animate-spin [animation-duration:1.5s]`}
        />
      </div>
      {message && (
        <p className="text-xs font-medium text-slate-400 animate-pulse tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-5 w-24 bg-slate-800 rounded-full"></div>
      <div className="h-5 w-5 bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
    <div className="h-16 w-full bg-slate-800/60 rounded-xl"></div>
    <div className="flex gap-2">
      <div className="h-4 w-12 bg-slate-800 rounded-md"></div>
      <div className="h-4 w-16 bg-slate-800 rounded-md"></div>
    </div>
    <div className="pt-3 border-t border-slate-800/80 flex justify-between">
      <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
      <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
    </div>
  </div>
);

export default LoadingSpinner;
