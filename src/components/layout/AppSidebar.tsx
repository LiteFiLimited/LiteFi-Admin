"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { getRolePermissions } from '@/lib/auth';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  LineChart,
  Landmark,
  Settings,
  ShieldCheck,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  
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

  // Check if we're in the profile section
  const isProfileSection = pathname === '/profile';
  
  // Profile navigation items
  const profileItems = [
    {
      name: 'My Profile',
      href: '/profile?tab=personal',
      icon: User,
      isActive: !pathname.includes('security')
    },
    {
      name: 'Security',
      href: '/profile?tab=security',
      icon: Shield,
      isActive: pathname.includes('security')
    }
  ];
  
  return (
    <Sidebar
      className="border-r"
      collapsible="icon"
    >
      <SidebarHeader className="h-14 flex border-b border-transparent px-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center w-8 h-8">
            <Image 
              src="/assets/logo.svg" 
              alt="LiteFi"
              width={32}
              height={32}
              priority
              className="w-8 h-8"
            />
          </div>
          <span className="font-semibold text-lg group-data-[state=collapsed]:hidden">
            LiteFi Admin
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        {isProfileSection ? (
          <SidebarGroup>
            <SidebarGroupLabel className="hidden group-data-[state=collapsed]:hidden">
              Profile
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {profileItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild
                      isActive={item.isActive}
                      variant="default"
                      tooltip={item.name}
                    >
                      <Link href={item.href} className="flex items-center py-2">
                        <item.icon className={cn(
                          "h-6 w-6 mr-3 shrink-0", 
                          item.isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="text-sm group-data-[state=collapsed]:hidden">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarMenu>
            {navItems.map((item) => 
              item.isVisible && (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild
                    isActive={pathname === item.href}
                    variant="default"
                    tooltip={item.name}
                  >
                    <Link href={item.href} className="flex items-center py-2">
                      <item.icon className={cn(
                        "h-6 w-6 mr-3 shrink-0", 
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="text-sm group-data-[state=collapsed]:hidden">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4 group-data-[state=collapsed]:p-2 group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center">
        {isOpen && user ? (
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors w-full"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => logout()}
            className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-muted-foreground hover:text-primary" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
} 