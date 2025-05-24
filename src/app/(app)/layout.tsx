"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider 
      defaultOpen={!isMobile}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3.5rem",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex h-full flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
              <ScrollToTopButton />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
} 