const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: 'Fiction' | 'Science' | 'History' | 'Kids' | 'Others';
  image: string;
  description: string;
  totalCopies: number;
  userName: string;
  userEmail: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  status: 'borrowed' | 'returned';
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  token?: string;
  user?: any;
  remainingCopies?: number;
}

// Helper to fetch with token
async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('booknook_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({
    success: false,
    message: 'Failed to parse JSON response',
  }));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Books (5 routes)
  getBooks: (params?: { category?: string; search?: string; limit?: number; sort?: string; userEmail?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.userEmail) searchParams.append('userEmail', params.userEmail);
    const queryString = searchParams.toString();
    return request<Book[]>(`/books${queryString ? `?${queryString}` : ''}`);
  },

  getBookById: (id: string) => request<Book>(`/books/${id}`),

  createBook: (bookData: {
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    totalCopies: number;
    userName: string;
    userEmail: string;
  }) =>
    request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    }),

  updateBook: (id: string, updates: Partial<Book>) =>
    request<Book>(`/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteBook: (id: string) =>
    request<Book>(`/books/${id}`, {
      method: 'DELETE',
    }),

  // Borrows (3 routes)
  borrowBook: (data: {
    bookId: string;
    bookTitle: string;
    bookImage: string;
    returnDate: string;
    userEmail: string;
    userName: string;
  }) =>
    request<Borrow>('/borrows', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUserBorrows: (userEmail?: string) => {
    const query = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : '';
    return request<Borrow[]>(`/borrows${query}`);
  },

  returnBook: (borrowId: string) =>
    request<{ returnedBookId: string }>(`/borrows/${borrowId}`, {
      method: 'DELETE',
    }),

  // Auth routes
  register: (userData: { name: string; email: string; photoURL?: string; password: string }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  googleLogin: (googleUser: { name: string; email: string; photoURL?: string }) =>
    request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleUser),
    }),

  getCurrentUser: () => request('/auth/me'),
};
