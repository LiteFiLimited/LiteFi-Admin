"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Send,
  Eye,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { CreateNotificationRequest } from '@/lib/types';
import { useToast } from '@/components/ui/toast-provider';
import notificationsApi from '@/lib/notificationsApi';
import { NotificationsSkeleton } from '@/components/notifications/NotificationsSkeleton';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationsPage() {
  const { toast } = useToast();
  
  // Use the notification context
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    refreshUnreadCount,
    markAllAsRead: contextMarkAllAsRead,
    markAsRead
  } = useNotifications();
  
  // Local state for UI
  const [creating, setCreating] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Create notification modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<CreateNotificationRequest>({
    title: '',
    message: '',
    read: false
  });

  // Refresh data when component mounts
  useEffect(() => {
    refreshNotifications();
    refreshUnreadCount();
  }, [refreshNotifications, refreshUnreadCount]);

  // Handle create notification
  const handleCreateNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast({
        title: "Validation Error",
        message: "Please fill in both title and message",
        type: "error",
      });
      return;
    }

    try {
      setCreating(true);

      const response = await notificationsApi.createNotification(newNotification);

      if (response.success) {
        toast({
          title: "Notification Created",
          message: "Notification has been created successfully",
          type: "success",
        });
        
        setIsCreateModalOpen(false);
        setNewNotification({ title: '', message: '', read: false });
        
        // Refresh notifications list using context
        await refreshNotifications();
        await refreshUnreadCount();
      } else {
        toast({
          title: "Create Failed",
          message: response.error || 'Failed to create notification',
          type: "error",
        });
      }
    } catch (err) {
      console.error('Error creating notification:', err);
      toast({
        title: "Network Error",
        message: "Unable to create notification. Please try again.",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle mark all as read using context
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingRead(true);

      const success = await contextMarkAllAsRead();

      if (success) {
        toast({
          title: "Marked as Read",
          message: "All notifications have been marked as read",
          type: "success",
        });
      } else {
        toast({
          title: "Update Failed",
          message: "Failed to mark notifications as read",
          type: "error",
        });
      }
    } catch (err) {
      console.error('Error marking as read:', err);
      toast({
        title: "Network Error",
        message: "Unable to update notifications. Please try again.",
        type: "error",
      });
    } finally {
      setMarkingRead(false);
    }
  };

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatusFilter = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.read) ||
      (statusFilter === 'unread' && !notification.read);
    
    return matchesSearch && matchesStatusFilter;
  });

  // Calculate statistics
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Get status badge
  const getStatusBadge = (isRead: boolean) => {
    return isRead ? (
      <Badge variant="outline" className="text-green-600 border-green-600">
        <Check className="w-3 h-3 mr-1" />
        Read
      </Badge>
    ) : (
      <Badge className="bg-orange-500">
        <Clock className="w-3 h-3 mr-1" />
        Unread
      </Badge>
    );
  };

  // Show loading skeleton
  if (loading) {
    return <NotificationsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notification Management</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            disabled={markingRead || unreadCount === 0}
          >
            {markingRead ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Mark All Read
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to admin users
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification} disabled={creating}>
                  {creating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bell className="w-4 h-4 mr-2 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-600" />
              Unread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Read
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.read}</div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Backend Not Ready</p>
                <p className="text-sm">
                  The notifications API endpoints are not yet implemented on the backend. 
                  This is normal during development.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshNotifications}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Manage and view all admin notifications ({filteredNotifications.length} of {notifications.length} notifications)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notifications..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {notifications.length === 0 ? (
                <div>
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No notifications found</p>
                  <p className="text-sm">Create your first notification to get started</p>
                </div>
              ) : (
                <div>
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No notifications match your filters</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Time Ago</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`max-w-xs truncate ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(notification.read)}</TableCell>
                    <TableCell>{formatDate(notification.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {getRelativeTime(notification.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {!notification.read && (
                          <Button
                            size="sm"
                            onClick={() => {
                              // Use the context markAsRead function
                              markAsRead(notification.id);
                              toast({
                                title: "Marked as Read",
                                message: "Notification marked as read",
                                type: "success",
                              });
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}