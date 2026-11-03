# BookNook – A Small Online Library

> **"Add a book, borrow a book, return a book."**

**Live Website Link:** [https://booknook-library.vercel.app](https://booknook-library.vercel.app)  
**Client-side Repository:** [https://github.com/your-username/booknook-client](https://github.com/your-username/booknook-client)  
**Server-side Repository:** [https://github.com/your-username/booknook-server](https://github.com/your-username/booknook-server)

---

## 🌟 Key Features

- **Dynamic Interactive Catalog with Zero Placeholder Text:** Explore an authentic catalog of titles categorized into Fiction, Science, History, Kids, and more with instant category filtering, title/author search, and custom responsive cards (3 cards per row on desktop).
- **Automated Inventory & Real-Time Stock Control (Challenge):** Complete inventory management using MongoDB `$inc` atomic operators. Decreases available copies by 1 when a book is borrowed and automatically increments copies by 1 upon return. If copies reach 0, the borrow button dynamically switches to a disabled "Not Available" badge.
- **Double Borrow Prevention (Challenge):** Prevents a user from borrowing the same book twice simultaneously. If an active check-out exists, an informative custom error toast is displayed.
- **Robust JWT Authentication & Protected Routes:** Secured with JSON Web Tokens (JWT) and Next.js / BetterAuth session rehydration. Private routes (`/add-book`, `/books/:id`, `/my-books`, `/my-borrows`) redirect unauthenticated visitors to `/login` and return them seamlessly after sign-in without breaking on page reload.
- **Custom Modals & Sonner Toast Notifications (No Default Alerts):** Fully compliant with clean UX standards: zero native browser `alert()` or `confirm()` dialogs. Featuring custom branded animated confirmation modals for deletions, returns, and borrowing reservations.
- **Modern ThemeForest-Grade Aesthetics & Dark/Light Mode:** Designed with a curated emerald-slate palette, Swiper.js multi-slide hero carousel, Framer Motion animations, accessible mobile hamburger drawer, and the rebranded new X social logo.

---

## 🛠️ Technology Stack

### Client Side
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS, Lucide Icons, Glassmorphic overlays
- **Carousel:** Swiper.js (Autoplay, Fade effect, custom pagination bullets)
- **Animations:** Framer Motion
- **Toasts & Modals:** Sonner Toast system & custom accessible dialogs
- **Themes:** `next-themes` (Dark / Light mode toggle)

### Server Side
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), Bcrypt.js password hashing, CORS
- **Validation:** Strict uppercase, lowercase, and minimum 6-character password rules

---

## 🚀 Getting Started Locally

### 1. Backend Server Setup
```bash
cd server
npm install
npm start # runs on port 5000
```
*(Optional) Seed the database with authentic books:*
```bash
npm run seed
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev # runs on port 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience BookNook!

---

## 📋 API Specification (8 Core Endpoints)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/books` | Public | Retrieve all books (with category & search queries) |
| `GET` | `/books/:id` | Private (JWT) | Retrieve a single book's full details |
| `POST` | `/books` | Private (JWT) | Add a new book to the catalog |
| `PATCH` | `/books/:id` | Private (JWT) | Update existing book information |
| `DELETE` | `/books/:id` | Private (JWT) | Delete a book by ID |
| `POST` | `/borrows` | Private (JWT) | Borrow a book (atomic `$inc: -1`) |
| `GET` | `/borrows` | Private (JWT) | Get all borrows of the logged-in user |
| `DELETE` | `/borrows/:id` | Private (JWT) | Return a borrowed book (atomic `$inc: +1`) |

---

## 📄 License
MIT © BookNook Project
