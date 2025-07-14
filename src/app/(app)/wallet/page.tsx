"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, AlertCircle } from 'lucide-react';
import walletApi from '@/lib/walletApi';
import { Deposit, Withdrawal, PaymentChannel, DepositStatus, WithdrawalStatus } from '@/lib/types';
import { WalletSkeleton } from '@/components/wallet/WalletSkeleton';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('deposits');
  
  // Deposits state
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [depositsPagination, setDepositsPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [depositsLoading, setDepositsLoading] = useState(true);
  
  // Withdrawals state
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawalsPagination, setWithdrawalsPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);
  
  // Payment channels state
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  
  // Filter states
  const [depositSearchQuery, setDepositSearchQuery] = useState('');
  const [depositStatusFilter, setDepositStatusFilter] = useState<string>('ALL');
  const [withdrawalSearchQuery, setWithdrawalSearchQuery] = useState('');
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState<string>('ALL');
  
  // Process withdrawal modal state
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [processNotes, setProcessNotes] = useState('');
  
  const [error, setError] = useState<string | null>(null);

  // Fetch deposits
  const fetchDeposits = useCallback(async () => {
    try {
      setDepositsLoading(true);
      setError(null);

      const params: {
        page: number;
        limit: number;
        search?: string;
        status?: DepositStatus;
      } = {
        page: depositsPagination.page,
        limit: depositsPagination.limit,
      };

      if (depositSearchQuery.trim()) {
        params.search = depositSearchQuery.trim();
      }

      if (depositStatusFilter !== 'ALL' && depositStatusFilter) {
        params.status = depositStatusFilter as DepositStatus;
      }

      const response = await walletApi.getDeposits(params);

      if (response.success && response.data) {
        setDeposits(response.data.deposits || []);
        setDepositsPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        });
      } else {
        setError(response.error || 'Failed to fetch deposits');
        setDeposits([]);
        setDepositsPagination({ total: 0, page: 1, limit: 10, pages: 0 });
      }
    } catch (err) {
      setError('Network error occurred while fetching deposits');
      console.error('Error fetching deposits:', err);
      setDeposits([]);
      setDepositsPagination({ total: 0, page: 1, limit: 10, pages: 0 });
    } finally {
      setDepositsLoading(false);
    }
  }, [depositsPagination.page, depositsPagination.limit, depositSearchQuery, depositStatusFilter]);

  // Fetch withdrawals
  const fetchWithdrawals = useCallback(async () => {
    try {
      setWithdrawalsLoading(true);
      setError(null);

      const params: {
        page: number;
        limit: number;
        search?: string;
        status?: WithdrawalStatus;
      } = {
        page: withdrawalsPagination.page,
        limit: withdrawalsPagination.limit,
      };

      if (withdrawalSearchQuery.trim()) {
        params.search = withdrawalSearchQuery.trim();
      }

      if (withdrawalStatusFilter !== 'ALL' && withdrawalStatusFilter) {
        params.status = withdrawalStatusFilter as WithdrawalStatus;
      }

      const response = await walletApi.getWithdrawals(params);

      if (response.success && response.data) {
        setWithdrawals(response.data.withdrawals || []);
        setWithdrawalsPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        });
      } else {
        setError(response.error || 'Failed to fetch withdrawals');
        setWithdrawals([]);
        setWithdrawalsPagination({ total: 0, page: 1, limit: 10, pages: 0 });
      }
    } catch (err) {
      setError('Network error occurred while fetching withdrawals');
      console.error('Error fetching withdrawals:', err);
      setWithdrawals([]);
      setWithdrawalsPagination({ total: 0, page: 1, limit: 10, pages: 0 });
    } finally {
      setWithdrawalsLoading(false);
    }
  }, [withdrawalsPagination.page, withdrawalsPagination.limit, withdrawalSearchQuery, withdrawalStatusFilter]);

  // Fetch payment channels
  const fetchPaymentChannels = useCallback(async () => {
    try {
      setChannelsLoading(true);
      setError(null);

      const response = await walletApi.getPaymentChannels();

      if (response.success && response.data) {
        setPaymentChannels(response.data.paymentChannels || []);
      } else {
        setError(response.error || 'Failed to fetch payment channels');
        setPaymentChannels([]);
      }
    } catch (err) {
      setError('Network error occurred while fetching payment channels');
      console.error('Error fetching payment channels:', err);
      setPaymentChannels([]);
    } finally {
      setChannelsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchPaymentChannels();
  }, [fetchPaymentChannels]);

  // Load deposits when deposits tab is active or filters change
  useEffect(() => {
    if (activeTab === 'deposits') {
      fetchDeposits();
    }
  }, [activeTab, fetchDeposits]);

  // Load withdrawals when withdrawals tab is active or filters change
  useEffect(() => {
    if (activeTab === 'withdrawals') {
      fetchWithdrawals();
    }
  }, [activeTab, fetchWithdrawals]);

  // Handle deposit filter changes
  const handleDepositSearch = (query: string) => {
    setDepositSearchQuery(query);
    setDepositsPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDepositStatusFilter = (status: string) => {
    setDepositStatusFilter(status);
    setDepositsPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle withdrawal filter changes
  const handleWithdrawalSearch = (query: string) => {
    setWithdrawalSearchQuery(query);
    setWithdrawalsPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleWithdrawalStatusFilter = (status: string) => {
    setWithdrawalStatusFilter(status);
    setWithdrawalsPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handleDepositPageChange = (newPage: number) => {
    setDepositsPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleWithdrawalPageChange = (newPage: number) => {
    setWithdrawalsPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle process withdrawal
  const handleProcessWithdrawal = async (approve: boolean) => {
    if (!selectedWithdrawal) return;

    try {
      setProcessingWithdrawal(true);
      setError(null);

      const response = await walletApi.processWithdrawal(selectedWithdrawal.id, {
        approve,
        notes: processNotes.trim() || undefined,
      });

      if (response.success) {
        // Refresh withdrawals list
        await fetchWithdrawals();
        // Close modal
        setProcessModalOpen(false);
        setSelectedWithdrawal(null);
        setProcessNotes('');
      } else {
        setError(response.error || 'Failed to process withdrawal');
      }
    } catch (err) {
      setError('Network error occurred while processing withdrawal');
      console.error('Error processing withdrawal:', err);
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge variant
  const getDepositStatusVariant = (status: DepositStatus) => {
    switch (status) {
      case DepositStatus.COMPLETED:
        return 'default';
      case DepositStatus.PENDING:
        return 'secondary';
      case DepositStatus.FAILED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getWithdrawalStatusVariant = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.COMPLETED:
        return 'default';
      case WithdrawalStatus.PENDING:
        return 'secondary';
      case WithdrawalStatus.REJECTED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (channelsLoading && depositsLoading && withdrawalsLoading) {
    return <WalletSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
        <p className="text-muted-foreground">
          Monitor deposits, withdrawals, and payment channels
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="channels">Payment Channels</TabsTrigger>
        </TabsList>

        {/* Deposits Tab */}
        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposits</CardTitle>
              <CardDescription>
                Manage user deposit transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Deposits Filters */}
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by reference or user..."
                      value={depositSearchQuery}
                      onChange={(e) => handleDepositSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={depositStatusFilter} onValueChange={handleDepositStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deposits Table */}
              {depositsLoading ? (
                <WalletSkeleton />
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deposits.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              No deposits found
                            </TableCell>
                          </TableRow>
                        ) : (
                          deposits.map((deposit) => (
                            <TableRow key={deposit.id}>
                              <TableCell className="font-medium">
                                {deposit.reference}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {deposit.user.firstName} {deposit.user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {deposit.user.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                              <TableCell>
                                <Badge variant={getDepositStatusVariant(deposit.status)}>
                                  {deposit.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{deposit.paymentMethod}</div>
                                  {deposit.paymentChannel && (
                                    <div className="text-sm text-muted-foreground">
                                      via {deposit.paymentChannel}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {formatDate(deposit.createdAt)}
                                  </div>
                                  {deposit.completedAt && (
                                    <div className="text-sm text-muted-foreground">
                                      Completed: {formatDate(deposit.completedAt)}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Deposits Pagination */}
                  {depositsPagination.pages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {(depositsPagination.page - 1) * depositsPagination.limit + 1} to{' '}
                        {Math.min(depositsPagination.page * depositsPagination.limit, depositsPagination.total)} of{' '}
                        {depositsPagination.total} deposits
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDepositPageChange(depositsPagination.page - 1)}
                          disabled={depositsPagination.page <= 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {depositsPagination.page} of {depositsPagination.pages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDepositPageChange(depositsPagination.page + 1)}
                          disabled={depositsPagination.page >= depositsPagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>
                Review and process user withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Withdrawals Filters */}
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by reference or user..."
                      value={withdrawalSearchQuery}
                      onChange={(e) => handleWithdrawalSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={withdrawalStatusFilter} onValueChange={handleWithdrawalStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Withdrawals Table */}
              {withdrawalsLoading ? (
                <WalletSkeleton />
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {withdrawals.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              No withdrawal requests found
                            </TableCell>
                          </TableRow>
                        ) : (
                          withdrawals.map((withdrawal) => (
                            <TableRow key={withdrawal.id}>
                              <TableCell className="font-medium">
                                {withdrawal.reference}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {withdrawal.user.firstName} {withdrawal.user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {withdrawal.user.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                              <TableCell>
                                <Badge variant={getWithdrawalStatusVariant(withdrawal.status)}>
                                  {withdrawal.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {formatDate(withdrawal.createdAt)}
                                  </div>
                                  {withdrawal.processedAt && (
                                    <div className="text-sm text-muted-foreground">
                                      Processed: {formatDate(withdrawal.processedAt)}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {withdrawal.status === WithdrawalStatus.PENDING ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedWithdrawal(withdrawal);
                                      setProcessModalOpen(true);
                                    }}
                                  >
                                    Process
                                  </Button>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    {withdrawal.status === WithdrawalStatus.COMPLETED ? 'Completed' : 'Rejected'}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Withdrawals Pagination */}
                  {withdrawalsPagination.pages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {(withdrawalsPagination.page - 1) * withdrawalsPagination.limit + 1} to{' '}
                        {Math.min(withdrawalsPagination.page * withdrawalsPagination.limit, withdrawalsPagination.total)} of{' '}
                        {withdrawalsPagination.total} withdrawals
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdrawalPageChange(withdrawalsPagination.page - 1)}
                          disabled={withdrawalsPagination.page <= 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {withdrawalsPagination.page} of {withdrawalsPagination.pages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdrawalPageChange(withdrawalsPagination.page + 1)}
                          disabled={withdrawalsPagination.page >= withdrawalsPagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Channels Tab */}
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Channels</CardTitle>
              <CardDescription>
                Available payment channels and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {channelsLoading ? (
                <WalletSkeleton />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paymentChannels.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No payment channels available</p>
                    </div>
                  ) : (
                    paymentChannels.map((channel) => (
                      <Card key={channel.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{channel.name}</CardTitle>
                            <Badge 
                              variant={channel.active ? 'default' : 'destructive'}
                            >
                              {channel.active ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {channel.description}
                            </p>
                            <div className="text-sm">
                              <strong>Type:</strong> {channel.type}
                            </div>
                            <div className="text-sm">
                              <strong>Processing Time:</strong> {channel.processingTime}
                            </div>
                            <div className="text-sm">
                              <strong>Limits:</strong> {formatCurrency(channel.minimumAmount)} - {formatCurrency(channel.maximumAmount)}
                            </div>
                            {channel.provider && (
                              <div className="text-sm">
                                <strong>Provider:</strong> {channel.provider}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Process Withdrawal Modal */}
      <Dialog open={processModalOpen} onOpenChange={setProcessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Withdrawal Request</DialogTitle>
            <DialogDescription>
              Review and approve or reject this withdrawal request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Reference:</strong>
                  <p>{selectedWithdrawal.reference}</p>
                </div>
                <div>
                  <strong>Amount:</strong>
                  <p>{formatCurrency(selectedWithdrawal.amount)}</p>
                </div>
                <div>
                  <strong>User:</strong>
                  <p>{selectedWithdrawal.user.firstName} {selectedWithdrawal.user.lastName}</p>
                  <p className="text-muted-foreground">{selectedWithdrawal.user.email}</p>
                </div>
                <div>
                  <strong>Date:</strong>
                  <p>{formatDate(selectedWithdrawal.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  placeholder="Add any processing notes..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setProcessModalOpen(false);
                setSelectedWithdrawal(null);
                setProcessNotes('');
              }}
              disabled={processingWithdrawal}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleProcessWithdrawal(false)}
              disabled={processingWithdrawal}
            >
              {processingWithdrawal ? 'Processing...' : 'Reject'}
            </Button>
            <Button
              onClick={() => handleProcessWithdrawal(true)}
              disabled={processingWithdrawal}
            >
              {processingWithdrawal ? 'Processing...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
