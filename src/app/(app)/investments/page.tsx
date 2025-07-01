"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Eye, MoreHorizontal, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import investmentApi from '@/lib/investmentApi';
import { Investment, InvestmentStatus, InvestmentPlanType } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function InvestmentsPage() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestmentStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<InvestmentPlanType | ''>('');

  // Stats
  const [stats, setStats] = useState({
    totalAmount: 0,
    activeAmount: 0,
    pendingCount: 0,
    averageAmount: 0,
  });

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { type: typeFilter }),
      };

      const response = await investmentApi.getInvestments(params);

      if (response.success && response.data) {
        setInvestments(response.data.investments || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        });
        
        // Calculate stats from the response data
        const investmentsList = response.data.investments || [];
        const totalAmount = investmentsList.reduce((sum, inv) => sum + inv.amount, 0);
        const activeAmount = investmentsList
          .filter(inv => inv.status === InvestmentStatus.ACTIVE)
          .reduce((sum, inv) => sum + inv.amount, 0);
        const pendingCount = investmentsList.filter(inv => inv.status === InvestmentStatus.PENDING).length;
        const averageAmount = investmentsList.length > 0 ? totalAmount / investmentsList.length : 0;

        setStats({
          totalAmount,
          activeAmount,
          pendingCount,
          averageAmount,
        });
      } else {
        setError(response.error || 'Failed to fetch investments');
        // Set empty state on error
        setInvestments([]);
        setPagination({ total: 0, page: 1, limit: 10, pages: 0 });
        setStats({ totalAmount: 0, activeAmount: 0, pendingCount: 0, averageAmount: 0 });
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching investments:', err);
      // Set empty state on network error
      setInvestments([]);
      setPagination({ total: 0, page: 1, limit: 10, pages: 0 });
      setStats({ totalAmount: 0, activeAmount: 0, pendingCount: 0, averageAmount: 0 });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, typeFilter]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchInvestments();
  };

  const handleFilterChange = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchInvestments();
  };

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: InvestmentStatus) => {
    const statusConfig = {
      [InvestmentStatus.ACTIVE]: { variant: 'default', color: 'bg-green-500 hover:bg-green-600', label: 'Active' },
      [InvestmentStatus.PENDING]: { variant: 'secondary', color: 'bg-yellow-500 hover:bg-yellow-600', label: 'Pending' },
      [InvestmentStatus.APPROVED]: { variant: 'outline', color: 'bg-blue-500 hover:bg-blue-600', label: 'Approved' },
      [InvestmentStatus.MATURED]: { variant: 'default', color: 'bg-purple-500 hover:bg-purple-600', label: 'Matured' },
      [InvestmentStatus.WITHDRAWN]: { variant: 'secondary', color: 'bg-gray-500 hover:bg-gray-600', label: 'Withdrawn' },
      [InvestmentStatus.CANCELLED]: { variant: 'destructive', color: 'bg-red-500 hover:bg-red-600', label: 'Cancelled' },
      [InvestmentStatus.COMPLETED]: { variant: 'outline', color: 'bg-gray-600 hover:bg-gray-700', label: 'Completed' },
      [InvestmentStatus.REJECTED]: { variant: 'destructive', color: 'bg-red-600 hover:bg-red-700', label: 'Rejected' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getTypeColor = (type: InvestmentPlanType) => {
    switch (type) {
      case InvestmentPlanType.NAIRA:
        return 'text-green-600 bg-green-50';
      case InvestmentPlanType.FOREIGN:
        return 'text-blue-600 bg-blue-50';
      case InvestmentPlanType.EQUITY:
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleViewInvestment = (id: string) => {
    router.push(`/investments/${id}`);
  };

  const StatsCard = ({ title, value, description, icon: Icon, isLoading }: {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    isLoading: boolean;
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
    </TableRow>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Investment Management</h1>
        <Button onClick={() => router.push('/investments/plans')}>
          Manage Plans
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Investments"
          value={formatCurrency(stats.totalAmount)}
          description={`Across ${investments.length} investments`}
          icon={DollarSign}
          isLoading={loading}
        />
        <StatsCard
          title="Active Investments"
          value={formatCurrency(stats.activeAmount)}
          description="Currently earning returns"
          icon={TrendingUp}
          isLoading={loading}
        />
        <StatsCard
          title="Pending Approval"
          value={stats.pendingCount.toString()}
          description="Awaiting review"
          icon={Clock}
          isLoading={loading}
        />
        <StatsCard
          title="Average Investment"
          value={formatCurrency(stats.averageAmount)}
          description="Per investor"
          icon={CheckCircle}
          isLoading={loading}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reference, name, or user email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <Select value={statusFilter || "all"} onValueChange={(value) => {
              setStatusFilter(value === "all" ? '' : value as InvestmentStatus);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={InvestmentStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={InvestmentStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={InvestmentStatus.MATURED}>Matured</SelectItem>
                <SelectItem value={InvestmentStatus.WITHDRAWN}>Withdrawn</SelectItem>
                <SelectItem value={InvestmentStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter || "all"} onValueChange={(value) => {
              setTypeFilter(value === "all" ? '' : value as InvestmentPlanType);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={InvestmentPlanType.NAIRA}>Naira</SelectItem>
                <SelectItem value={InvestmentPlanType.FOREIGN}>Foreign</SelectItem>
                <SelectItem value={InvestmentPlanType.EQUITY}>Equity</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="px-8">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">
              <p className="font-medium">Error loading investments</p>
              <p className="text-sm mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchInvestments}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Investments</CardTitle>
          <CardDescription>
            View and manage all investment applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Investor</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Maturity Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Show skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : investments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No investments found
                  </TableCell>
                </TableRow>
              ) : (
                investments.map((investment) => (
                  <TableRow key={investment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{investment.reference}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {investment.user.firstName} {investment.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {investment.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(investment.planType)}>
                        {investment.planType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(investment.amount, investment.currency)}
                    </TableCell>
                    <TableCell>{investment.interestRate}%</TableCell>
                    <TableCell>{formatDate(investment.maturityDate)}</TableCell>
                    <TableCell>{getStatusBadge(investment.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewInvestment(investment.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!loading && investments.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} investments
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 