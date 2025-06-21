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
  status: z.string().optional(),
  verified: z.string().optional(),
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

  // Initialize form with URL query params
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      verified: searchParams.get('verified') || '',
    },
  });

  // Apply filters from URL on first load
  useEffect(() => {
    if (firstLoad) {
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
  }, [searchParams, onFilterAction, firstLoad]);

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Filter out empty values
    const filters = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined)
    );
    
    // Update URL with filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
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
      status: '',
      verified: '',
    });
    router.push('/users');
    onFilterAction({});
  };

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
                  <SelectItem value="">All Statuses</SelectItem>
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
                  <SelectItem value="">All Users</SelectItem>
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
