"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Lock, AlertCircle, User, Edit } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import profileApi from '@/lib/profileApi';
import { AdminProfile } from '@/lib/types';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { useToast } from '@/components/ui/toast-provider';

// Loading fallback component
function ProfileLoading() {
  return <ProfileSkeleton />;
}

// Profile content component
function ProfileContent() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get tab from URL or default to personal
  const tab = searchParams.get('tab') || 'personal';
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    router.push(`/profile?tab=${value}`);
  };

  // Fetch admin profile
  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await profileApi.getProfile(user.id);

      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to fetch profile');
        toast({
          title: "Error",
          message: response.message || 'Failed to fetch profile',
          type: "error",
        });
      }
    } catch (err) {
      const errorMessage = 'Network error occurred while fetching profile';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
      toast({
        title: "Network Error",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  // Load profile on component mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchProfile();
    }
  }, [isAuthenticated, user?.id, fetchProfile]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return 'U';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle profile update (placeholder - would need backend endpoint)
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    
    setSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    setIsEditMode(false);
    setHasChanges(false);
    toast({
      title: "Profile Updated",
      message: "Profile information has been updated successfully.",
      type: "success",
    });
  };

  // Handle password change (placeholder - would need backend endpoint)
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    toast({
      title: "Password Changed",
      message: "Password has been changed successfully.",
      type: "success",
    });
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditMode(true);
    setHasChanges(false);
  };

  // Handle cancel (exit edit mode)
  const handleCancel = () => {
    setIsEditMode(false);
    setHasChanges(false);
  };

  // Handle form field changes
  const handleInputChange = () => {
    if (isEditMode) {
      setHasChanges(true);
    }
  };

  // Show loading skeleton
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Show error state
  if (error && !profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            View and manage your profile information
          </p>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
            <Button 
              onClick={fetchProfile} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayProfile = profile || user;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            View and manage your profile information
          </p>
        </div>
        {profile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            Last updated: {formatDate(profile.updatedAt)}
          </div>
        )}
      </div>
      
      {/* Profile Content */}
      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Profile Summary Card */}
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarFallback className="text-4xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {displayProfile?.firstName} {displayProfile?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{displayProfile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm bg-primary/10 px-3 py-1 rounded-full text-primary">
                {displayProfile?.role}
              </p>
              {profile?.active !== undefined && (
                <p className={`text-sm px-3 py-1 rounded-full ${
                  profile.active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {profile.active ? 'Active' : 'Inactive'}
                </p>
              )}
            </div>
            {profile && (
              <div className="text-center mt-4 space-y-1">
                <p className="text-xs text-muted-foreground">
                  Member since: {formatDate(profile.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Profile ID: {profile.id}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Profile Details */}
        <div className="space-y-6">
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        View and update your personal details
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isEditMode ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEdit}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          {hasChanges && (
                            <Button
                              size="sm"
                              type="submit"
                              form="profile-form"
                              disabled={saving}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form id="profile-form" onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          defaultValue={displayProfile?.firstName} 
                          required 
                          disabled={!isEditMode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          defaultValue={displayProfile?.lastName} 
                          required 
                          disabled={!isEditMode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={displayProfile?.email} 
                        required 
                        disabled={!isEditMode}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        defaultValue={displayProfile?.role} 
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Role cannot be changed from this interface
                      </p>
                    </div>

                    {profile && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="status">Account Status</Label>
                          <Input 
                            id="status" 
                            defaultValue={profile.active ? 'Active' : 'Inactive'} 
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-sm text-muted-foreground">
                            Account status is managed by system administrators
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="createdAt">Account Created</Label>
                            <Input 
                              id="createdAt" 
                              defaultValue={formatDate(profile.createdAt)} 
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="updatedAt">Last Modified</Label>
                            <Input 
                              id="updatedAt" 
                              defaultValue={formatDate(profile.updatedAt)} 
                              disabled
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      </>
                    )}
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
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
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

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
} 