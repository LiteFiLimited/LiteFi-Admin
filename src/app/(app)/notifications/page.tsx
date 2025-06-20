"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Info,
  AlertTriangle
} from 'lucide-react';
import { Notification } from '@/lib/types';
import { useToast } from '@/components/ui/toast-provider';

// Define types for notification creation
type NotificationType = 'info' | 'warning' | 'alert';
type RecipientType = 'all' | 'admins' | 'specific';

interface NewNotificationState {
  title: string;
  message: string;
  type: NotificationType;
  recipients: RecipientType;
}

export default function NotificationsPage() {
  const { toast } = useToast();
  
  // Sample notifications - would normally come from API
  const [notifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      type: 'alert',
      message: 'New user registered: John Doe',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    },
    {
      id: 'notif_2',
      type: 'info',
      message: 'Investment application approved for ₦500,000',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 'notif_3',
      type: 'warning',
      message: 'System maintenance scheduled for tonight at 2:00 AM',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 'notif_4',
      type: 'alert',
      message: 'Withdrawal request pending approval - ₦150,000',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
      id: 'notif_5',
      type: 'info',
      message: 'Monthly reports are now available for download',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ]);

  // State for creating new notifications
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<NewNotificationState>({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all'
  });

  // Calculate notification statistics
  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    read: notifications.filter(n => n.isRead).length,
    alerts: notifications.filter(n => n.type === 'alert').length,
    warnings: notifications.filter(n => n.type === 'warning').length,
    info: notifications.filter(n => n.type === 'info').length
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'alert':
        return <Badge className="bg-red-500">Alert</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-500">Info</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

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

  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Validation Error",
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    try {
      // Here you would call the API to create the notification
      console.log('Creating notification:', newNotification);

      toast({
        title: "Notification Created",
        message: `Notification "${newNotification.title}" has been sent successfully`,
        type: "success",
      });

      setIsCreateModalOpen(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all'
      });
    } catch {
      toast({
        title: "Error",
        message: "Failed to create notification. Please try again.",
        type: "error",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      // Here you would call the API to mark all notifications as read
      console.log('Marking all notifications as read');
      
      toast({
        title: "All Notifications Marked as Read",
        message: "All unread notifications have been marked as read",
        type: "success",
      });
    } catch {
      toast({
        title: "Error",
        message: "Failed to mark notifications as read. Please try again.",
        type: "error",
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Here you would call the API to mark a specific notification as read
      console.log('Marking notification as read:', notificationId);
      
      toast({
        title: "Notification Marked as Read",
        type: "success",
      });
    } catch {
      toast({
        title: "Error",
        message: "Failed to mark notification as read. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notification Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
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
                  Send a notification to admin users or specific groups
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
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value: NotificationType) => 
                      setNewNotification(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select 
                    value={newNotification.recipients} 
                    onValueChange={(value: RecipientType) => 
                      setNewNotification(prev => ({ ...prev, recipients: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Admin Users</SelectItem>
                      <SelectItem value="admins">Super Admins Only</SelectItem>
                      <SelectItem value="specific">Specific Roles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bell className="w-4 h-4 mr-2 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationStats.total}</div>
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
            <div className="text-2xl font-bold">{notificationStats.unread}</div>
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
            <div className="text-2xl font-bold">{notificationStats.read}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationStats.alerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationStats.warnings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Info className="w-4 h-4 mr-2 text-blue-600" />
              Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationStats.info}</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Manage and view all admin notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notifications..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Time Ago</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      {getNotificationBadge(notification.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.message}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(notification.isRead)}</TableCell>
                  <TableCell>{formatDate(notification.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
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
        </CardContent>
      </Card>
    </div>
  );
} 