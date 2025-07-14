"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { UserRole } from '@/lib/types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, X } from 'lucide-react';

const formSchema = z.object({
  search: z.string().optional(),
  role: z.string().refine((val) => val === 'all' || Object.values(UserRole).includes(val as UserRole), {
    message: 'Invalid role value',
  }).optional(),
  verified: z.string().refine((val) => ['all', 'true', 'false'].includes(val), {
    message: 'Invalid verification value',
  }).optional(),
  isActive: z.string().refine((val) => ['all', 'true', 'false'].includes(val), {
    message: 'Invalid active status value',
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFilterFormProps {
  isLoading?: boolean;
  onFilterAction: (filters: {
    search?: string;
    role?: string;
    verified?: string;
    isActive?: string;
  }) => void;
}

export function UserFilterForm({ isLoading, onFilterAction }: UserFilterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstLoad, setFirstLoad] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize form with empty defaults to prevent hydration issues
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
      role: 'all',
      verified: 'all',
      isActive: 'all',
    },
  });

  // Handle mounting and search params
  useEffect(() => {
    setMounted(true);
    
    // Once mounted, set form values from URL
    if (mounted) {
      const search = searchParams.get('search') || '';
      const role = searchParams.get('role') || 'all';
      const verified = searchParams.get('verified') || 'all';
      const isActive = searchParams.get('isActive') || 'all';
      
      form.reset({
        search,
        role,
        verified,
        isActive,
      });
    }
  }, [mounted, searchParams, form]);

  // Apply filters from URL on first load
  useEffect(() => {
    if (mounted && firstLoad) {
      const filters = {
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        verified: searchParams.get('verified') || undefined,
      };
      
      // Filter out undefined values
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined)
      );
      
      if (Object.keys(validFilters).length > 0) {
        onFilterAction(validFilters);
      }
      setFirstLoad(false);
    }
  }, [mounted, searchParams, onFilterAction, firstLoad]);

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Filter out empty values and 'all' values
    const filters = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== 'all' && v !== undefined)
    );
    
    // Update URL with filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value);
    });
    
    const url = `/users${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
    
    // Apply filters
    onFilterAction(filters);
  };

  // Clear all filters
  const clearFilters = () => {
    form.reset({
      search: '',
      role: 'all',
      verified: 'all',
      isActive: 'all',
    });
    router.push('/users');
    onFilterAction({});
  };

  // Don't render form inputs until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              className="flex h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Search by name, email or phone"
              disabled
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <div className="h-10 w-[180px] rounded-md border border-input bg-background" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Verification</label>
          <div className="h-10 w-[180px] rounded-md border border-input bg-background" />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="outline" disabled>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button type="submit" disabled>
            Apply Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email or phone"
                    className="pl-8 w-[250px]"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="verified"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 ml-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={clearFilters}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}
