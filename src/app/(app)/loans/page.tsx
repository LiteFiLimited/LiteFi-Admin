import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoanStatus } from '@/lib/types';

export default function LoansPage() {
  // Normally this data would come from an API
  const loans = [
    {
      id: 'L001',
      userId: 'user123',
      amount: 15000,
      productId: 'prod1',
      productName: 'Personal Loan',
      status: LoanStatus.ACTIVE,
      startDate: '2023-01-15T10:30:00Z',
      endDate: '2024-01-15T10:30:00Z',
      interestRate: 8.5,
      createdAt: '2023-01-10T08:15:00Z',
      updatedAt: '2023-01-15T10:30:00Z',
    },
    {
      id: 'L002',
      userId: 'user456',
      amount: 25000,
      productId: 'prod2',
      productName: 'Business Loan',
      status: LoanStatus.PENDING,
      startDate: null,
      endDate: null,
      interestRate: 9.2,
      createdAt: '2023-02-20T14:45:00Z',
      updatedAt: '2023-02-20T14:45:00Z',
    },
    {
      id: 'L003',
      userId: 'user789',
      amount: 50000,
      productId: 'prod3',
      productName: 'Home Improvement Loan',
      status: LoanStatus.APPROVED,
      startDate: '2023-03-05T09:15:00Z',
      endDate: '2025-03-05T09:15:00Z',
      interestRate: 7.8,
      createdAt: '2023-03-01T11:30:00Z',
      updatedAt: '2023-03-05T09:15:00Z',
    },
    {
      id: 'L004',
      userId: 'user101',
      amount: 10000,
      productId: 'prod1',
      productName: 'Personal Loan',
      status: LoanStatus.REPAID,
      startDate: '2022-04-10T13:20:00Z',
      endDate: '2023-04-10T13:20:00Z',
      interestRate: 8.5,
      createdAt: '2022-04-05T10:15:00Z',
      updatedAt: '2023-04-10T13:20:00Z',
    },
    {
      id: 'L005',
      userId: 'user202',
      amount: 30000,
      productId: 'prod2',
      productName: 'Business Loan',
      status: LoanStatus.DEFAULTED,
      startDate: '2022-05-15T16:40:00Z',
      endDate: '2023-05-15T16:40:00Z',
      interestRate: 9.2,
      createdAt: '2022-05-10T14:30:00Z',
      updatedAt: '2023-06-01T09:10:00Z',
    },
  ];

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get badge color based on status
  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return <Badge className="bg-green-500">Active</Badge>;
      case LoanStatus.PENDING:
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case LoanStatus.APPROVED:
        return <Badge className="bg-blue-500">Approved</Badge>;
      case LoanStatus.REPAID:
        return <Badge className="bg-gray-500">Repaid</Badge>;
      case LoanStatus.DEFAULTED:
        return <Badge className="bg-red-500">Defaulted</Badge>;
      case LoanStatus.REJECTED:
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate total loans amount
  const totalLoansAmount = loans.reduce((total, loan) => total + loan.amount, 0);
  
  // Calculate active loans amount
  const activeLoans = loans.filter(loan => loan.status === LoanStatus.ACTIVE);
  const activeLoansAmount = activeLoans.reduce((total, loan) => total + loan.amount, 0);

  // Count pending applications
  const pendingLoans = loans.filter(loan => loan.status === LoanStatus.PENDING || loan.status === LoanStatus.APPROVED).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Loans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLoansAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {loans.length} loans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(activeLoansAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeLoans.length} active loans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLoansAmount / loans.length)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per borrower
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
          <CardDescription>
            View and manage loan applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell>{loan.productName}</TableCell>
                  <TableCell>{formatCurrency(loan.amount)}</TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                  <TableCell>{formatDate(loan.startDate)}</TableCell>
                  <TableCell>{formatDate(loan.endDate)}</TableCell>
                  <TableCell>{getStatusBadge(loan.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 