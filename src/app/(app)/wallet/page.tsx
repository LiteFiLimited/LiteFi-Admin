"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CreditCard, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Eye,
  FileCheck,
  FileX
} from 'lucide-react';
import { DepositStatus, WithdrawalStatus, PaymentMethod } from '@/lib/types';
import { useToast } from '@/components/ui/toast-provider';

export default function WalletPage() {
  const { toast } = useToast();
  
  // Sample data - would normally come from API
  const [deposits] = useState([
    {
      id: 'deposit_123',
      reference: 'DEP-12345678',
      amount: 100000,
      status: DepositStatus.COMPLETED,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      channel: 'mono',
      createdAt: '2023-01-01T00:00:00Z',
      completedAt: '2023-01-01T00:05:00Z',
      user: {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }
    },
    {
      id: 'deposit_124',
      reference: 'DEP-12345679',
      amount: 250000,
      status: DepositStatus.PENDING,
      paymentMethod: PaymentMethod.CARD,
      channel: 'paystack',
      createdAt: '2023-01-02T10:30:00Z',
      user: {
        id: 'user_124',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      }
    },
    {
      id: 'deposit_125',
      reference: 'DEP-12345680',
      amount: 75000,
      status: DepositStatus.FAILED,
      paymentMethod: PaymentMethod.USSD,
      channel: 'gtbank',
      createdAt: '2023-01-03T14:20:00Z',
      user: {
        id: 'user_125',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com'
      }
    }
  ]);

  const [withdrawals] = useState([
    {
      id: 'withdrawal_123',
      reference: 'WTH-12345678',
      amount: 50000,
      status: WithdrawalStatus.PENDING,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      createdAt: '2023-01-01T12:00:00Z',
      user: {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }
    },
    {
      id: 'withdrawal_124',
      reference: 'WTH-12345679',
      amount: 125000,
      status: WithdrawalStatus.COMPLETED,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      createdAt: '2023-01-02T09:15:00Z',
      processedAt: '2023-01-02T14:30:00Z',
      notes: 'Approved via bank transfer',
      user: {
        id: 'user_124',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      }
    },
    {
      id: 'withdrawal_125',
      reference: 'WTH-12345680',
      amount: 200000,
      status: WithdrawalStatus.REJECTED,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      createdAt: '2023-01-03T11:45:00Z',
      processedAt: '2023-01-03T16:20:00Z',
      notes: 'Insufficient documentation',
      user: {
        id: 'user_125',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com'
      }
    }
  ]);

  const [paymentChannels] = useState([
    {
      id: 'channel_1',
      name: 'Mono',
      type: 'Bank Transfer',
      status: 'ACTIVE' as const,
      description: 'Direct bank account linking via Mono',
      supportedMethods: [PaymentMethod.BANK_TRANSFER, PaymentMethod.BANK_ACCOUNT]
    },
    {
      id: 'channel_2',
      name: 'Paystack',
      type: 'Card Payment',
      status: 'ACTIVE' as const,
      description: 'Credit/Debit card payments via Paystack',
      supportedMethods: [PaymentMethod.CARD]
    },
    {
      id: 'channel_3',
      name: 'USSD Gateway',
      type: 'USSD',
      status: 'MAINTENANCE' as const,
      description: 'USSD-based payments',
      supportedMethods: [PaymentMethod.USSD]
    }
  ]);

  // State for withdrawal processing modal
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [processingNotes, setProcessingNotes] = useState('');
  const [processingReference, setProcessingReference] = useState('');

  // Calculate wallet statistics
  const walletStats = {
    totalDeposits: deposits.reduce((sum, deposit) => sum + deposit.amount, 0),
    totalWithdrawals: withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0),
    pendingDeposits: deposits.filter(d => d.status === DepositStatus.PENDING).length,
    pendingWithdrawals: withdrawals.filter(w => w.status === WithdrawalStatus.PENDING).length,
    completedDeposits: deposits.filter(d => d.status === DepositStatus.COMPLETED).length,
    completedWithdrawals: withdrawals.filter(w => w.status === WithdrawalStatus.COMPLETED).length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDepositStatusBadge = (status: DepositStatus) => {
    switch (status) {
      case DepositStatus.COMPLETED:
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case DepositStatus.PENDING:
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case DepositStatus.FAILED:
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getWithdrawalStatusBadge = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.COMPLETED:
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case WithdrawalStatus.PENDING:
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case WithdrawalStatus.REJECTED:
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getChannelStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-red-500">Inactive</Badge>;
      case 'MAINTENANCE':
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleProcessWithdrawal = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setProcessingNotes('');
    setProcessingReference('');
    setIsProcessingModalOpen(true);
  };

  const processWithdrawal = async (approve: boolean) => {
    if (!selectedWithdrawal) return;

    try {
      // Here you would call the API to process the withdrawal
      console.log('Processing withdrawal:', {
        id: selectedWithdrawal.id,
        approve,
        notes: processingNotes,
        reference: processingReference
      });

      toast({
        title: `Withdrawal ${approve ? 'Approved' : 'Rejected'}`,
        message: `Withdrawal ${selectedWithdrawal.reference} has been ${approve ? 'approved' : 'rejected'}`,
        type: "success",
      });

      setIsProcessingModalOpen(false);
      setSelectedWithdrawal(null);
    } catch (error) {
      toast({
        title: "Error",
        message: "Failed to process withdrawal. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wallet Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ArrowDownToLine className="w-4 h-4 mr-2 text-green-600" />
              Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.totalDeposits)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {walletStats.completedDeposits} completed, {walletStats.pendingDeposits} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ArrowUpFromLine className="w-4 h-4 mr-2 text-red-600" />
              Total Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletStats.totalWithdrawals)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {walletStats.completedWithdrawals} completed, {walletStats.pendingWithdrawals} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-yellow-600" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletStats.pendingDeposits + walletStats.pendingWithdrawals}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Net Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletStats.totalDeposits - walletStats.totalWithdrawals)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Deposits minus withdrawals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="deposits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="channels">Payment Channels</TabsTrigger>
        </TabsList>

        {/* Deposits Tab */}
        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Transactions</CardTitle>
              <CardDescription>
                Monitor and manage customer deposits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search deposits..." className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell className="font-medium">{deposit.reference}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{deposit.user.firstName} {deposit.user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{deposit.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                      <TableCell>{deposit.paymentMethod.replace('_', ' ')}</TableCell>
                      <TableCell>{deposit.channel}</TableCell>
                      <TableCell>{getDepositStatusBadge(deposit.status)}</TableCell>
                      <TableCell>{formatDate(deposit.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>
                Review and process customer withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search withdrawals..." className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Processed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">{withdrawal.reference}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{withdrawal.user.firstName} {withdrawal.user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{withdrawal.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                      <TableCell>{withdrawal.paymentMethod.replace('_', ' ')}</TableCell>
                      <TableCell>{getWithdrawalStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                      <TableCell>
                        {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {withdrawal.status === WithdrawalStatus.PENDING && (
                            <Button
                              size="sm"
                              onClick={() => handleProcessWithdrawal(withdrawal)}
                            >
                              Process
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Channels Tab */}
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Channels</CardTitle>
              <CardDescription>
                Monitor payment channel status and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentChannels.map((channel) => (
                  <div key={channel.id} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-muted-foreground">{channel.type}</p>
                        </div>
                      </div>
                      {getChannelStatusBadge(channel.status)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Supported Methods:</p>
                      <div className="flex flex-wrap gap-2">
                        {channel.supportedMethods.map((method) => (
                          <Badge key={method} variant="outline">
                            {method.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Withdrawal Processing Modal */}
      <Dialog open={isProcessingModalOpen} onOpenChange={setIsProcessingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Withdrawal</DialogTitle>
            <DialogDescription>
              {selectedWithdrawal && (
                <>Review and process withdrawal request {selectedWithdrawal.reference}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-lg font-bold">{formatCurrency(selectedWithdrawal.amount)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <p>{selectedWithdrawal.user.firstName} {selectedWithdrawal.user.lastName}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Processing Notes</Label>
                <Input
                  id="notes"
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  placeholder="Enter processing notes..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="reference">Transfer Reference (for approval)</Label>
                <Input
                  id="reference"
                  value={processingReference}
                  onChange={(e) => setProcessingReference(e.target.value)}
                  placeholder="Enter transfer reference..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProcessingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => processWithdrawal(false)}
            >
              <FileX className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => processWithdrawal(true)}
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 