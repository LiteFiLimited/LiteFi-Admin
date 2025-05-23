import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { InvestmentStatus } from '@/lib/types';

export default function InvestmentsPage() {
  // Normally this data would come from an API
  const investments = [
    {
      id: '1',
      userId: 'user123',
      amount: 5000,
      planId: 'plan1',
      planName: 'Growth Fund',
      status: InvestmentStatus.ACTIVE,
      startDate: '2023-01-15T10:30:00Z',
      endDate: '2024-01-15T10:30:00Z',
      interestRate: 5.2,
      createdAt: '2023-01-10T08:15:00Z',
      updatedAt: '2023-01-15T10:30:00Z',
    },
    {
      id: '2',
      userId: 'user456',
      amount: 10000,
      planId: 'plan2',
      planName: 'Income Fund',
      status: InvestmentStatus.PENDING,
      startDate: null,
      endDate: null,
      interestRate: 4.8,
      createdAt: '2023-02-20T14:45:00Z',
      updatedAt: '2023-02-20T14:45:00Z',
    },
    {
      id: '3',
      userId: 'user789',
      amount: 25000,
      planId: 'plan3',
      planName: 'Balanced Fund',
      status: InvestmentStatus.APPROVED,
      startDate: '2023-03-05T09:15:00Z',
      endDate: '2024-03-05T09:15:00Z',
      interestRate: 6.1,
      createdAt: '2023-03-01T11:30:00Z',
      updatedAt: '2023-03-05T09:15:00Z',
    },
    {
      id: '4',
      userId: 'user101',
      amount: 15000,
      planId: 'plan1',
      planName: 'Growth Fund',
      status: InvestmentStatus.COMPLETED,
      startDate: '2022-04-10T13:20:00Z',
      endDate: '2023-04-10T13:20:00Z',
      interestRate: 5.2,
      createdAt: '2022-04-05T10:15:00Z',
      updatedAt: '2023-04-10T13:20:00Z',
    },
    {
      id: '5',
      userId: 'user202',
      amount: 7500,
      planId: 'plan2',
      planName: 'Income Fund',
      status: InvestmentStatus.REJECTED,
      startDate: null,
      endDate: null,
      interestRate: 4.8,
      createdAt: '2023-05-15T16:40:00Z',
      updatedAt: '2023-05-16T09:10:00Z',
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
  const getStatusBadge = (status: InvestmentStatus) => {
    switch (status) {
      case InvestmentStatus.ACTIVE:
        return <Badge className="bg-green-500">Active</Badge>;
      case InvestmentStatus.PENDING:
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case InvestmentStatus.APPROVED:
        return <Badge className="bg-blue-500">Approved</Badge>;
      case InvestmentStatus.COMPLETED:
        return <Badge className="bg-gray-500">Completed</Badge>;
      case InvestmentStatus.REJECTED:
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Investments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(62500)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {investments.length} investments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(30000)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 active investments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(12500)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per investor
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Investment Management</CardTitle>
          <CardDescription>
            View and manage investment applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell className="font-medium">{investment.id}</TableCell>
                  <TableCell>{investment.planName}</TableCell>
                  <TableCell>{formatCurrency(investment.amount)}</TableCell>
                  <TableCell>{investment.interestRate}%</TableCell>
                  <TableCell>{formatDate(investment.startDate)}</TableCell>
                  <TableCell>{formatDate(investment.endDate)}</TableCell>
                  <TableCell>{getStatusBadge(investment.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 