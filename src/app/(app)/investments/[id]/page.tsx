"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, DollarSign, Calendar, Percent, Building } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import investmentApi from '@/lib/investmentApi';
import { Investment, InvestmentStatus, InvestmentPlanType } from '@/lib/types';

export default function InvestmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const investmentId = params.id as string;
  
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await investmentApi.getInvestmentById(investmentId);

        if (response.success && response.data) {
          setInvestment(response.data);
        } else {
          setError(response.error || 'Failed to fetch investment details');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Error fetching investment:', err);
      } finally {
        setLoading(false);
      }
    };

    if (investmentId) {
      fetchInvestment();
    }
  }, [investmentId]);

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
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: InvestmentStatus) => {
    const statusConfig = {
      [InvestmentStatus.ACTIVE]: { color: 'bg-green-500 hover:bg-green-600', label: 'Active' },
      [InvestmentStatus.PENDING]: { color: 'bg-yellow-500 hover:bg-yellow-600', label: 'Pending' },
      [InvestmentStatus.APPROVED]: { color: 'bg-blue-500 hover:bg-blue-600', label: 'Approved' },
      [InvestmentStatus.MATURED]: { color: 'bg-purple-500 hover:bg-purple-600', label: 'Matured' },
      [InvestmentStatus.WITHDRAWN]: { color: 'bg-gray-500 hover:bg-gray-600', label: 'Withdrawn' },
      [InvestmentStatus.CANCELLED]: { color: 'bg-red-500 hover:bg-red-600', label: 'Cancelled' },
      [InvestmentStatus.COMPLETED]: { color: 'bg-gray-600 hover:bg-gray-700', label: 'Completed' },
      [InvestmentStatus.REJECTED]: { color: 'bg-red-600 hover:bg-red-700', label: 'Rejected' },
    };

    const config = statusConfig[status];
    if (!config) {
      // Fallback for unknown status
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
          {status || 'Unknown'}
        </Badge>
      );
    }
    
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

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Investment Details</h1>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">
              <p className="font-medium">Error loading investment details</p>
              <p className="text-sm mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Investment Details</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>Investment not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{investment.name}</h1>
            <p className="text-muted-foreground">Reference: {investment.reference}</p>
          </div>
        </div>
        {getStatusBadge(investment.status)}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Investment Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(investment.amount, investment.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Principal amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expected Returns</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(investment.expectedReturns, investment.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total returns at maturity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interest Rate</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investment.interestRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Annual rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tenure</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investment.tenure}</div>
            <p className="text-xs text-muted-foreground mt-1">Months</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Investment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Plan Type:</span>
              <Badge variant="outline" className={getTypeColor(investment.planType)}>
                {investment.planType}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Currency:</span>
              <span>{investment.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Start Date:</span>
              <span>{formatDate(investment.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Maturity Date:</span>
              <span>{formatDate(investment.maturityDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Created:</span>
              <span>{formatDate(investment.createdAt)}</span>
            </div>
            {investment.activatedAt && (
              <div className="flex justify-between">
                <span className="font-medium">Activated:</span>
                <span>{formatDate(investment.activatedAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Investor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{investment.user.firstName} {investment.user.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{investment.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{investment.user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">User ID:</span>
              <span className="font-mono text-sm">{investment.user.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Investment Plan Details */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Plan Name:</span>
              <span>{investment.plan.name}</span>
            </div>
            {investment.plan.description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {investment.plan.description}
                </p>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Plan ID:</span>
              <span className="font-mono text-sm">{investment.plan.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Interest Payments */}
        {investment.interestPayments && investment.interestPayments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Interest Payments</CardTitle>
              <CardDescription>Payment history for this investment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investment.interestPayments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium">
                        {formatCurrency(payment.amount, investment.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payment.paymentDate)}
                      </div>
                    </div>
                    <Badge variant={payment.status === 'PAID' ? 'default' : 'secondary'}>
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 