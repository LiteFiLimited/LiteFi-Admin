"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminUser, AuthResponse, AdminRole } from '@/lib/types';
import { AuthContextType } from '@/lib/auth';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dev credentials for testing (remove in production)
const DEV_CREDENTIALS: Record<string, AdminUser> = {
  'admin@litefi.com': {
    id: 'admin-dev-1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@litefi.com',
    role: AdminRole.ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'superadmin@litefi.com': {
    id: 'superadmin-dev-1',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@litefi.com',
    role: AdminRole.SUPER_ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In development, if there's no API running, use dev credentials
        if (process.env.NODE_ENV === 'development') {
          // Check local storage for "dev_user" - a simple dev auth mechanism
          const devUserEmail = localStorage.getItem('dev_user');
          if (devUserEmail && DEV_CREDENTIALS[devUserEmail]) {
            setUser(DEV_CREDENTIALS[devUserEmail]);
            setIsLoading(false);
            return;
          }
        }

        // Try to get user profile from API
        const response = await api.request<AdminUser>('/admin/auth/profile');
        
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // If not authenticated and not on login page, redirect to login
          if (window.location.pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // If authentication check fails and not on login page, redirect to login
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For development: check hardcoded credentials first
      if ((email === 'admin@litefi.com' || email === 'superadmin@litefi.com') && 
          password === 'password1') {
        
        // Use hardcoded user data
        const devUser = DEV_CREDENTIALS[email];
        setUser(devUser);
        
        // Store the dev user email in localStorage for persistence
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('dev_user', email);
        }
        
        router.push('/dashboard');
        return true;
      }
      
      // Regular API flow for production
      const response = await api.login(email, password);
      
      if (response.success && response.data) {
        const authData = response.data as AuthResponse;
        setUser(authData.user);
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      // Use void to suppress unused variable warning
      void error;
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // For dev credentials, just clear localStorage
      if (process.env.NODE_ENV === 'development') {
        localStorage.removeItem('dev_user');
      }
      
      // No need to call API logout for dev credentials
      if (user?.email === 'admin@litefi.com' || user?.email === 'superadmin@litefi.com') {
        setUser(null);
        router.push('/login');
        return;
      }
      
      await api.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, still clear user state and redirect
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 