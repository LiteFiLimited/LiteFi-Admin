"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatCurrency } from '@/lib/utils';
import { User, UserStatus, Loan, Investment, Transaction } from '@/lib/types';
import { ArrowLeft, CheckCircle, XCircle, UserCheck, Calendar, Phone, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import apiClient from '@/lib/api';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params.id as string;
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Load user data with useCallback to avoid recreating the function on each render
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUserById(userId);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        toast({
          title: "Error",
          message: response.error || "Failed to load user details",
          type: "error",
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast({
        title: "Error",
        message: "An unexpected error occurred while loading user details",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);
  
  // Load user's loans
  const loadUserLoans = async () => {
    try {
      const response = await apiClient.getUserLoans(userId);
      
      if (response.success && response.data) {
        setUserLoans(response.data.data);
      }
    } catch (error) {
      console.error('Error loading user loans:', error);
    }
  };
  
  // Load user's investments
  const loadUserInvestments = async () => {
    try {
      const response = await apiClient.getUserInvestments(userId);
      
      if (response.success && response.data) {
        setUserInvestments(response.data.data);
      }
    } catch (error) {
      console.error('Error loading user investments:', error);
    }
  };
  
  // Load user's transactions
  const loadUserTransactions = async () => {
    try {
      const response = await apiClient.getUserTransactions(userId);
      
      if (response.success && response.data) {
        setUserTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading user transactions:', error);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Load data based on active tab
    if (value === 'loans' && userLoans.length === 0) {
      loadUserLoans();
    } else if (value === 'investments' && userInvestments.length === 0) {
      loadUserInvestments();
    } else if (value === 'transactions' && userTransactions.length === 0) {
      loadUserTransactions();
    }
  };
  
  // Handle user status change
  const handleStatusChange = async (isActive: boolean) => {
    try {
      setIsUpdatingStatus(true);
      const response = await apiClient.updateUserStatus(userId, isActive);
      
      if (response.success) {
        toast({
          title: "Success",
          message: `User status updated to ${isActive ? 'active' : 'inactive'}`,
          type: "success",
        });
        
        // Refresh user data
        loadUser();
      } else {
        toast({
          title: "Error",
          message: response.error || "Failed to update user status",
          type: "error",
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        message: "An unexpected error occurred while updating user status",
        type: "error",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    loadUser();
  }, [userId, loadUser]);
  
  const isUserActive = user?.status === UserStatus.ACTIVE;
  
  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : user ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" /> {user.email}
                <span className="mx-2">•</span>
                <Phone className="h-4 w-4" /> {user.phone}
              </p>
            </div>
            <div>
              {isUserActive ? (
                <Button 
                  variant="destructive" 
                  onClick={() => handleStatusChange(false)}
                  disabled={isUpdatingStatus}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Deactivate User
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" 
                  onClick={() => handleStatusChange(true)}
                  disabled={isUpdatingStatus}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate User
                </Button>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>User account information and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-muted-foreground">Status</h3>
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
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-muted-foreground">Verification</h3>
                        {user.isVerified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            <XCircle className="mr-2 h-4 w-4" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-muted-foreground">Registered</h3>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Additional user information can be displayed here */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="loans">
              <Card>
                <CardHeader>
                  <CardTitle>User Loans</CardTitle>
                  <CardDescription>Loans associated with this user account</CardDescription>
                </CardHeader>
                <CardContent>
                  {userLoans.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left">Loan ID</th>
                          <th className="py-3 text-left">Amount</th>
                          <th className="py-3 text-left">Type</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userLoans.map((loan) => (
                          <tr key={loan.id} className="border-b">
                            <td className="py-3">{loan.id}</td>
                            <td className="py-3">{formatCurrency(loan.amount)}</td>
                            <td className="py-3">{loan.productName || "Standard"}</td>
                            <td className="py-3">
                              <Badge
                                variant={
                                  loan.status === 'APPROVED'
                                    ? 'default'
                                    : loan.status === 'PENDING'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {loan.status}
                              </Badge>
                            </td>
                            <td className="py-3">{formatDate(loan.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No loans found for this user.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="investments">
              <Card>
                <CardHeader>
                  <CardTitle>User Investments</CardTitle>
                  <CardDescription>Investments associated with this user account</CardDescription>
                </CardHeader>
                <CardContent>
                  {userInvestments.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left">Investment ID</th>
                          <th className="py-3 text-left">Amount</th>
                          <th className="py-3 text-left">Plan</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userInvestments.map((investment) => (
                          <tr key={investment.id} className="border-b">
                            <td className="py-3">{investment.id}</td>
                            <td className="py-3">{formatCurrency(investment.amount)}</td>
                            <td className="py-3">{investment.planName}</td>
                            <td className="py-3">
                              <Badge
                                variant={
                                  investment.status === 'ACTIVE'
                                    ? 'default'
                                    : investment.status === 'PENDING'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {investment.status}
                              </Badge>
                            </td>
                            <td className="py-3">{formatDate(investment.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No investments found for this user.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>User Transactions</CardTitle>
                  <CardDescription>Transaction history for this user account</CardDescription>
                </CardHeader>
                <CardContent>
                  {userTransactions.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left">Transaction ID</th>
                          <th className="py-3 text-left">Amount</th>
                          <th className="py-3 text-left">Type</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="py-3">{transaction.id}</td>
                            <td className="py-3">{formatCurrency(transaction.amount)}</td>
                            <td className="py-3">{transaction.type}</td>
                            <td className="py-3">
                              <Badge
                                variant={
                                  transaction.status === 'COMPLETED'
                                    ? 'default'
                                    : transaction.status === 'PENDING'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="py-3">{formatDate(transaction.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No transactions found for this user.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">User not found or an error occurred.</p>
          <Button 
            variant="link" 
            onClick={() => router.push('/users')}
            className="mt-2"
          >
            Return to User List
          </Button>
        </div>
      )}
    </div>
  );
}
