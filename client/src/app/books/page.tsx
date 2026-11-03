'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookCard } from '@/components/BookCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Book, api } from '@/lib/api';
import { Search, BookOpen, X } from 'lucide-react';

const CATEGORIES = ['All', 'Fiction', 'Science', 'History', 'Kids', 'Others'];

export default function AllBooksPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'BookNook | All Books';
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getBooks({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchTerm ? searchTerm : undefined,
        });

        if (res.success && res.data) {
          setBooks(res.data);
        } else {
          setBooks([]);
        }
      } catch (err: any) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please ensure backend server is running.');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 sm:space-y-10 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          All Books
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
          Browse our complete library collection across all categories
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-[#f0eae3] dark:border-stone-800">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#c8a88e] text-white shadow-sm'
                    : 'bg-[#f5ede6] dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-[#ede2d7]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c8a88e]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Books Grid: 3 cards per row on desktop (as required by PDF) */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading catalogue..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">No books found</h3>
          <p className="text-xs text-stone-400">
            Try adjusting your search query or switching categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#b87d5b] bg-[#f5ede6] hover:bg-[#ede2d7]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
