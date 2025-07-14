"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AdminRole, AdminUser } from '@/lib/types';
import { AddAdminModal } from '@/components/roles/AddAdminModal';
import { EditAdminModal, type EditAdminFormValues } from '@/components/roles/EditAdminModal';
import { RolesSkeleton } from '@/components/roles/RolesSkeleton';
import { UserCheck, UserX, Users, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { Button } from '@/components/ui/button';
import profileApi from '@/lib/profileApi';

export default function RolesPage() {
  const { toast } = useToast();
  
  // State for admin users data - ensure it's always an array
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingAdminId, setProcessingAdminId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Safe setter for adminUsers that ensures it's always an array
  const setSafeAdminUsers = (users: AdminUser[] | null | undefined) => {
    setAdminUsers(Array.isArray(users) ? users : []);
  };

  // Load admin users from API
  const loadAdmins = async (showRefreshingIndicator = false) => {
    try {
      if (showRefreshingIndicator) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      console.log('Loading admin users...');
      
      const response = await profileApi.getAdmins();
      
      if (response.success && response.data && Array.isArray(response.data.admins)) {
        setSafeAdminUsers(response.data.admins);
        console.log('Loaded admin users:', response.data.admins);
        
        if (response.data.admins.length === 0) {
          toast({
            title: "No Admin Users Found",
            message: "Admin management endpoints may not be fully implemented yet.",
            type: "warning",
          });
        }
      } else {
        console.warn('Admin endpoints not available, using fallback data');
        toast({
          title: "Admin Management Unavailable",
          message: response.error || "Admin management endpoints not yet implemented. Contact your system administrator.",
          type: "warning",
        });
        // Ensure adminUsers is always an array
        setSafeAdminUsers([]);
      }
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        title: "Error",
        message: "Failed to load admin users. Please try again.",
        type: "error",
      });
      // Ensure adminUsers is always an array, even on error
      setSafeAdminUsers([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load admins on component mount
  useEffect(() => {
    loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Get role display name
  const getRoleDisplayName = (role: AdminRole) => {
    switch (role) {
      case AdminRole.SUPER_ADMIN:
        return 'Super Admin';
      case AdminRole.ADMIN:
        return 'Admin';
      case AdminRole.SALES:
        return 'Sales';
      case AdminRole.RISK:
        return 'Risk';
      case AdminRole.FINANCE:
        return 'Finance';
      case AdminRole.COMPLIANCE:
        return 'Compliance';
      case AdminRole.COLLECTIONS:
        return 'Collections';
      case AdminRole.PORT_MGT:
        return 'Portfolio Management';
      default:
        return role;
    }
  };

  // Get role badge color
  const getRoleBadge = (role: AdminRole) => {
    let className = '';
    
    switch (role) {
      case AdminRole.SUPER_ADMIN:
        className = 'bg-purple-500';
        break;
      case AdminRole.ADMIN:
        className = 'bg-blue-500';
        break;
      case AdminRole.SALES:
        className = 'bg-green-500';
        break;
      case AdminRole.RISK:
        className = 'bg-yellow-500';
        break;
      case AdminRole.FINANCE:
        className = 'bg-indigo-500';
        break;
      case AdminRole.COMPLIANCE:
        className = 'bg-teal-500';
        break;
      case AdminRole.COLLECTIONS:
        className = 'bg-red-500';
        break;
      case AdminRole.PORT_MGT:
        className = 'bg-pink-500';
        break;
      default:
        className = 'bg-gray-500';
    }
    
    return <Badge className={className}>{getRoleDisplayName(role)}</Badge>;
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-500">Active</Badge> : 
      <Badge className="bg-red-500">Inactive</Badge>;
  };

  // Handle adding a new admin
  const handleAddAdmin = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: AdminRole;
    isActive: boolean;
  }) => {
    try {
      console.log('Adding new admin:', data);
      
      const response = await profileApi.createAdmin({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        isActive: data.isActive,
      });
      
      if (response.success && response.data) {
        // Add to local state immediately for UI responsiveness
        const newAdmin = response.data.admin;
        setAdminUsers(prev => {
          const safeCurrentUsers = Array.isArray(prev) ? prev : [];
          return [...safeCurrentUsers, newAdmin];
        });
        
        // Show success toast
        toast({
          title: "Admin Added Successfully",
          message: `${data.firstName} ${data.lastName} has been added as ${getRoleDisplayName(data.role)}`,
          type: "success",
        });
        
        // Refresh data to ensure consistency
        loadAdmins(true);
      } else {
        throw new Error(response.error || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      
      // Show error toast
      toast({
        title: "Error Adding Admin",
        message: error instanceof Error ? error.message : "There was an error adding the admin. Please try again.",
        type: "error",
      });
    }
  };

  // Handle editing an admin
  const handleEditAdmin = async (id: string, data: EditAdminFormValues) => {
    try {
      setProcessingAdminId(id);
      console.log(`Editing admin ${id}:`, data);
      
      const response = await profileApi.updateAdmin(id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
      });
      
      if (response.success && response.data) {
        // Update local state immediately for UI responsiveness
        setAdminUsers(prev => {
          const safeCurrentUsers = Array.isArray(prev) ? prev : [];
          return safeCurrentUsers.map(admin => 
            admin.id === id ? { ...admin, ...data } : admin
          );
        });
        
        // Show success toast
        toast({
          title: "Admin Updated Successfully",
          message: `${data.firstName} ${data.lastName}'s information has been updated`,
          type: "success",
        });
        
        // Refresh data to ensure consistency
        loadAdmins(true);
      } else {
        throw new Error(response.error || 'Failed to update admin');
      }
    } catch (error) {
      console.error('Error editing admin:', error);
      
      // Show error toast
      toast({
        title: "Error Updating Admin",
        message: error instanceof Error ? error.message : "There was an error updating the admin. Please try again.",
        type: "error",
      });
    } finally {
      setProcessingAdminId(null);
    }
  };

  // Handle activating/deactivating an admin
  const handleToggleActive = async (admin: AdminUser) => {
    try {
      setProcessingAdminId(admin.id);
      console.log(`${admin.isActive ? 'Deactivating' : 'Activating'} admin ${admin.id}`);
      
      const newStatus = !admin.isActive;
      const response = await profileApi.updateAdminStatus(admin.id, newStatus);
      
      if (response.success && response.data) {
        // Update local state immediately for UI responsiveness
        setAdminUsers(prev => {
          const safeCurrentUsers = Array.isArray(prev) ? prev : [];
          return safeCurrentUsers.map(item => 
            item.id === admin.id ? { ...item, isActive: newStatus } : item
          );
        });
        
        // Show success toast
        toast({
          title: `Admin ${newStatus ? 'Activated' : 'Deactivated'}`,
          message: `${admin.firstName} ${admin.lastName} has been ${newStatus ? 'activated' : 'deactivated'}`,
          type: "success",
        });
        
        // Refresh data to ensure consistency
        loadAdmins(true);
      } else {
        throw new Error(response.error || 'Failed to update admin status');
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      
      // Show error toast
      toast({
        title: "Error Updating Status",
        message: error instanceof Error ? error.message : "There was an error updating the admin status. Please try again.",
        type: "error",
      });
    } finally {
      setProcessingAdminId(null);
    }
  };

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <RolesSkeleton />;
  }

  // Ensure adminUsers is always an array for safe operations
  const safeAdminUsers = Array.isArray(adminUsers) ? adminUsers : [];
  
  const activeAdmins = safeAdminUsers.filter(admin => admin.isActive).length;
  const totalAdmins = safeAdminUsers.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Roles</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadAdmins(true)}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <AddAdminModal onAddAdmin={handleAddAdmin} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Total Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All admin accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              Active Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserX className="w-4 h-4 mr-2" />
              Inactive Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins - activeAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently inactive
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            Manage administrative users and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {safeAdminUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Admin Users Found</h3>
              <p className="text-gray-500 mb-4">
                Admin management endpoints may not be fully implemented yet.
              </p>
              <AddAdminModal onAddAdmin={handleAddAdmin} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeAdminUsers.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell>{formatDate(admin.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(admin.isActive)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditAdminModal 
                          admin={admin} 
                          onEditAdmin={handleEditAdmin}
                          isLoading={processingAdminId === admin.id}
                        />
                        <Switch
                          checked={admin.isActive}
                          onCheckedChange={() => handleToggleActive(admin)}
                          disabled={processingAdminId === admin.id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Role-based access control settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Super Admin</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Finance</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Portfolio Mgt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Dashboard</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">User Management</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Investment Management</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>✓</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Loan Management</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Settings</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Role Management</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Legend:</strong> ✓ = Full Access, View = Read-only Access, - = No Access
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 