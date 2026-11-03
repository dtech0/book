import React from 'react';

export function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3" role="status">
      <div
        className={`${sizeClasses} border-slate-200 dark:border-slate-800 border-t-emerald-500 dark:border-t-emerald-400 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
