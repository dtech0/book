# BookNook – Client Frontend

Next.js 15 App Router frontend for BookNook – A Small Online Library.

**Live Demo:** [https://booknook-library.vercel.app](https://booknook-library.vercel.app)

## Features
- **Swiper.js Hero Banner:** Dynamic multi-slide hero carousel with custom pagination and smooth transitions.
- **Dynamic New Arrivals:** Fetches latest 6 books from MongoDB with sort and limit.
- **Dynamic 3-Column Catalog:** Responsive grid layout with category filters and real-time title/author search.
- **Private Route Protection:** Full route guarding with redirect-back to the target page upon login.
- **Persistent Session:** Refreshing the page never drops user session or causes 404 errors.
- **Custom Modals & Sonner Toasts:** Zero native browser alert/confirm calls; custom modals for borrow, edit, and deletion.
- **Dark / Light Theme Toggle:** Clean navbar theme switcher using `next-themes`.

## Scripts
```bash
npm run dev    # Start dev server on http://localhost:3000
npm run build  # Build production bundle
npm run start  # Start production server
```
