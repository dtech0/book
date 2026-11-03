'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Borrow, api } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ConfirmModal } from '@/components/ConfirmModal';
import { formatDate } from '@/lib/utils';
import { BookmarkCheck, RotateCcw, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function MyBorrowsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningBorrow, setReturningBorrow] = useState<Borrow | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | My Borrows';
    if (!authLoading && !user) {
      router.push('/login?from=/my-borrows');
    }
  }, [user, authLoading, router]);

  const fetchBorrows = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getUserBorrows(user.email);
      if (res.success && res.data) {
        setBorrows(res.data);
      } else {
        setBorrows([]);
      }
    } catch (err: any) {
      toast.error('Failed to load your borrowed books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBorrows();
    }
  }, [user]);

  const handleConfirmReturn = async () => {
    if (!returningBorrow) return;

    try {
      setIsReturning(true);
      const res = await api.returnBook(returningBorrow._id);
      if (res.success) {
        toast.success(res.message || `"${returningBorrow.bookTitle}" returned successfully! Thank you.`);
        setBorrows((prev) => prev.filter((b) => b._id !== returningBorrow._id));
        setReturningBorrow(null);
      } else {
        toast.error(res.message || 'Failed to return book.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error returning book.');
    } finally {
      setIsReturning(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#f0eae3] dark:border-stone-800">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
            My Library / Borrows
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
            Review books you have checked out and manage your returns
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#c8a88e] hover:bg-[#b89375] text-white font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse More Books</span>
        </Link>
      </div>

      {/* Borrows Table */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading your borrowed books..." />
        </div>
      ) : borrows.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 space-y-3">
          <BookmarkCheck className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">No active borrows</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Explore the catalog to borrow textbooks, bestsellers, and academic resources.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#c8a88e] text-white font-bold text-xs"
          >
            <BookOpen className="w-4 h-4" />
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0eae3] dark:border-stone-800 bg-[#fbf9f6] dark:bg-stone-800/40 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Book Cover</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Borrow Date</th>
                  <th className="px-6 py-4">Return Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eae3] dark:divide-stone-800 text-sm">
                {borrows.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <img
                        src={item.bookImage}
                        alt={item.bookTitle}
                        className="w-10 h-14 object-cover rounded-lg shadow-sm"
                      />
                    </td>

                    <td className="px-6 py-3.5 font-bold text-stone-900 dark:text-stone-100">
                      <Link href={`/books/${item.bookId}`} className="hover:text-[#b87d5b]">
                        {item.bookTitle}
                      </Link>
                    </td>

                    <td className="px-6 py-3.5 text-xs text-stone-500">
                      {formatDate(item.borrowDate)}
                    </td>

                    <td className="px-6 py-3.5 text-xs font-semibold text-[#b87d5b]">
                      {formatDate(item.returnDate)}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setReturningBorrow(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#f5ede6] text-[#8c6246] hover:bg-[#c8a88e] hover:text-white transition-all shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return Book</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {returningBorrow && (
        <ConfirmModal
          isOpen={!!returningBorrow}
          title="Return Borrowed Book"
          message={`Are you ready to return "${returningBorrow.bookTitle}"?`}
          confirmLabel={isReturning ? 'Returning...' : 'Return'}
          cancelLabel="Cancel"
          isDestructive={false}
          onConfirm={handleConfirmReturn}
          onCancel={() => setReturningBorrow(null)}
        />
      )}
    </div>
  );
}
