'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BorrowModal } from '@/components/BorrowModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft, BookmarkCheck, AlertCircle, Share2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const id = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState<boolean>(false);

  // Private Route check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?from=/books/${id}`);
    }
  }, [user, authLoading, id, router]);

  useEffect(() => {
    if (!id) return;

    async function loadBook() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getBookById(id);
        if (res.success && res.data) {
          setBook(res.data);
          document.title = `BookNook | ${res.data.title}`;
        } else {
          setError('Book could not be found.');
        }
      } catch (err: any) {
        console.error('Error loading book:', err);
        setError(err.message || 'Error fetching book details.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadBook();
    }
  }, [id, user]);

  const handleBorrowClick = () => {
    if (!user) {
      router.push(`/login?from=/books/${id}`);
      return;
    }
    if ((book?.totalCopies || 0) <= 0) {
      toast.error('This book is currently out of stock (Not Available).');
      return;
    }
    setIsBorrowModalOpen(true);
  };

  const handleBorrowSuccess = (remainingCopies: number) => {
    if (book) {
      setBook({ ...book, totalCopies: remainingCopies });
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (authLoading || (loading && !error)) {
    return (
      <div className="py-24">
        <LoadingSpinner size="md" text="Loading book details..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Book Unavailable</h2>
        <p className="text-xs text-stone-400 max-w-md">{error || 'This book could not be found in our database.'}</p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8a88e] text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>
      </div>
    );
  }

  const isAvailable = (book.totalCopies || 0) > 0;

  return (
    <div className="space-y-8 pb-14">
      {/* Back button */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cover Column */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-stone-900/5 bg-stone-100 dark:bg-stone-800">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Availability Pill */}
            <div className="absolute top-3.5 right-3.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                  isAvailable
                    ? 'bg-white/90 text-stone-800 dark:bg-stone-900/90 dark:text-stone-200'
                    : 'bg-rose-500/90 text-white'
                }`}
              >
                {isAvailable ? `${book.totalCopies} Available` : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="md:col-span-7 flex flex-col space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b87d5b] dark:text-[#d49977]">
              {book.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
              {book.title}
            </h1>

            <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
              By <strong className="text-stone-800 dark:text-stone-200">{book.author}</strong>
            </p>

            {/* Synopsis */}
            <div className="pt-3 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Synopsis
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line font-normal">
                {book.description}
              </p>
            </div>

            {/* Contributor Card */}
            <div className="pt-4 border-t border-[#f0eae3] dark:border-stone-800 text-xs text-stone-400 space-y-0.5">
              <p>
                Added to library by <strong className="text-stone-700 dark:text-stone-300">{book.userName}</strong> ({book.userEmail})
              </p>
              <p>Catalogued on {new Date(book.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleBorrowClick}
              disabled={!isAvailable}
              className={`px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${
                isAvailable
                  ? 'bg-[#c8a88e] hover:bg-[#b89375] text-white hover:scale-102 active:scale-98'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{isAvailable ? 'Borrow This Book' : 'Not Available'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-400" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {book && (
        <BorrowModal
          book={book}
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
          onSuccess={handleBorrowSuccess}
        />
      )}
    </div>
  );
}
