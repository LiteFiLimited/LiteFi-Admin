"use client";

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Pagination as PaginationType } from '@/lib/types';

interface PaginationControlsProps {
  pagination: PaginationType;
}

export function PaginationControls({ pagination }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const { page, pages, limit } = pagination;
  
  // Create a new URLSearchParams instance that we can modify
  const createQueryString = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    
    return newParams.toString();
  };
  
  const handlePageChange = (newPage: number) => {
    // Navigate to the new page
    router.push(`${pathname}?${createQueryString({ page: newPage.toString() })}`);
  };
  
  const handleLimitChange = (newLimit: number) => {
    // Navigate to the first page with the new limit
    router.push(`${pathname}?${createQueryString({ page: '1', limit: newLimit.toString() })}`);
  };
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, pagination.total)} of {pagination.total} entries
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <select
            className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-muted-foreground">Per page</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={page <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center mx-2">
            <span className="text-sm font-medium">
              Page {page} of {pages || 1}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pages)}
            disabled={page >= pages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
