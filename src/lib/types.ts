// Admin User Types
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  RISK = 'RISK',
  FINANCE = 'FINANCE',
  COMPLIANCE = 'COMPLIANCE',
  COLLECTIONS = 'COLLECTIONS',
  PORT_MGT = 'PORT_MGT',
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  admin: AdminUser;
  accessToken: string;
  refreshToken: string;
}

// User Types
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Investment Types
export enum InvestmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export interface Investment {
  id: string;
  userId: string;
  amount: number;
  planId: string;
  planName: string;
  status: InvestmentStatus;
  startDate: string | null;
  endDate: string | null;
  interestRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  durationMonths: number;
  isActive: boolean;
}

// Loan Types
export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  REPAID = 'REPAID',
  DEFAULTED = 'DEFAULTED',
  REJECTED = 'REJECTED',
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  productId: string;
  productName: string;
  status: LoanStatus;
  startDate: string | null;
  endDate: string | null;
  interestRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  durationMonths: number;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Dashboard Types
export interface DashboardStats {
  usersCount: number;
  activeInvestments: number;
  investmentsTotal: number;
  activeLoans: number;
  loansTotal: number;
  recentActivities: DashboardActivity[];
}

// Dashboard API Response Types
export interface DashboardSummary {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalLoans: number;
    activeLoans: number;
    totalInvestments: number;
    activeInvestments: number;
    totalTransactions: number;
    totalRevenue: number;
  };
  recentStats: {
    newUsersToday: number;
    newLoansToday: number;
    newInvestmentsToday: number;
    transactionsToday: number;
  };
  monthlyGrowth: {
    userGrowth: number;
    loanGrowth: number;
    investmentGrowth: number;
    revenueGrowth: number;
  };
}

export interface DashboardActivity {
  id: string;
  type: 'USER_REGISTRATION' | 'LOAN_APPLICATION' | 'INVESTMENT_CREATED' | 'WITHDRAWAL_REQUEST' | 'DEPOSIT_COMPLETED' | 'LOAN_APPROVED' | 'INVESTMENT_MATURED';
  description: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface DashboardActivitiesResponse {
  activities: DashboardActivity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface LoanStats {
  overview: {
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
    defaultedLoans: number;
    totalLoanAmount: number;
    totalRepaid: number;
  };
  byStatus: {
    PENDING: number;
    APPROVED: number;
    ACTIVE: number;
    COMPLETED: number;
    DEFAULTED: number;
    REJECTED: number;
  };
  byType: {
    SALARY: number;
    WORKING_CAPITAL: number;
    AUTO: number;
    PERSONAL: number;
  };
  monthlyData: Array<{
    month: string;
    applications: number;
    approved: number;
    disbursed: number;
    amount: number;
  }>;
}

export interface InvestmentStats {
  overview: {
    totalInvestments: number;
    activeInvestments: number;
    maturedInvestments: number;
    totalInvestmentAmount: number;
    totalInterestPaid: number;
  };
  byStatus: {
    PENDING: number;
    ACTIVE: number;
    MATURED: number;
    WITHDRAWN: number;
    CANCELLED: number;
  };
  byType: {
    NAIRA: number;
    FOREIGN: number;
    EQUITY: number;
  };
  monthlyData: Array<{
    month: string;
    investments: number;
    amount: number;
    interestPaid: number;
  }>;
}

export interface SystemHealth {
  database: {
    status: 'CONNECTED' | 'DISCONNECTED';
    responseTime: string;
    connections: number;
  };
  externalServices: {
    mono: ServiceStatus;
    dot: ServiceStatus;
    zeptomail: ServiceStatus;
    sms: ServiceStatus;
  };
  serverMetrics: {
    uptime: string;
    memoryUsage: string;
    cpuUsage: string;
    diskUsage: string;
  };
}

export interface ServiceStatus {
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'DEGRADED';
  responseTime: string;
  lastChecked: string;
}

// System Settings Types
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

// Notifications
export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Wallet Management Types
export enum DepositStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
  USSD = 'USSD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export interface Deposit {
  id: string;
  reference: string;
  amount: number;
  status: DepositStatus;
  paymentMethod: PaymentMethod;
  channel: string;
  createdAt: string;
  completedAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Withdrawal {
  id: string;
  reference: string;
  amount: number;
  status: WithdrawalStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  processedAt?: string;
  notes?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PaymentChannel {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  description: string;
  supportedMethods: PaymentMethod[];
}

export interface WalletStats {
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalVolume: number;
  completedDeposits: number;
  completedWithdrawals: number;
}

// Legacy interface for backwards compatibility
export interface Activity {
  id: string;
  type: 'USER_REGISTRATION' | 'INVESTMENT_CREATED' | 'LOAN_CREATED' | 'DEPOSIT' | 'WITHDRAWAL';
  description: string;
  timestamp: string;
} 