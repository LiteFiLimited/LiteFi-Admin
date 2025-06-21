"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { AdminRole } from '@/lib/types';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: AdminRole[];
  requiredPermissions?: string[];
}

// Public routes that don't require authentication
const publicRoutes = ['/login'];

export function RouteGuard({ 
  children, 
  requiredRoles, 
  requiredPermissions 
}: RouteGuardProps) {
  const { isLoading, isAuthenticated, checkPermission, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated and not on a public route, redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
      return;
    }

    // If user is authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname === '/login') {
      router.push('/dashboard');
      return;
    }

    // Check role-based access
    if (isAuthenticated && requiredRoles && requiredRoles.length > 0) {
      if (!hasRole(requiredRoles)) {
        // User doesn't have required role, redirect to dashboard with error
        router.push('/dashboard?error=insufficient_permissions');
        return;
      }
    }

    // Check permission-based access
    if (isAuthenticated && requiredPermissions && requiredPermissions.length > 0) {
      const hasRequiredPermissions = requiredPermissions.every(permission => 
        checkPermission(permission)
      );

      if (!hasRequiredPermissions) {
        // User doesn't have required permissions, redirect to dashboard with error
        router.push('/dashboard?error=insufficient_permissions');
        return;
      }
    }
  }, [
    isLoading, 
    isAuthenticated, 
    pathname, 
    router, 
    requiredRoles, 
    requiredPermissions, 
    hasRole, 
    checkPermission
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated and not on a public route, show nothing (will redirect)
  if (!isAuthenticated && !publicRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  // If user is authenticated but lacks required permissions, show nothing (will redirect)
  if (isAuthenticated && requiredRoles && !hasRole(requiredRoles)) {
    return null;
  }

  if (isAuthenticated && requiredPermissions && 
      !requiredPermissions.every(permission => checkPermission(permission))) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
} 