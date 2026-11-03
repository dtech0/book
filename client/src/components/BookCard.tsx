'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '@/lib/api';
import { ArrowUpRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const isAvailable = (book.totalCopies || 0) > 0;

  return (
    <div className="group flex flex-col h-full space-y-3 transition-transform duration-300 hover:-translate-y-1">
      {/* Book Cover Image with Rounded Corners (Matching reference) */}
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-sm group-hover:shadow-md transition-shadow">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
          loading="lazy"
        />

        {/* Stock status indicator pill */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md ${
              isAvailable
                ? 'bg-white/90 text-stone-800 dark:bg-stone-900/90 dark:text-stone-200'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {isAvailable ? `${book.totalCopies} left` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Book Metadata below the image (Matching reference structure) */}
      <div className="space-y-1 px-0.5">
        <p className="text-[11px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
          {book.category}
        </p>

        <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-[#b87d5b] transition-colors">
          {book.title}
        </h3>

        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
          {book.author}
        </p>

        {/* Action Button: View Details */}
        <div className="pt-2">
          <Link
            href={`/books/${book._id}`}
            className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f5ede6] dark:bg-stone-800 text-[#8c6246] dark:text-[#e2bca2] hover:bg-[#c8a88e] hover:text-white dark:hover:bg-[#b88667] dark:hover:text-white transition-all duration-200"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
