'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Google G logo SVG
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const { login, loginWithGoogle, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | Log In';
    if (user) {
      router.push(from);
    }
  }, [user, from, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success('Welcome back to BookNook!');
      router.push(from);
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      router.push(from);
    } catch (err: any) {
      const msg = err.message || 'Google sign-in failed.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 shadow-sm p-7 sm:p-9 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex items-center gap-1 text-2xl font-extrabold text-[#b87d5b] lowercase">
            b<BookOpen className="w-4 h-4 stroke-[2.5]" />knook
          </Link>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Log in to your account
          </h1>
          <p className="text-xs text-stone-400">
            Access your borrowed books and explore thousands of titles.
          </p>
        </div>

        {/* Inline Error Message */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Google Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#f0eae3] dark:border-stone-800 w-full" />
          <span className="bg-[#fdfbf9] dark:bg-[#201c19] px-3 text-[11px] text-stone-400 uppercase font-semibold">
            Or with email
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="reader@booknook.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.info('Password reset is disabled for evaluation per instructions.')}
                className="text-xs text-[#b87d5b] hover:underline"
              >
                Forget Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-[#c8a88e] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#c8a88e] hover:bg-[#b89375] text-white font-bold text-sm shadow-sm transition-all"
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-[#b87d5b] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
