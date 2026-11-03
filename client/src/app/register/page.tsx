'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, User, Mail, Image as ImageIcon, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Google G logo
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | Sign Up';
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Live password validation check per PDF
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password) {
      setFormError('Please fill in all required fields.');
      toast.error('Please fill in all required fields.');
      return;
    }

    // Password validation rules per PDF
    if (!hasUppercase) {
      const err = 'Password must contain at least one uppercase letter.';
      setFormError(err);
      toast.error(err);
      return;
    }
    if (!hasLowercase) {
      const err = 'Password must contain at least one lowercase letter.';
      setFormError(err);
      toast.error(err);
      return;
    }
    if (!hasMinLength) {
      const err = 'Password length must be at least 6 characters.';
      setFormError(err);
      toast.error(err);
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password, photoURL);
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setSubmitting(true);
      await loginWithGoogle();
      toast.success('Successfully authenticated with Google!');
      router.push('/');
    } catch (err: any) {
      const msg = err.message || 'Google registration failed.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 shadow-sm p-7 sm:p-9 space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex items-center gap-1 text-2xl font-extrabold text-[#b87d5b] lowercase">
            b<BookOpen className="w-4 h-4 stroke-[2.5]" />knook
          </Link>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Create your account
          </h1>
          <p className="text-xs text-stone-400">
            Join BookNook to borrow and catalog books.
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm"
          >
            <GoogleIcon />
            <span>Sign up with Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#f0eae3] dark:border-stone-800 w-full" />
          <span className="bg-[#fdfbf9] dark:bg-[#201c19] px-3 text-[11px] text-stone-400 uppercase font-semibold">
            Or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="eleanor@booknook.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Photo URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Must include uppercase, lowercase, min 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
              />
            </div>

            {/* Validation checklist */}
            <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                {hasUppercase ? (
                  <CheckCircle className="w-3.5 h-3.5 text-[#b87d5b]" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span className={hasUppercase ? 'text-[#8c6246] font-bold' : 'text-stone-500'}>
                  Must have an Uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLowercase ? (
                  <CheckCircle className="w-3.5 h-3.5 text-[#b87d5b]" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span className={hasLowercase ? 'text-[#8c6246] font-bold' : 'text-stone-500'}>
                  Must have a Lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <CheckCircle className="w-3.5 h-3.5 text-[#b87d5b]" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span className={hasMinLength ? 'text-[#8c6246] font-bold' : 'text-stone-500'}>
                  Length must be at least 6 characters
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#c8a88e] hover:bg-[#b89375] text-white font-bold text-sm shadow-sm transition-all"
          >
            {submitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#b87d5b] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
