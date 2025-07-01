'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoanStatus, LoanType, Loan, Pagination } from '@/lib/types';
import loanApi from '@/lib/loanApi';
import { LoansSkeleton } from '@/components/loans/LoansSkeleton';
import { useToast } from '@/components/ui/toast-provider';

interface LoansStats {
  totalLoans: number;
  activeLoans: number;
  pendingLoans: number;
  totalAmount: number;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [stats, setStats] = useState<LoansStats>({
    totalLoans: 0,
    activeLoans: 0,
    pendingLoans: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<LoanType | ''>('');
  const { toast } = useToast();

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { type: typeFilter }),
      };
      
      const response = await loanApi.getLoans(params);

      if (response.success && response.data) {
        setLoans(response.data.loans || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        });
        
        const loansList = response.data.loans || [];
        const totalAmount = loansList.reduce((sum, loan) => sum + loan.amount, 0);
        const activeLoans = loansList.filter(loan => loan.status === LoanStatus.ACTIVE).length;
        const pendingLoans = loansList.filter(loan => loan.status === LoanStatus.PENDING).length;

        setStats({
          totalLoans: loansList.length,
          activeLoans,
          pendingLoans,
          totalAmount,
        });
      } else {
        toast({
          title: "Error",
          message: response.error || "Failed to fetch loans",
          type: "error",
        });
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast({
        title: "Error",
        message: "An unexpected error occurred while fetching loans",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, typeFilter, toast]);

  useEffect(() => {
    fetchLoans();
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, typeFilter, fetchLoans]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLoans();
  };

  const getStatusBadgeVariant = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return 'default';
      case LoanStatus.PENDING:
        return 'secondary';
      case LoanStatus.APPROVED:
        return 'default';
      case LoanStatus.COMPLETED:
        return 'default';
      case LoanStatus.REJECTED:
        return 'destructive';
      case LoanStatus.DEFAULTED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoansSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">
            Manage and monitor all loan applications
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLoans}</div>
            <p className="text-xs text-muted-foreground">Total applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLoans}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">Total loan value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by reference, user name, or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter || "ALL"} onValueChange={(value: string) => setStatusFilter(value === "ALL" ? "" : value as LoanStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value={LoanStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={LoanStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={LoanStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={LoanStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={LoanStatus.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={LoanStatus.DEFAULTED}>Defaulted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter || "ALL"} onValueChange={(value: string) => setTypeFilter(value === "ALL" ? "" : value as LoanType)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value={LoanType.SALARY}>Salary</SelectItem>
                  <SelectItem value={LoanType.WORKING_CAPITAL}>Working Capital</SelectItem>
                  <SelectItem value={LoanType.AUTO}>Auto</SelectItem>
                  <SelectItem value={LoanType.TRAVEL}>Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button onClick={handleSearch} className="w-full">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Loans</CardTitle>
              <CardDescription>View and manage all loan applications</CardDescription>
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No loans found
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.reference}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {loan.user.firstName} {loan.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {loan.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{loan.type}</TableCell>
                    <TableCell>{formatCurrency(loan.amount)}</TableCell>
                    <TableCell>{loan.interestRate}%</TableCell>
                    <TableCell>{loan.duration} months</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(loan.status)}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(loan.createdAt)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/loans/${loan.id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
