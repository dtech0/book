'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin, Heart } from 'lucide-react';

// Rebranded X logo (matching latest Twitter rebranding per assignment requirement #9)
function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.37 9.74V9.93H5.09v8.57h2.74z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-[#f0eae3] dark:border-stone-800 px-6 sm:px-10 lg:px-14 py-10 mt-auto bg-white dark:bg-[#1a1715] transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-1 text-2xl font-extrabold text-[#b87d5b] lowercase">
            b<BookOpen className="w-4 h-4 stroke-[2.5]" />knook
          </Link>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
            BookNook is an online library where members can discover, borrow, and contribute books. Simple philosophy: Add a book, borrow a book, return a book.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 transition-colors"
              aria-label="X"
            >
              <XIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Explore
          </h4>
          <ul className="space-y-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <li>
              <Link href="/" className="hover:text-[#b87d5b]">Home</Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-[#b87d5b]">Browse Books</Link>
            </li>
            <li>
              <Link href="/books?category=Fiction" className="hover:text-[#b87d5b]">Fiction</Link>
            </li>
            <li>
              <Link href="/books?category=Science" className="hover:text-[#b87d5b]">Science</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Member Services */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Members
          </h4>
          <ul className="space-y-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <li>
              <Link href="/add-book" className="hover:text-[#b87d5b]">Add a Book</Link>
            </li>
            <li>
              <Link href="/my-books" className="hover:text-[#b87d5b]">My Books</Link>
            </li>
            <li>
              <Link href="/my-borrows" className="hover:text-[#b87d5b]">My Library</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#b87d5b]">Member Sign In</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Contact Info
          </h4>
          <div className="space-y-1.5 text-xs text-stone-500 font-medium">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#b87d5b]" />
              <span>42 Alexandria Avenue, Library Quarter</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#b87d5b]" />
              <span>support@booknook.dev</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#b87d5b]" />
              <span>+1 (800) 266-5665</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#f0eae3] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
        <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for book lovers
        </p>
      </div>
    </footer>
  );
}
