import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    template: 'BookNook | %s',
    default: 'BookNook – A Small Online Library',
  },
  description: 'BookNook is a small online library. Add a book, borrow a book, return a book. Discover fiction, science, history, and children books with real-time copy tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen p-2 sm:p-5 lg:p-8 flex flex-col justify-center">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {/* Main Rounded Frame Canvas (Matching the reference aesthetic) */}
            <div className="w-full max-w-[1400px] mx-auto bg-white dark:bg-[#1a1715] rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-stone-900/5 border border-[#e7ded6] dark:border-stone-800/80 overflow-hidden flex flex-col min-h-[94vh]">
              <Navbar />
              <main className="flex-1 w-full px-5 sm:px-10 lg:px-14 py-8">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster richColors position="top-right" closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
