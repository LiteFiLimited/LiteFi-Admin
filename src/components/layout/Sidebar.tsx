"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { getRolePermissions } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  LineChart,
  Landmark,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Get permissions based on user role
  const permissions = user ? getRolePermissions(user.role) : {
    viewDashboard: false,
    viewUsers: false,
    viewInvestments: false,
    viewLoans: false,
    viewSettings: false,
    viewRoles: false
  };
  
  // Navigation items with permission checks
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isVisible: permissions.viewDashboard
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      isVisible: permissions.viewUsers
    },
    {
      name: 'Investments',
      href: '/investments',
      icon: LineChart,
      isVisible: permissions.viewInvestments
    },
    {
      name: 'Loans',
      href: '/loans',
      icon: Landmark,
      isVisible: permissions.viewLoans
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      isVisible: permissions.viewSettings
    },
    {
      name: 'Roles',
      href: '/roles',
      icon: ShieldCheck,
      isVisible: permissions.viewRoles
    }
  ];
  
  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image 
            src="/assets/litefi.svg" 
            alt="LiteFi Admin"
            width={100}
            height={32}
            priority
          />
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => 
          item.isVisible && (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href 
                  ? "bg-muted text-primary" 
                  : "hover:bg-muted hover:text-primary text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        )}
      </nav>
      
      {/* User info and logout */}
      <div className="p-4 border-t">
        {user && (
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 