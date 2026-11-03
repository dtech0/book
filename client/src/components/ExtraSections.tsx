'use client';

import React from 'react';
import Link from 'next/link';
import { Search, BookMarked, RefreshCw, Star, ArrowRight } from 'lucide-react';

export function ExtraSections() {
  const steps = [
    {
      step: '01',
      title: 'Discover & Search',
      description: 'Explore textbooks, fiction, and academic resources with instantaneous search and genre filtering.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Borrow with 1-Click',
      description: 'Select your preferred return date. Available copies automatically decrement via real-time inventory.',
      icon: BookMarked,
    },
    {
      step: '03',
      title: 'Read & Return Easily',
      description: 'Read at your own pace and return the book with one click to restock the shelf for another student or reader.',
      icon: RefreshCw,
    },
  ];

  const categories = [
    { name: 'Contemporary Fiction', count: '1,240+ Books', href: '/books?category=Fiction' },
    { name: 'Science & Physics', count: '890+ Books', href: '/books?category=Science' },
    { name: 'Ancient History', count: '650+ Books', href: '/books?category=History' },
    { name: 'Kids & Illustrated', count: '480+ Books', href: '/books?category=Kids' },
  ];

  const reviews = [
    {
      name: 'Maya Lin',
      role: 'Literature Student',
      comment: 'BookNook transformed my study habits. Borrowing takes seconds and the UI is genuinely soothing and clean.',
      rating: 5,
    },
    {
      name: 'Julian Vance',
      role: 'High School Educator',
      comment: 'The easiest library management system I have used. Adding books and tracking borrows is effortless.',
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'Avid Reader',
      comment: 'I love being able to see exactly how many copies are available before deciding to borrow. Brilliant design.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pt-4">
      {/* Section 1: How it Works (Target of the hero button) */}
      <section id="how-it-works" className="space-y-8 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            How Borrowing Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
            Three simple steps to unlock your next literary journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-7 rounded-2xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#f4ede6] dark:bg-stone-800 flex items-center justify-center text-[#b87d5b] dark:text-[#d49977]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-black text-stone-300 dark:text-stone-700">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{item.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Top Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              Top Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
              Explore our most popular literary genres
            </p>
          </div>
          <Link
            href="/books"
            className="text-xs font-bold text-[#b87d5b] hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="p-6 rounded-2xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 hover:border-[#c8a88e] transition-colors group"
            >
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#b87d5b] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs font-semibold text-stone-400 mt-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3: Reader Reviews */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            Reader Reviews
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-medium">
            Feedback from students and educators in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-[#fdfbf9] dark:bg-[#201c19] border border-[#f0eae3] dark:border-stone-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#c8a88e] text-[#c8a88e]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#f0eae3] dark:border-stone-800">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{rev.name}</h4>
                <p className="text-xs text-stone-400">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
