"use client";

import React, { useState } from 'react';
import { Notification } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    message: 'New user registered: John Doe',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  },
  {
    id: '2',
    type: 'info',
    message: 'Investment application approved',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: '3',
    type: 'warning',
    message: 'System maintenance scheduled',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: '4',
    type: 'alert',
    message: 'New loan application submitted',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  }
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };
  
  // Mark single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  // View all notifications (without showing toast)
  const viewAllNotifications = () => {
    // Here you would typically navigate to a notifications page or show a full list
    // For demo purposes, we'll just close the dropdown
    setOpen(false);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full p-1 hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-1 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`flex flex-col items-start p-2 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                onSelect={() => markAsRead(notification.id)}
              >
                <div className="flex w-full justify-between">
                  <span className="text-sm font-medium">{notification.message}</span>
                  {!notification.isRead ? (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                </div>
                <div className="flex w-full items-center justify-between mt-1">
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                  {notification.isRead ? (
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Check className="mr-1 h-3 w-3" />
                      Read
                    </span>
                  ) : null}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="justify-center text-sm text-muted-foreground"
          onSelect={viewAllNotifications}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 