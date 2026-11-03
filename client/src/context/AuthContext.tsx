'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Rehydrate session on mount without redirecting to login
  useEffect(() => {
    const token = localStorage.getItem('booknook_token');
    const storedUser = localStorage.getItem('booknook_user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('booknook_user');
        localStorage.removeItem('booknook_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('booknook_token', res.token);
      localStorage.setItem('booknook_user', JSON.stringify(res.user));
      setUser(res.user);
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string) => {
    const res = await api.register({ name, email, password, photoURL });
    if (res.token && res.user) {
      localStorage.setItem('booknook_token', res.token);
      localStorage.setItem('booknook_user', JSON.stringify(res.user));
      setUser(res.user);
    }
  };

  const loginWithGoogle = async () => {
    // Simulated Google OAuth profile
    const mockGoogleProfile = {
      name: 'Sarah Connor',
      email: 'sarah.reader@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    };
    const res = await api.googleLogin(mockGoogleProfile);
    if (res.token && res.user) {
      localStorage.setItem('booknook_token', res.token);
      localStorage.setItem('booknook_user', JSON.stringify(res.user));
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('booknook_token');
    localStorage.removeItem('booknook_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
