"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Server,
  UserPlus,
  ArrowLeftCircle
} from 'lucide-react';
import { dashboardApiClient } from '@/lib/dashboardApi';
import type { 
  DashboardSummaryData, 
  InvestmentStatisticsData, 
  LoanStatisticsData, 
  SystemHealthData,
  RecentActivityData
} from '@/lib/dashboardApi';
import { 
  StatsGridSkeleton, 
  RecentActivitySkeleton, 
  FullDashboardSkeleton
} from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  // State for dashboard data
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummaryData | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivityData[] | null>(null);
  const [loanStats, setLoanStats] = useState<LoanStatisticsData | null>(null);
  const [investmentStats, setInvestmentStats] = useState<InvestmentStatisticsData | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealthData | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [loansLoading, setLoansLoading] = useState(true);
  const [investmentsLoading, setInvestmentsLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(true);

  // Fetch dashboard summary
  const fetchDashboardSummary = async () => {
    try {
      setSummaryLoading(true);
      const response = await dashboardApiClient.getDashboardSummary();
      if (response.success && response.data) {
        setDashboardSummary(response.data);
      } else {
        console.error('Failed to fetch dashboard summary:', response.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await dashboardApiClient.getRecentActivities();
      if (response.success && response.data) {
        setRecentActivities(response.data);
      } else {
        console.error('Failed to fetch activities:', response.error);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fetch loan statistics
  const fetchLoanStats = async () => {
    try {
      setLoansLoading(true);
      const response = await dashboardApiClient.getLoanStatistics();
      if (response.success && response.data) {
        setLoanStats(response.data);
      } else {
        console.error('Failed to fetch loan stats:', response.error);
      }
    } catch (error) {
      console.error('Error fetching loan stats:', error);
    } finally {
      setLoansLoading(false);
    }
  };

  // Fetch investment statistics
  const fetchInvestmentStats = async () => {
    try {
      setInvestmentsLoading(true);
      const response = await dashboardApiClient.getInvestmentStatistics();
      if (response.success && response.data) {
        setInvestmentStats(response.data);
      } else {
        console.error('Failed to fetch investment stats:', response.error);
      }
    } catch (error) {
      console.error('Error fetching investment stats:', error);
    } finally {
      setInvestmentsLoading(false);
    }
  };

  // Fetch system health
  const fetchSystemHealth = async () => {
    try {
      setHealthLoading(true);
      const response = await dashboardApiClient.getSystemHealth();
      if (response.success && response.data) {
        setSystemHealth(response.data);
      } else {
        console.error('Failed to fetch system health:', response.error);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    } finally {
      setHealthLoading(false);
    }
  };

  // Fetch all data - memoized to prevent unnecessary re-renders
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchDashboardSummary(),
      fetchRecentActivities(),
      fetchLoanStats(),
      fetchInvestmentStats(),
      fetchSystemHealth()
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'USER_REGISTRATION':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'LOAN_APPLICATION':
      case 'LOAN_APPROVAL':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'INVESTMENT_CREATION':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'WITHDRAWAL_REQUEST':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'DEPOSIT_COMPLETED':
        return <ArrowDownRight className="h-5 w-5 text-green-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'LOAN_APPLICATION':
        return <Badge className="bg-blue-500">Loan</Badge>;
      case 'LOAN_APPROVAL':
        return <Badge className="bg-green-500">Approval</Badge>;
      case 'INVESTMENT_CREATION':
        return <Badge className="bg-purple-500">Investment</Badge>;
      case 'USER_REGISTRATION':
        return <Badge className="bg-orange-500">User</Badge>;
      default:
        return <Badge variant="outline">{action.replace('_', ' ')}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected':
      case 'Available':
      case 'Healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Disconnected':
      case 'Unavailable':
      case 'Unhealthy':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Degraded':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Connected':
      case 'Available':
      case 'Healthy':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'Disconnected':
      case 'Unavailable':
      case 'Unhealthy':
        return <Badge className="bg-red-500">Offline</Badge>;
      case 'Degraded':
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Show full skeleton while initial load
  if (loading && !dashboardSummary) {
    return <FullDashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4" />
          <span>Auto-refreshes every 5 minutes</span>
        </div>
      </div>
      
      {/* Main Stats Cards */}
      {summaryLoading ? (
        <StatsGridSkeleton />
      ) : dashboardSummary ? (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{formatNumber(dashboardSummary.totalUsers)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(dashboardSummary.activeUsers)} active users
              </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{formatNumber(dashboardSummary.activeInvestments)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(dashboardSummary.pendingInvestments)} pending
              </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{formatNumber(dashboardSummary.activeLoans)}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(dashboardSummary.pendingLoans)} pending
              </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{formatNumber(dashboardSummary.newUsersToday)}</div>
              <p className="text-xs text-muted-foreground">
                Daily registration count
              </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Investments</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardSummary.pendingInvestments || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <ArrowLeftCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardSummary.pendingWithdrawals || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for detailed views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-max">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {activitiesLoading ? (
            <RecentActivitySkeleton />
          ) : recentActivities && recentActivities.length > 0 ? (
          <Card>
            <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                  Latest platform activities across all modules
              </CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{activity.details}</p>
                        {getActionBadge(activity.action)}
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.userEmail}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.createdAt)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest platform activities across all modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activities found</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Recent Tab */}
        <TabsContent value="recent" className="space-y-4">
          {activitiesLoading ? (
            <RecentActivitySkeleton />
          ) : recentActivities && recentActivities.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Complete list of recent platform activities with detailed information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 rounded-md border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{activity.details}</p>
                        {getActionBadge(activity.action)}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>User: {activity.userEmail}</p>
                        <p>Action: {activity.action}</p>
                        <p>Time: {formatRelativeTime(activity.createdAt)}</p>
                        <p>IP: {activity.ipAddress}</p>
                      </div>
                  </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Complete list of recent platform activities with detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activities found</p>
                  </div>
            </CardContent>
          </Card>
          )}
        </TabsContent>
        
        {/* Investments Tab */}
        <TabsContent value="investments" className="space-y-4">
          {investmentsLoading ? (
            <RecentActivitySkeleton />
          ) : investmentStats ? (
            <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
                  <CardTitle>Investment Overview</CardTitle>
              <CardDescription>
                    Summary of platform investments
              </CardDescription>
            </CardHeader>
                <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(investmentStats.totalInvestmentAmount)}</p>
                    </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Active Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(investmentStats.totalActiveAmount)}</p>
                </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Matured Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(investmentStats.totalMaturedAmount)}</p>
                </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Withdrawn Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(investmentStats.totalWithdrawnAmount)}</p>
                    </div>
                </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Types</CardTitle>
                  <CardDescription>
                    Breakdown by investment type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    {investmentStats.investmentsByType.map((type) => (
                      <div key={type.type} className="flex justify-between">
                        <span className="text-sm font-medium">{type.type} Investments</span>
                        <span className="text-sm font-bold">{formatNumber(type.count)} ({formatCurrency(type.amount)})</span>
                    </div>
                    ))}
              </div>
            </CardContent>
          </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No investment data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Loans Tab */}
        <TabsContent value="loans" className="space-y-4">
          {loansLoading ? (
            <RecentActivitySkeleton />
          ) : loanStats ? (
            <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
                  <CardTitle>Loan Overview</CardTitle>
              <CardDescription>
                    Summary of platform loans
              </CardDescription>
            </CardHeader>
                <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanStats.totalLoanAmount)}</p>
                    </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Active Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanStats.totalActiveAmount)}</p>
                </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Repaid Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanStats.totalRepaidAmount)}</p>
                </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Defaulted Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanStats.totalDefaultedAmount)}</p>
                    </div>
                </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loan Types</CardTitle>
                  <CardDescription>
                    Breakdown by loan type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    {loanStats.loansByType.map((type) => (
                      <div key={type.type} className="flex justify-between">
                        <span className="text-sm font-medium">{type.type} Loans</span>
                        <span className="text-sm font-bold">{formatNumber(type.count)} ({formatCurrency(type.amount)})</span>
                    </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No loan data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-4">
          {healthLoading ? (
            <RecentActivitySkeleton />
          ) : systemHealth ? (
            <div className="space-y-4">
              {/* Database Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Database Status
                  </CardTitle>
                  <CardDescription>
                    Database connection and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-3">
                    {getStatusIcon(systemHealth.database)}
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-lg font-bold">{systemHealth.database}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* External Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    External Services
                  </CardTitle>
                  <CardDescription>
                    Third-party service availability and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(systemHealth.externalServices).map(([serviceName, status]) => (
                      <div key={serviceName} className="border p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(status)}
                            <h4 className="font-medium capitalize">{serviceName}</h4>
                          </div>
                          {getStatusBadge(status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Server Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Server Status
                  </CardTitle>
                  <CardDescription>
                    Server health and uptime information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Server className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Server Status</p>
                      <p className="text-lg font-bold">{systemHealth.serverStatus}</p>
                    </div>
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-bold">{systemHealth.uptime}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-lg font-bold">{formatRelativeTime(systemHealth.timestamp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No system health data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 