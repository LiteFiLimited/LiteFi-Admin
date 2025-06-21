"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onStatusChange?: (id: string, isActive: boolean) => Promise<void>;
}

export function UsersTable({ users, onStatusChange }: UsersTableProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  // Handle status change
  const handleStatusChange = async (id: string, isActive: boolean) => {
    if (!onStatusChange) return;
    
    try {
      setProcessing(id);
      await onStatusChange(id, isActive);
    } catch (error) {
      console.error('Error changing user status:', error);
    } finally {
      setProcessing(null);
    }
  };

  // View user details
  const viewUserDetails = (id: string) => {
    router.push(`/users/${id}`);
  };

  // Edit user
  const editUser = (id: string) => {
    router.push(`/users/${id}/edit`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>
              <Badge
                variant={
                  user.status === UserStatus.ACTIVE
                    ? 'default'
                    : user.status === UserStatus.PENDING
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              {user.isVerified ? (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  Unverified
                </Badge>
              )}
            </TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => viewUserDetails(user.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editUser(user.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.status === UserStatus.ACTIVE ? (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, false)}
                      disabled={processing === user.id}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Deactivate User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, true)}
                      disabled={processing === user.id}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Activate User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
