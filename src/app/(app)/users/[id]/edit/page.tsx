"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserStatus } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import apiClient from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define form validation schema
const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  status: z.enum([UserStatus.ACTIVE, UserStatus.PENDING, UserStatus.SUSPENDED, UserStatus.BLOCKED]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params.id as string;
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Setup form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: UserStatus.ACTIVE,
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSaving(true);
      const response = await apiClient.updateUser(userId, values);
      
      if (response.success) {
        toast({
          title: "Success",
          message: "User information updated successfully",
          type: "success",
        });
        
        // Navigate back to user details
        router.push(`/users/${userId}`);
      } else {
        toast({
          title: "Error",
          message: response.error || "Failed to update user",
          type: "error",
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        message: "An unexpected error occurred while updating user",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    // Load user data
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getUserById(userId);
        
        if (response.success && response.data) {
          const user = response.data.user;
          form.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            status: user.status,
          });
        } else {
          toast({
            title: "Error",
            message: response.error || "Failed to load user details",
            type: "error",
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        toast({
          title: "Error",
          message: "An unexpected error occurred while loading user details",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, [userId, form, toast]);
  
  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/users/${userId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User
        </Button>
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
      <p className="text-muted-foreground">Update user account information</p>
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Edit user profile details below</CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                            <SelectItem value={UserStatus.PENDING}>Pending</SelectItem>
                            <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                            <SelectItem value={UserStatus.BLOCKED}>Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This determines the user&apos;s access to the platform.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <div className="flex justify-end gap-4 w-full">
                <Button 
                  variant="outline"
                  type="button"
                  onClick={() => router.push(`/users/${userId}`)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
