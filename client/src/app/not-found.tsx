import React from 'react';
import Link from 'next/link';
import { Home, Compass, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-12 h-12 animate-pulse" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white shadow-md">
          404
        </span>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif-title">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          The page or volume you are looking for has been moved, uncatalogued, or does not exist on our shelves.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
        >
          <BookOpen className="w-4 h-4 text-emerald-500" />
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}
