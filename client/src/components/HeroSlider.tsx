'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface SlideData {
  title: string;
  description: string;
  image: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

const slides: SlideData[] = [
  {
    title: "Let's take a new journey with a new Book",
    description: 'Access thousands of textbooks, bestsellers, and academic resources instantly. Save time and expand your mind by borrowing digital copies.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    stat1Value: '10K+',
    stat1Label: 'Books Available',
    stat2Value: '50K+',
    stat2Label: 'Happy Readers',
    stat3Value: '$5M+',
    stat3Label: 'Saved by Members',
  },
  {
    title: 'Explore the Cosmos, Science & Future Tech',
    description: 'From quantum computing to astrophysics and neuroscience, dive into cutting-edge volumes curated for curious minds and scholars.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    stat1Value: '4,500+',
    stat1Label: 'Science Titles',
    stat2Value: '28K+',
    stat2Label: 'Student Checkouts',
    stat3Value: '100%',
    stat3Label: 'Free Reservation',
  },
  {
    title: 'Timeless Chronicles That Shaped Our World',
    description: 'Step into historical revolutions, ancient empires, and intimate memoirs of visionary leaders who redefined modern civilization.',
    image: 'https://images.unsplash.com/photo-1507842229451-79b1be886a27?auto=format&fit=crop&w=1200&q=80',
    stat1Value: '3,200+',
    stat1Label: 'Historical Records',
    stat2Value: '18K+',
    stat2Label: 'Active Members',
    stat3Value: '4.9 ★',
    stat3Label: 'Community Rating',
  },
];

export function HeroSlider() {
  return (
    <div className="w-full pt-2 pb-6">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 sm:py-6">
              {/* Left Column: Heading, description, CTA, Stats */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-stone-900 dark:text-stone-100 leading-[1.12] tracking-tight">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-lg leading-relaxed font-normal">
                  {slide.description}
                </p>

                {/* Buttons (Matching the reference style) */}
                <div className="flex items-center gap-4 pt-2">
                  <Link
                    href="/books"
                    className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#c8a88e] hover:bg-[#b89375] text-white shadow-sm transition-all hover:scale-102 active:scale-98"
                  >
                    Start Browsing
                  </Link>

                  <a
                    href="#how-it-works"
                    className="px-4 py-3.5 text-sm font-bold text-stone-800 dark:text-stone-200 hover:text-[#b87d5b] dark:hover:text-[#d49977] transition-colors"
                  >
                    How it Works
                  </a>
                </div>

                {/* Stats Row (Matching the reference numbers) */}
                <div className="pt-6 border-t border-[#f0eae3] dark:border-stone-800 flex items-center gap-8 sm:gap-12">
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                      {slide.stat1Value}
                    </p>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">
                      {slide.stat1Label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                      {slide.stat2Value}
                    </p>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">
                      {slide.stat2Label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                      {slide.stat3Value}
                    </p>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">
                      {slide.stat3Label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Rounded Photo */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-lg shadow-stone-900/5">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
