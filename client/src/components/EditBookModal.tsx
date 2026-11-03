'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import { Book, api } from '@/lib/api';
import { toast } from 'sonner';

interface EditBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedBook: Book) => void;
}

export function EditBookModal({ book, isOpen, onClose, onUpdated }: EditBookModalProps) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category);
  const [image, setImage] = useState(book.image);
  const [description, setDescription] = useState(book.description);
  const [totalCopies, setTotalCopies] = useState(book.totalCopies || 1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setImage(book.image);
    setDescription(book.description);
    setTotalCopies(book.totalCopies || 1);
  }, [book]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !category || !image || !description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.updateBook(book._id, {
        title,
        author,
        category,
        image,
        description,
        totalCopies: Number(totalCopies),
      });

      if (res.success && res.data) {
        toast.success('Book updated successfully!');
        onUpdated(res.data);
        onClose();
      } else {
        toast.error(res.message || 'Failed to update book.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating book.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-xl glass-card rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 shadow-2xl p-7 sm:p-9 space-y-6 my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Book Metadata</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update catalog listing attributes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Book Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Author Name *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          {/* Category & Total Copies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              >
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Total Copies *
              </label>
              <input
                type="number"
                min="0"
                required
                value={totalCopies}
                onChange={(e) => setTotalCopies(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Book Image URL *
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Short Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Actions */}
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
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
