'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Book, api } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EditBookModal } from '@/components/EditBookModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Library, Edit3, Trash2, PlusCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function MyBooksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | My Books';
    if (!authLoading && !user) {
      router.push('/login?from=/my-books');
    }
  }, [user, authLoading, router]);

  const fetchMyBooks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getBooks({ userEmail: user.email });
      if (res.success && res.data) {
        setMyBooks(res.data);
      } else {
        setMyBooks([]);
      }
    } catch (err: any) {
      toast.error('Failed to load your contributed books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBooks();
    }
  }, [user]);

  const handleBookUpdated = (updated: Book) => {
    setMyBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    try {
      setIsDeleting(true);
      const res = await api.deleteBook(deletingBook._id);
      if (res.success) {
        toast.success(`"${deletingBook.title}" removed successfully!`);
        setMyBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
        setDeletingBook(null);
      } else {
        toast.error(res.message || 'Failed to delete book.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting book.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#f0eae3] dark:border-stone-800">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
            My Books
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
            Manage the titles you have added to BookNook
          </p>
        </div>

        <Link
          href="/add-book"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#c8a88e] hover:bg-[#b89375] text-white font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading your shelf..." />
        </div>
      ) : myBooks.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 space-y-3">
          <Library className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">No books added yet</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            You haven't contributed any books to the library yet.
          </p>
          <Link
            href="/add-book"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#c8a88e] text-white font-bold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Book
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0eae3] dark:border-stone-800 bg-[#fbf9f6] dark:bg-stone-800/40 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Book Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Copies</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eae3] dark:divide-stone-800 text-sm">
                {myBooks.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-10 h-14 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <Link
                            href={`/books/${b._id}`}
                            className="font-bold text-stone-900 dark:text-stone-100 hover:text-[#b87d5b] line-clamp-1"
                          >
                            {b.title}
                          </Link>
                          <p className="text-xs text-stone-400">{b.author}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5ede6] text-[#8c6246]">
                        {b.category}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 font-bold text-stone-800 dark:text-stone-200 text-xs">
                      {b.totalCopies} copies
                    </td>

                    <td className="px-6 py-3.5 text-xs text-stone-400">
                      {new Date(b.createdAt || Date.now()).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/books/${b._id}`}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingBook(b)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-[#b87d5b] hover:bg-[#f5ede6]"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingBook(b)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          isOpen={!!editingBook}
          onClose={() => setEditingBook(null)}
          onUpdated={handleBookUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingBook && (
        <ConfirmModal
          isOpen={!!deletingBook}
          title="Delete Book from Library"
          message={`Are you sure you want to delete "${deletingBook.title}"?`}
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
          cancelLabel="Cancel"
          isDestructive={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBook(null)}
        />
      )}
    </div>
  );
}
