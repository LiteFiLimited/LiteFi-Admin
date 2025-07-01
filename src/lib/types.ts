// Admin User Types
export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SALES = "SALES",
  RISK = "RISK",
  FINANCE = "FINANCE",
  COMPLIANCE = "COMPLIANCE",
  COLLECTIONS = "COLLECTIONS",
  PORT_MGT = "PORT_MGT",
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

// Extended admin profile interface with additional fields
export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  admin: AdminUser;
  accessToken: string;
  refreshToken: string;
}

// Profile API responses
export interface ProfileResponse {
  success: boolean;
  data: AdminProfile;
  message: string;
}

// User Types
export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
  BLOCKED = "BLOCKED",
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

// Pagination types
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// User response types
export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

// Investment Types
export enum InvestmentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  MATURED = "MATURED",
  WITHDRAWN = "WITHDRAWN",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum InvestmentPlanType {
  NAIRA = "NAIRA",
  FOREIGN = "FOREIGN",
  EQUITY = "EQUITY",
}

export interface Investment {
  id: string;
  reference: string;
  name: string;
  amount: number;
  status: InvestmentStatus;
  planType: InvestmentPlanType;
  currency: string;
  interestRate: number;
  tenure: number;
  startDate: string | null;
  maturityDate: string | null;
  expectedReturns: number;
  totalInterest?: number;
  createdAt: string;
  activatedAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  plan: {
    id: string;
    name: string;
    description?: string;
    type: InvestmentPlanType;
    minimumAmount?: number;
    maximumAmount?: number;
    minimumTenure?: number;
    maximumTenure?: number;
  };
  interestPayments?: Array<{
    id: string;
    amount: number;
    status: "PAID" | "PENDING" | "FAILED";
    paymentDate: string;
  }>;
  documents?: Array<{
    id: string;
    type: string;
    url: string;
    createdAt: string;
  }>;
  paymentProof?: {
    id: string;
    url: string;
    createdAt: string;
  };
  originalInterestRate?: number;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  type: InvestmentPlanType;
  currency: string;
  minimumAmount: number;
  maximumAmount: number;
  minimumTenure: number;
  maximumTenure: number;
  interestRates: Array<{
    id: string;
    minTenure: number;
    maxTenure: number;
    rate: number;
  }>;
  features: string[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface InvestmentsResponse {
  investments: Investment[];
  pagination: Pagination;
}

export interface InvestmentPlansResponse {
  plans: InvestmentPlan[];
}

export interface UpdateInvestmentStatusRequest {
  status: InvestmentStatus;
  notes?: string;
}

export interface OverrideInterestRateRequest {
  overriddenInterestRate: number;
  reason: string;
}

export interface BulkInvestmentOperationRequest {
  operation: "APPROVE" | "REJECT" | "ACTIVATE" | "CANCEL";
  investmentIds: string[];
  notes?: string;
}

export interface BulkInvestmentOperationResponse {
  processedCount: number;
  successfulOperations: Array<{
    investmentId: string;
    status: InvestmentStatus;
  }>;
  failedOperations: Array<{
    investmentId: string;
    error: string;
  }>;
}

export interface CreateInvestmentPlanRequest {
  name: string;
  description: string;
  type: InvestmentPlanType;
  currency: string;
  minimumAmount: number;
  maximumAmount: number;
  minimumTenure: number;
  maximumTenure: number;
  interestRates: Array<{
    minTenure: number;
    maxTenure: number;
    rate: number;
  }>;
  features: string[];
  active: boolean;
}

export interface UpdateInvestmentPlanRequest {
  name?: string;
  description?: string;
  maximumAmount?: number;
  interestRates?: Array<{
    id?: string;
    minTenure?: number;
    maxTenure?: number;
    rate?: number;
  }>;
  features?: string[];
  active?: boolean;
}

// Loan Types
export enum LoanStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  DEFAULTED = "DEFAULTED",
}

export enum LoanType {
  SALARY = "SALARY",
  WORKING_CAPITAL = "WORKING_CAPITAL",
  AUTO = "AUTO",
  TRAVEL = "TRAVEL",
}

export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CARD = "CARD",
  CASH = "CASH",
  WALLET = "WALLET",
  USSD = "USSD",
  BANK_ACCOUNT = "BANK_ACCOUNT",
}

