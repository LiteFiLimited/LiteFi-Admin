import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[80px] mb-2" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[150px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-md border p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-3 w-[240px]" />
            </div>
            <Skeleton className="h-3 w-[60px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px] mb-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[80px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <RecentActivitySkeleton />
    </div>
  );
}

export function SystemHealthSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[150px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Database Status */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-[100px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-[60px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[90px]" />
              <Skeleton className="h-6 w-[40px]" />
            </div>
          </div>
        </div>

        {/* External Services */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-[140px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-6 w-[70px] rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[140px]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Server Metrics */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-[120px]" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-6 w-[60px]" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[180px] mb-2" />
        <Skeleton className="h-4 w-[280px]" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function FullDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-[150px]" />
      <StatsGridSkeleton />
      
      <div className="space-y-4">
        <div className="flex space-x-1 rounded-lg bg-muted p-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-[100px]" />
          ))}
        </div>
        <RecentActivitySkeleton />
      </div>
    </div>
  );
} 