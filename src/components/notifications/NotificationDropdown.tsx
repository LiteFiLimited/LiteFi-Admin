"use client";

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Check, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    refreshUnreadCount,
    markAllAsRead: contextMarkAllAsRead,
    markAsRead
  } = useNotifications();

  // Refresh data when dropdown opens
  useEffect(() => {
    if (open) {
      refreshNotifications();
      refreshUnreadCount();
    }
  }, [open, refreshNotifications, refreshUnreadCount]);
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
  
  // Mark all as read using context
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingRead(true);
      const success = await contextMarkAllAsRead();
      
      if (success) {
        toast({
          title: "All notifications marked as read",
          type: "success",
        });
      } else {
        toast({
          title: "Failed to mark notifications as read",
          message: "Please try again",
          type: "error",
        });
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Network error",
        message: "Unable to mark notifications as read",
        type: "error",
      });
    } finally {
      setMarkingRead(false);
    }
  };
  
  // View all notifications - navigate to notifications page
  const viewAllNotifications = () => {
    setOpen(false);
    router.push('/notifications');
  };

  // Get the recent notifications for dropdown (limit to 5)
  const recentNotifications = notifications.slice(0, 5);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full p-1 hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
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
              onClick={handleMarkAllAsRead}
              disabled={markingRead}
            >
              {markingRead ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : null}
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p>No notifications</p>
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                onSelect={() => markAsRead(notification.id)}
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="flex h-2 w-2 rounded-full bg-primary ml-2 mt-1 flex-shrink-0" />
                  )}
                </div>
                <div className="flex w-full items-center justify-between mt-2">
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                  {notification.read && (
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Check className="mr-1 h-3 w-3" />
                      Read
                    </span>
                  )}
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