export enum DocumentType {
  ID_DOCUMENT = "ID_DOCUMENT",
  BANK_STATEMENT = "BANK_STATEMENT",
  EMPLOYMENT_LETTER = "EMPLOYMENT_LETTER",
  SALARY_SLIP = "SALARY_SLIP",
  BUSINESS_REGISTRATION = "BUSINESS_REGISTRATION",
}

export enum RepaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  PARTIAL = "PARTIAL",
}

export interface LoanUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  description?: string;
  type: LoanType;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  duration: number;
  serviceFee?: number;
  processingFee?: number;
  requiresGuarantor: boolean;
  requiresCollateral: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RepaymentSchedule {
  id: string;
  dueDate: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  status: RepaymentStatus;
  paidDate?: string | null;
}

export interface RepaymentHistory {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference: string;
  paidAt: string;
  notes?: string;
}

export interface LoanDocument {
  id: string;
  type: DocumentType;
  url: string;
  verified: boolean;
}

export interface Loan {
  id: string;
  reference: string;
  amount: number;
  approvedAmount?: number;
  status: LoanStatus;
  type: LoanType;
  interestRate: number;
  duration: number;
  totalPayable?: number;
  amountPaid?: number;
  balanceRemaining?: number;
  startDate?: string;
  maturityDate?: string;
  purpose?: string;
  createdAt: string;
  updatedAt?: string;
  user: LoanUser;
  product: LoanProduct;
  repaymentSchedule?: RepaymentSchedule[];
  repaymentHistory?: RepaymentHistory[];
  documents?: LoanDocument[];
}

export interface LoansResponse {
  loans: Loan[];
  pagination: Pagination;
}

export interface UpdateLoanStatusRequest {
  status: LoanStatus;
  approvedAmount?: number;
  rejectionReason?: string;
  notes?: string;
}

export interface ManualRepaymentRequest {
  loanId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference: string;
  notes?: string;
}

export interface BulkRepaymentRequest {
  repayments: {
    loanId: string;
    amount: number;
    reference: string;
    paymentMethod: PaymentMethod;
  }[];
}

export interface BulkRepaymentResponse {
  processedCount: number;
  successfulRepayments: {
    loanId: string;
    amount: number;
    reference: string;
    status: string;
  }[];
  failedRepayments: {
    loanId: string;
    error: string;
  }[];
}

export interface CreateLoanProductRequest {
  name: string;
  description?: string;
  type: LoanType;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  duration: number;
  serviceFee?: number;
  processingFee?: number;
  requiresGuarantor: boolean;
  requiresCollateral: boolean;
  active: boolean;
}

export interface UpdateLoanProductRequest {
  name?: string;
  description?: string;
  interestRate?: number;
  minimumAmount?: number;
  maximumAmount?: number;
  duration?: number;
  serviceFee?: number;
  processingFee?: number;
  requiresGuarantor?: boolean;
  requiresCollateral?: boolean;
  active?: boolean;
}

export interface BulkLoanOperationRequest {
  operation: "APPROVE" | "REJECT" | "ACTIVATE";
  loanIds: string[];
  notes?: string;
}

export interface BulkLoanOperationResponse {
  processedCount: number;
  successfulOperations: {
    loanId: string;
    status: LoanStatus;
  }[];
  failedOperations: {
    loanId: string;
    error: string;
  }[];
}

