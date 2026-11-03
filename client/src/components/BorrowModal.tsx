'use client';

import React, { useState } from 'react';
import { X, Calendar, BookOpen, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Book, api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface BorrowModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (remainingCopies: number) => void;
}

export function BorrowModal({ book, isOpen, onClose, onSuccess }: BorrowModalProps) {
  const { user } = useAuth();
  // Default return date is 14 days from today
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState<string>(defaultDueDate);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to borrow a book.');
      return;
    }

    if (!returnDate) {
      toast.error('Please select a valid return date.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.borrowBook({
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        returnDate,
        userEmail: user.email,
        userName: user.name,
      });

      if (res.success) {
        toast.success(res.message || `Successfully borrowed "${book.title}"!`);
        onSuccess(res.remainingCopies !== undefined ? res.remainingCopies : book.totalCopies - 1);
        onClose();
      } else {
        toast.error(res.message || 'Failed to borrow book.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred while borrowing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg glass-card rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 shadow-2xl p-7 sm:p-9 space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Borrow Book</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Confirm your library reservation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Book Summary */}
        <div className="flex gap-4 p-4 rounded-2xl glass-panel border border-slate-200/60 dark:border-white/5">
          <img
            src={book.image}
            alt={book.title}
            className="w-16 h-22 object-cover rounded-xl shadow-md"
          />
          <div className="flex flex-col justify-center space-y-1">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {book.category}
            </span>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
              {book.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">By {book.author}</p>
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              {book.totalCopies} {book.totalCopies === 1 ? 'copy' : 'copies'} remaining
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Name (Read-Only) */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              User Name (Read-Only)
            </label>
            <input
              type="text"
              readOnly
              value={user?.name || ''}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-100/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-bold cursor-not-allowed"
            />
          </div>

          {/* User Email (Read-Only) */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              User Email (Read-Only)
            </label>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-100/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-bold cursor-not-allowed"
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Return Due Date</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Standard: 14 Days</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-2xl glass-panel hover:bg-slate-100 dark:hover:bg-white/10 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {submitting ? 'Confirming Reservation...' : 'Confirm Borrow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
