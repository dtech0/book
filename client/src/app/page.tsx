'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroSlider } from '@/components/HeroSlider';
import { BookCard } from '@/components/BookCard';
import { ExtraSections } from '@/components/ExtraSections';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Book, api } from '@/lib/api';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'BookNook | Home';

    async function loadNewArrivals() {
      try {
        setLoading(true);
        // MongoDB sort and limit latest 6 books
        const res = await api.getBooks({ limit: 6, sort: 'newest' });
        if (res.success && res.data) {
          setNewArrivals(res.data);
        } else {
          setNewArrivals([]);
        }
      } catch (err: any) {
        console.error('Failed to load new arrivals:', err);
        setError('Unable to load new arrivals right now. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  return (
    <div className="space-y-14 sm:space-y-18 pb-10">
      {/* 1. Hero Banner matching reference */}
      <section>
        <HeroSlider />
      </section>

      {/* 2. Trending Now / New Arrivals (Matching reference layout) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              Trending Now
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
              Top rental books this week
            </p>
          </div>

          {/* Navigation Arrows & Browse link (Matching reference right cluster) */}
          <div className="flex items-center gap-3">
            <Link
              href="/books"
              className="hidden sm:inline-block text-xs font-bold text-[#b87d5b] hover:underline mr-2"
            >
              See All Books
            </Link>
            <Link
              href="/books"
              className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/books"
              className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner size="md" text="Loading trending books..." />
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">No books found in catalog yet.</p>
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8a88e] text-white font-bold text-xs shadow-sm hover:bg-[#b89375]"
            >
              Add First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {/* Bottom CTA for Mobile */}
        <div className="text-center pt-4 sm:hidden">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[#c8a88e] text-white"
          >
            <span>See All Books</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. Extra Sections */}
      <ExtraSections />
    </div>
  );
}
