"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminRole, AdminUser } from '@/lib/types';
import apiClient from '@/lib/api';
import loanApi from '@/lib/loanApi';
import investmentApi from '@/lib/investmentApi';
import walletApi from '@/lib/walletApi';
import settingsApi from '@/lib/settingsApi';
import profileApi from '@/lib/profileApi';
import { useToast } from '@/components/ui/toast-provider';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  hasRole: (roles: AdminRole | AdminRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Memoize logout function to avoid dependency issues
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call logout endpoint
      await apiClient.logout();
      
      // Show logout success toast
      toast({
        title: "Logged Out",
        message: "You have been successfully logged out",
        type: "success",
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Show logout error toast
      toast({
        title: "Logout Error",
        message: "There was an issue logging out, but you've been signed out locally",
        type: "error",
      });
    } finally {
      // Clear user state and redirect to login regardless of API call result
      setUser(null);
      
      // Clear tokens from all API clients
      loanApi.clearToken();
      investmentApi.clearToken();
      walletApi.clearToken();
      settingsApi.clearToken();
      profileApi.clearToken();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_id');
      }
      setIsLoading(false);
      router.push('/login');
    }
  }, [router, toast]);

  // Check authentication status on mount and when token changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = apiClient.getToken();
        
        if (!token) {
          // Clear tokens from all API clients just in case
          loanApi.clearToken();
          investmentApi.clearToken();
          walletApi.clearToken();
          settingsApi.clearToken();
          profileApi.clearToken();
          setIsLoading(false);
          return;
        }

        // Get stored admin ID
        const adminId = typeof window !== 'undefined' ? localStorage.getItem('admin_id') : null;
        
        if (!adminId) {
          // No admin ID stored, clear token and return
          apiClient.clearToken();
          setIsLoading(false);
          return;
        }

        // Verify token with backend and get user profile
        const response = await apiClient.getProfile(adminId);
        
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Token is invalid, clear it from all API clients
          apiClient.clearToken();
          loanApi.clearToken();
          investmentApi.clearToken();
          walletApi.clearToken();
          settingsApi.clearToken();
          profileApi.clearToken();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_id');
          }
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        apiClient.clearToken();
        loanApi.clearToken();
        investmentApi.clearToken();
        walletApi.clearToken();
        settingsApi.clearToken();
        profileApi.clearToken();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_id');
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh token periodically
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (user && apiClient.getToken()) {
      // Refresh token every 30 minutes
      refreshInterval = setInterval(async () => {
        try {
          const response = await apiClient.refreshToken();
          if (response.success && response.data?.accessToken) {
            apiClient.setToken(response.data.accessToken);
            loanApi.setToken(response.data.accessToken);
            investmentApi.setToken(response.data.accessToken);
            walletApi.setToken(response.data.accessToken);
            settingsApi.setToken(response.data.accessToken);
            profileApi.setToken(response.data.accessToken);
            if (response.data.admin) {
              setUser(response.data.admin);
            }
          } else {
            // Refresh failed, log out user
            toast({
              title: "Session Expired",
              message: "Your session has expired. Please login again.",
              type: "error",
            });
            await logout();
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          toast({
            title: "Session Expired",
            message: "Your session has expired. Please login again.",
            type: "error",
          });
          await logout();
        }
      }, 30 * 60 * 1000); // 30 minutes
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user, logout, toast]);

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const response = await apiClient.login(email, password);
      
      console.log('Login response:', response); // Debug logging
      
      if (response.success && response.data) {
        // Backend returns admin data in response.data.admin, not response.data.user
        setUser(response.data.admin);
        
        // Ensure all API clients have the token set
        if (response.data.accessToken) {
          loanApi.setToken(response.data.accessToken);
          investmentApi.setToken(response.data.accessToken);
          walletApi.setToken(response.data.accessToken);
          settingsApi.setToken(response.data.accessToken);
          profileApi.setToken(response.data.accessToken);
        }
        
        // Store admin ID for future profile requests
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_id', response.data.admin.id);
        }
        
        // Show success toast
        toast({
          title: "Login Successful",
          message: `Welcome back, ${response.data.admin.firstName}!`,
          type: "success",
        });
        
        router.push('/dashboard');
        return { success: true };
      } else {
        const errorMessage = response.error || 'Login failed';
        console.error('Login API error:', response.error);
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      let errorMessage = 'An error occurred during login';

      // Handle axios errors
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { message?: string }; statusText?: string } };
        
        if (axiosError.response) {
          const status = axiosError.response.status;
          const data = axiosError.response.data;
          
          if (status === 401) {
            errorMessage = data?.message || 'Invalid email or password';
          } else if (status === 404) {
            errorMessage = 'Login endpoint not found. Please check your backend configuration.';
          } else if (status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = data?.message || `Error ${status}: ${axiosError.response.statusText}`;
      }
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error instanceof Error) {
        // Something else happened
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has specific permission based on role
  const checkPermission = (permission: string): boolean => {
    if (!user) return false;

    const rolePermissions: Record<AdminRole, string[]> = {
      [AdminRole.SUPER_ADMIN]: ['*'], // Super admin has all permissions
      [AdminRole.ADMIN]: [
        'viewDashboard', 'viewUsers', 'editUsers', 'viewInvestments', 
        'editInvestments', 'viewLoans', 'editLoans', 'viewSettings', 'editSettings'
      ],
      [AdminRole.SALES]: ['viewDashboard', 'viewUsers', 'viewInvestments', 'viewLoans'],
      [AdminRole.RISK]: ['viewDashboard', 'viewUsers', 'viewInvestments', 'viewLoans', 'approveLoans'],
      [AdminRole.FINANCE]: [
        'viewDashboard', 'viewUsers', 'viewInvestments', 'editInvestments', 
        'approveInvestments', 'viewLoans', 'editLoans', 'approveLoans'
      ],
      [AdminRole.COMPLIANCE]: ['viewDashboard', 'viewUsers', 'viewInvestments', 'viewLoans'],
      [AdminRole.COLLECTIONS]: ['viewDashboard', 'viewUsers', 'viewLoans', 'editLoans'],
      [AdminRole.PORT_MGT]: ['viewDashboard', 'viewUsers', 'viewInvestments', 'editInvestments'],
    };

    const userPermissions = rolePermissions[user.role] || [];
    
    // Super admin has all permissions
    if (userPermissions.includes('*')) return true;
    
    return userPermissions.includes(permission);
  };

  // Check if user has one of the specified roles
  const hasRole = (roles: AdminRole | AdminRole[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 