export interface LoanProductsResponse {
  products: LoanProduct[];
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
  type:
    | "USER_REGISTRATION"
    | "LOAN_APPLICATION"
    | "INVESTMENT_CREATED"
    | "WITHDRAWAL_REQUEST"
    | "DEPOSIT_COMPLETED"
    | "LOAN_APPROVED"
    | "INVESTMENT_MATURED";
  description: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "ERROR";
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
    status: "CONNECTED" | "DISCONNECTED";
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
  status: "AVAILABLE" | "UNAVAILABLE" | "DEGRADED";
  responseTime: string;
  lastChecked: string;
}

// System Settings Types
export interface SystemSettings {
  id: string;
  defaultInvestmentInterestRate: number;
  defaultLoanInterestRate: number;
  minimumInvestmentAmount: number;
  defaultProcessingFee: number;
  maxWithdrawalPerDay: number;
  enableForeignInvestments: boolean;
  autoApproveNairaInvestments: boolean;
  enableUpfrontInterestPayment: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSystemSettingsRequest {
  defaultInvestmentInterestRate?: number;
  defaultLoanInterestRate?: number;
  minimumInvestmentAmount?: number;
  defaultProcessingFee?: number;
  maxWithdrawalPerDay?: number;
  enableForeignInvestments?: boolean;
  autoApproveNairaInvestments?: boolean;
  enableUpfrontInterestPayment?: boolean;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

// Notifications
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  read?: boolean;
}

export interface NotificationCountResponse {
  count: number;
}

export interface NotificationsApiResponse {
  success: boolean;
  data: AdminNotification[] | AdminNotification | NotificationCountResponse;
  message?: string;
  error?: string;
}

// Legacy notification interface (for backwards compatibility)
export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Wallet Management Types
export enum DepositStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum WithdrawalStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export interface Deposit {
  id: string;
  reference: string;
  amount: number;
  status: DepositStatus;
  paymentMethod: string;
  paymentChannel: string;
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
  createdAt: string;
  processedAt?: string;
  notes?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bankAccount?: {
    id: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

export interface PaymentChannel {
  id: string;
  name: string;
  code: string;
  type: "MANUAL" | "AUTOMATIC";
  description: string;
  active: boolean;
  processingTime: string;
  minimumAmount: number;
  maximumAmount: number;
  provider?: string;
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
  type:
    | "USER_REGISTRATION"
    | "INVESTMENT_CREATED"
    | "LOAN_CREATED"
    | "DEPOSIT"
    | "WITHDRAWAL";
  description: string;
  timestamp: string;
}

// Admin Profile Types
export interface AdminProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: AdminRole;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  type:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "LOAN_DISBURSEMENT"
    | "LOAN_REPAYMENT"
    | "INVESTMENT_DEPOSIT"
    | "INVESTMENT_WITHDRAWAL";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  reference: string;
  userId: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

// Analytics Types
export interface FinancialAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionSize: number;
  revenueByProduct: {
    loans: number;
    investments: number;
    fees: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  userGrowth: number;
  userRetention: number;
  usersByStatus: {
    active: number;
    inactive: number;
    suspended: number;
  };
  usersByProduct: {
    loans: number;
    investments: number;
    both: number;
  };
}

export interface ExportRequest {
  type: "USERS" | "LOANS" | "INVESTMENTS" | "TRANSACTIONS";
  filters?: Record<string, unknown>;
  format: "CSV" | "EXCEL";
}

export interface ExportStatus {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  url?: string;
  createdAt: string;
  completedAt?: string;
}

// Bulk Operation Types
export interface BulkOperation<T> {
  items: T[];
  operation: "CREATE" | "UPDATE" | "DELETE";
  metadata?: Record<string, unknown>;
}

export interface BulkOperationResult {
  successful: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

// Audit & Compliance Types
export interface AuditLog {
  id: string;
  action: string;
  adminId: string;
  adminEmail: string;
  targetType: string;
  targetId: string;
  changes: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface ComplianceReport {
  id: string;
  type: "KYC" | "AML" | "TRANSACTION" | "REGULATORY";
  status: "PENDING" | "COMPLETED";
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalRecords: number;
    flaggedItems: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
  };
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
}
