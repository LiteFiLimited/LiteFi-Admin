"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { UserStatus } from '@/lib/types';

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
  status: z.string().refine((val) => val === 'all' || Object.values(UserStatus).includes(val as UserStatus), {
    message: 'Invalid status value',
  }).optional(),
  verified: z.string().refine((val) => ['all', 'true', 'false'].includes(val), {
    message: 'Invalid verification value',
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFilterFormProps {
  isLoading?: boolean;
  onFilterAction: (filters: {
    search?: string;
    status?: string;
    verified?: string;
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
      status: 'all',
      verified: 'all',
    },
  });

  // Handle mounting and search params
  useEffect(() => {
    setMounted(true);
    
    // Once mounted, set form values from URL
    if (mounted) {
      const search = searchParams.get('search') || '';
      const status = searchParams.get('status') || 'all';
      const verified = searchParams.get('verified') || 'all';
      
      form.reset({
        search,
        status,
        verified,
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
      status: 'all',
      verified: 'all',
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={UserStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                  <SelectItem value={UserStatus.BLOCKED}>Blocked</SelectItem>
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
