"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Lock } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get tab from URL or default to personal
  const tab = searchParams.get('tab') || 'personal';
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    router.push(`/profile?tab=${value}`);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setSuccessMessage('Profile updated successfully');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setSuccessMessage('Password changed successfully');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarFallback className="text-4xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-sm bg-primary/10 px-3 py-1 rounded-full mt-2 text-primary">{user?.role}</p>
          </CardContent>
        </Card>
        
        <div>
          <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex w-max">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={user?.firstName} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={user?.lastName} required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email} required />
                    </div>
                    
                    {successMessage && (
                      <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
                        {successMessage}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" required />
                    </div>
                    
                    {successMessage && (
                      <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
                        {successMessage}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Changing...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 