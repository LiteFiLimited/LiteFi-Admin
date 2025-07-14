import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Skeleton className="h-9 w-32" />
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Profile Card Skeleton */}
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            {/* Avatar skeleton */}
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            {/* Name skeleton */}
            <Skeleton className="h-6 w-32 mb-2" />
            {/* Email skeleton */}
            <Skeleton className="h-4 w-40 mb-2" />
            {/* Role badge skeleton */}
            <Skeleton className="h-6 w-24 rounded-full" />
          </CardContent>
        </Card>
        
        {/* Main Content Skeleton */}
        <div>
          <Tabs defaultValue="personal" className="space-y-4">
            {/* Tabs skeleton */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <Skeleton className="h-8 w-32 mr-1" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            
            {/* Tab content skeleton */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Name fields skeleton */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    
                    {/* Email field skeleton */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    
                    {/* Role field skeleton */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    
                    {/* Status field skeleton */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    
                    {/* Dates skeleton */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    
                    {/* Save button skeleton */}
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
