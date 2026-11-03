'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { BookCard } from '@/components/BookCard';
import { PlusCircle, UploadCloud, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AddBookPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<'Fiction' | 'Science' | 'History' | 'Kids' | 'Others'>('Fiction');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | Add Book';
    if (!authLoading && !user) {
      router.push('/login?from=/add-book');
    }
  }, [user, authLoading, router]);

  // Handle direct file upload to ImgBB
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!imgbbKey) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
          toast.success('Local image preview loaded!');
        };
        reader.readAsDataURL(file);
        return;
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setImage(data.data.url);
        toast.success('Image uploaded to ImgBB successfully!');
      } else {
        toast.error('Failed to upload image to ImgBB. You can also paste an image URL directly.');
      }
    } catch (err: any) {
      toast.error('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to add a book.');
      return;
    }

    if (!title.trim() || !author.trim() || !category || !image.trim() || !description.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (totalCopies < 1) {
      toast.error('Total copies must be at least 1.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createBook({
        title: title.trim(),
        author: author.trim(),
        category,
        image: image.trim(),
        description: description.trim(),
        totalCopies: Number(totalCopies),
        userName: user.name,
        userEmail: user.email,
      });

      if (res.success) {
        toast.success('Book successfully added to the catalog!');
        router.push('/my-books');
      } else {
        toast.error(res.message || 'Failed to add book.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error creating book.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return null;
  }

  // Virtual preview book
  const previewBook = {
    _id: 'preview',
    title: title.trim() || 'Book Title Preview',
    author: author.trim() || 'Author Name',
    category,
    image:
      image.trim() ||
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    description:
      description.trim() ||
      'Your book synopsis will appear here just like on the library shelves.',
    totalCopies: Number(totalCopies) || 1,
    userName: user.name,
    userEmail: user.email,
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          Add a New Book
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
          Contribute a new volume to the library catalogue with real-time card preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Form Container */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Great Gatsby"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
                />
              </div>
            </div>

            {/* Category & Total Copies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Total Copies * (Challenge)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
                />
              </div>
            </div>

            {/* Book Image */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Book Image * (Upload file or paste URL)
              </label>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="url"
                  required
                  placeholder="https://... or click upload"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
                />

                <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#c8a88e] bg-[#f5ede6] hover:bg-[#ede2d7] text-[#8c6246] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0">
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Short Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Synopsis of the book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none resize-none"
              />
            </div>

            {/* Read-Only User info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#f0eae3] dark:border-stone-800 text-xs text-stone-400">
              <div>
                <p className="font-bold">User Name: <span className="font-medium text-stone-600 dark:text-stone-300">{user.name}</span></p>
              </div>
              <div>
                <p className="font-bold">User Email: <span className="font-medium text-stone-600 dark:text-stone-300">{user.email}</span></p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#c8a88e] hover:bg-[#b89375] text-white font-bold text-sm shadow-sm transition-all"
              >
                {submitting ? 'Adding Book...' : 'Add Book to Library'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-24">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#b87d5b]" />
            <span>Card Preview</span>
          </p>

          <div className="p-4 rounded-2xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800">
            <BookCard book={previewBook as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
