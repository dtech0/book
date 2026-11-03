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
    return new Promise<void>((resolve, reject) => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        return reject(new Error('Google Client ID is not configured.'));
      }

      if (typeof window === 'undefined' || !(window as any).google?.accounts?.oauth2) {
        return reject(new Error('Google Identity Services script is still loading. Please try again.'));
      }

      try {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              return reject(new Error(tokenResponse.error));
            }

            try {
              // 1. Fetch real user profile from Google using the access token
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userInfo = await userInfoRes.json();

              if (!userInfo.email) {
                throw new Error('Google did not return an email address');
              }

              // 2. Sync profile with our Express backend & get signed JWT
              const res = await api.googleLogin({
                name: userInfo.name || 'Google User',
                email: userInfo.email,
                photoURL: userInfo.picture || '',
              });

              if (res.token && res.user) {
                localStorage.setItem('booknook_token', res.token);
                localStorage.setItem('booknook_user', JSON.stringify(res.user));
                setUser(res.user);
                resolve();
              } else {
                throw new Error(res.message || 'Google login failed on backend');
              }
            } catch (err) {
              reject(err);
            }
          },
        });

        tokenClient.requestAccessToken();
      } catch (err) {
        reject(err);
      }
    });
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
