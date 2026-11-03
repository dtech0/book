'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PlusCircle,
  BookmarkCheck,
  Library,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/', isPrivate: false },
    { label: 'Browse', href: '/books', isPrivate: false },
    { label: 'Add Book', href: '/add-book', isPrivate: true },
    { label: 'My Books', href: '/my-books', isPrivate: true },
    { label: 'My Library', href: '/my-borrows', isPrivate: true },
  ];

  const visibleLinks = navLinks.filter((link) => !link.isPrivate || (link.isPrivate && !!user));

  return (
    <header className="w-full bg-white dark:bg-[#1a1715] px-6 sm:px-10 lg:px-14 py-6 border-b border-[#f0eae3] dark:border-stone-800 transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand Logo: booknook in custom terracotta styling */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#b87d5b] dark:text-[#d49977] lowercase flex items-center">
            b
            <span className="inline-flex items-center justify-center mx-0.5 text-[#b87d5b] dark:text-[#d49977]">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </span>
            knook
          </span>
        </Link>

        {/* Center Navigation Links (Matching the clean reference) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all relative py-1 ${
                  isActive
                    ? 'text-stone-900 dark:text-stone-100 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c8a88e]'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            /* Logged In User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-200 dark:border-stone-700"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="hidden sm:inline-block text-xs font-bold text-stone-800 dark:text-stone-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-xs text-stone-400">Signed in as</p>
                    <p className="text-sm font-bold text-stone-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/my-books"
                      onClick={() => setDropdownOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 transition-colors"
                    >
                      <Library className="w-4 h-4 text-[#b87d5b]" />
                      My Books
                    </Link>
                    <Link
                      href="/my-borrows"
                      onClick={() => setDropdownOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4 text-[#b87d5b]" />
                      My Library / Borrows
                    </Link>
                    <Link
                      href="/add-book"
                      onClick={() => setDropdownOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-[#b87d5b]" />
                      Add Book
                    </Link>
                  </div>

                  <div className="border-t border-stone-100 dark:border-stone-800 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated: Log In text + Sign Up clay pill button */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 px-2 py-1 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-xl text-sm font-bold bg-[#c8a88e] hover:bg-[#b89375] text-white shadow-sm transition-all hover:scale-102 active:scale-98"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl md:hidden text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-stone-100 dark:border-stone-800 mt-4 space-y-1">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-[#f4efe9] dark:bg-stone-800 text-[#b87d5b] font-bold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
