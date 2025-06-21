"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserFilterForm } from '@/components/users/UserFilterForm';
import { UsersTable } from '@/components/users/UsersTable';
import { PaginationControls } from '@/components/users/PaginationControls';
import { useSearchParams } from 'next/navigation';
import { User, Pagination } from '@/lib/types';
import { Plus, RefreshCw } from 'lucide-react';
import useToast from '@/components/ui/use-toast';

// Import API client
import apiClient from '@/lib/api';

export default function UsersPage() {
  const searchParams = useSearchParams();
  // Use the imported apiClient directly
  const { toast } = useToast();
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Load users data
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
      
      // Convert filters to appropriate types
      const apiFilters: Record<string, string | boolean | number> = { ...filters };
      if (filters.verified) {
        apiFilters.verified = filters.verified === 'true';
      }
      if (filters.isActive) {
        apiFilters.isActive = filters.isActive === 'true';
      }
      
      // Merge search params with filters
      const params = {
        page,
        limit,
        ...apiFilters,
      };
      
      const response = await apiClient.getUsers(params);
      
      if (response.success && response.data) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  // Handle user status change
  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const response = await apiClient.updateUserStatus(id, isActive);
      
      if (response.success) {
        toast({
          title: "Success",
          description: `User status updated to ${isActive ? 'active' : 'inactive'}`,
        });
        
        // Refresh user list
        loadUsers();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating user status",
        variant: "destructive",
      });
    }
  };
  
  // Initial data load and on filter/pagination changes
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filters]);
  
  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and their status.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all registered users on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <UserFilterForm 
              onFilterAction={handleFilter} 
              isLoading={isLoading} 
            />
            
            {/* Users Table */}
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : users.length > 0 ? (
              <UsersTable 
                users={users} 
                onStatusChange={handleStatusChange} 
              />
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No users found.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            )}
            
            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <div className="pt-4">
                <PaginationControls pagination={pagination} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}