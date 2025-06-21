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
  Cpu,
  HardDrive
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { 
  DashboardSummary, 
  DashboardActivitiesResponse, 
  LoanStats, 
  InvestmentStats, 
  SystemHealth,
  DashboardActivity
} from '@/lib/types';
import { 
  StatsGridSkeleton, 
  RecentActivitySkeleton, 
  FullDashboardSkeleton 
} from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  // Note: toast functionality available via useToast() if needed for error handling
  
  // State for dashboard data
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [recentActivities, setRecentActivities] = useState<DashboardActivitiesResponse | null>(null);
  const [loanStats, setLoanStats] = useState<LoanStats | null>(null);
  const [investmentStats, setInvestmentStats] = useState<InvestmentStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  
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
      const response = await apiClient.getDashboardSummary();
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
      const response = await apiClient.getRecentActivities({ limit: 10 });
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
      const response = await apiClient.getLoanStats();
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
      const response = await apiClient.getInvestmentStats();
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
      const response = await apiClient.getSystemHealth();
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

  const formatPercentage = (num: number, showSign: boolean = true) => {
    const sign = showSign && num > 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
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

  const getActivityIcon = (type: DashboardActivity['type']) => {
    switch (type) {
      case 'USER_REGISTRATION':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'LOAN_APPLICATION':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'INVESTMENT_CREATED':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'WITHDRAWAL_REQUEST':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'DEPOSIT_COMPLETED':
        return <ArrowDownRight className="h-5 w-5 text-green-500" />;
      case 'LOAN_APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'INVESTMENT_MATURED':
        return <Activity className="h-5 w-5 text-orange-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: DashboardActivity['severity']) => {
    switch (severity) {
      case 'INFO':
        return <Badge className="bg-blue-500">Info</Badge>;
      case 'WARNING':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'ERROR':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'AVAILABLE':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'DISCONNECTED':
      case 'UNAVAILABLE':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'DEGRADED':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'AVAILABLE':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'DISCONNECTED':
      case 'UNAVAILABLE':
        return <Badge className="bg-red-500">Offline</Badge>;
      case 'DEGRADED':
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
      ) : (
        dashboardSummary?.overview && dashboardSummary?.monthlyGrowth ? (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardSummary.overview.totalUsers || 0)}</div>
                <div className="flex items-center space-x-2">
                  {(dashboardSummary.monthlyGrowth.userGrowth || 0) >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`text-xs ${(dashboardSummary.monthlyGrowth.userGrowth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(dashboardSummary.monthlyGrowth.userGrowth || 0)} from last month
                  </p>
                </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardSummary.overview.activeInvestments || 0)}</div>
            <div className="flex items-center space-x-2">
                  {(dashboardSummary.monthlyGrowth.investmentGrowth || 0) >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`text-xs ${(dashboardSummary.monthlyGrowth.investmentGrowth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(dashboardSummary.monthlyGrowth.investmentGrowth || 0)} from last month
                  </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardSummary.overview.activeLoans || 0)}</div>
            <div className="flex items-center space-x-2">
                  {(dashboardSummary.monthlyGrowth.loanGrowth || 0) >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`text-xs ${(dashboardSummary.monthlyGrowth.loanGrowth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(dashboardSummary.monthlyGrowth.loanGrowth || 0)} from last month
                  </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardSummary.overview.totalRevenue || 0)}</div>
                <div className="flex items-center space-x-2">
                  {(dashboardSummary.monthlyGrowth.revenueGrowth || 0) >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`text-xs ${(dashboardSummary.monthlyGrowth.revenueGrowth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(dashboardSummary.monthlyGrowth.revenueGrowth || 0)} from last month
                  </p>
                </div>
          </CardContent>
        </Card>
      </div>
        ) : null
      )}

      {/* Today's Stats */}
      {summaryLoading ? null : dashboardSummary?.recentStats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatNumber(dashboardSummary?.recentStats?.newUsersToday || 0)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Loans Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatNumber(dashboardSummary?.recentStats?.newLoansToday || 0)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Investments Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatNumber(dashboardSummary?.recentStats?.newInvestmentsToday || 0)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatNumber(dashboardSummary?.recentStats?.transactionsToday || 0)}</div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Tabs for detailed views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-max">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {activitiesLoading ? (
            <RecentActivitySkeleton />
          ) : recentActivities?.activities ? (
          <Card>
            <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                  Latest platform activities across all modules
              </CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.activities.length > 0 ? (
                  recentActivities.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{activity.description}</p>
                          {getSeverityBadge(activity.severity)}
                  </div>
                        <p className="text-xs text-muted-foreground">{activity.type.replace('_', ' ').toLowerCase()}</p>
                </div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                  </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activities found
                  </div>
                )}
            </CardContent>
          </Card>
          ) : null}
        </TabsContent>
        
        {/* Investments Tab */}
        <TabsContent value="investments" className="space-y-4">
          {investmentsLoading ? (
            <RecentActivitySkeleton />
          ) : investmentStats?.overview ? (
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
                      <p className="text-2xl font-bold">{formatCurrency(investmentStats.overview.totalInvestmentAmount)}</p>
                    </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Investments</p>
                      <p className="text-2xl font-bold">{formatNumber(investmentStats.overview.totalInvestments)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Investments</p>
                      <p className="text-2xl font-bold">{formatNumber(investmentStats.overview.activeInvestments)}</p>
                </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Interest Paid</p>
                      <p className="text-2xl font-bold">{formatCurrency(investmentStats.overview.totalInterestPaid)}</p>
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
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Naira Investments</span>
                      <span className="text-sm font-bold">{formatNumber(investmentStats.byType.NAIRA)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Foreign Investments</span>
                      <span className="text-sm font-bold">{formatNumber(investmentStats.byType.FOREIGN)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Equity Investments</span>
                      <span className="text-sm font-bold">{formatNumber(investmentStats.byType.EQUITY)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          ) : null}
        </TabsContent>
        
        {/* Loans Tab */}
        <TabsContent value="loans" className="space-y-4">
          {loansLoading ? (
            <RecentActivitySkeleton />
          ) : loanStats?.overview ? (
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
                      <p className="text-2xl font-bold">{formatCurrency(loanStats.overview.totalLoanAmount)}</p>
                    </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Loans</p>
                      <p className="text-2xl font-bold">{formatNumber(loanStats.overview.totalLoans)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
                      <p className="text-2xl font-bold">{formatNumber(loanStats.overview.activeLoans)}</p>
                </div>
                <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Repaid</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanStats.overview.totalRepaid)}</p>
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
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Salary Advance</span>
                      <span className="text-sm font-bold">{formatNumber(loanStats.byType.SALARY)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Working Capital</span>
                      <span className="text-sm font-bold">{formatNumber(loanStats.byType.WORKING_CAPITAL)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Auto Loans</span>
                      <span className="text-sm font-bold">{formatNumber(loanStats.byType.AUTO)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Personal Loans</span>
                      <span className="text-sm font-bold">{formatNumber(loanStats.byType.PERSONAL)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(systemHealth.database?.status || 'UNKNOWN')}
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-lg font-bold">{systemHealth.database?.status || 'Unknown'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                      <p className="text-lg font-bold">{systemHealth.database?.responseTime || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Connections</p>
                      <p className="text-lg font-bold">{systemHealth.database?.connections || 0}</p>
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
                    {systemHealth.externalServices && Object.entries(systemHealth.externalServices).map(([serviceName, service]) => (
                      <div key={serviceName} className="border p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(service.status)}
                            <h4 className="font-medium capitalize">{serviceName}</h4>
                          </div>
                          {getStatusBadge(service.status)}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Response Time:</span>
                            <span className="font-medium">{service.responseTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Checked:</span>
                            <span className="font-medium">{formatRelativeTime(service.lastChecked)}</span>
                          </div>
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
                    Server Metrics
                  </CardTitle>
                  <CardDescription>
                    Server resource utilization and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-bold">{systemHealth.serverMetrics?.uptime || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <Cpu className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-muted-foreground">CPU Usage</p>
                      <p className="text-lg font-bold">{systemHealth.serverMetrics?.cpuUsage || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-muted-foreground">Memory Usage</p>
                      <p className="text-lg font-bold">{systemHealth.serverMetrics?.memoryUsage || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <HardDrive className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Disk Usage</p>
                      <p className="text-lg font-bold">{systemHealth.serverMetrics?.diskUsage || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
} 