import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  ApiResponse,
  AuthResponse,
  AdminUser,
  DashboardSummary,
  DashboardActivitiesResponse,
  LoanStats,
  InvestmentStats,
  SystemHealth,
  AdminProfileUpdate,
  PasswordChange,
  Transaction,
  FinancialAnalytics,
  UserAnalytics,
  ExportRequest,
  ExportStatus,
  BulkOperation,
  BulkOperationResult,
  AuditLog,
  ComplianceReport,
  User,
  UserResponse,
  UsersResponse,
  PaginatedResponse,
  Loan,
  Investment,
} from "./types";

interface RequestConfig {
  requiresAuth?: boolean;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Use environment variable for backend URL with localhost as fallback for development
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "LiteFi-Admin-Dashboard/1.0",
      },
    });

    // Try to get token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }

    // Set up request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Set up response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private handleApiResponse<T>(response: AxiosResponse): ApiResponse<T> {
    const data = response.data;

    // Handle API response format from documentation
    if (data.success === false) {
      return {
        success: false,
        error: data.error?.message || data.message || "API request failed",
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  }

  private handleApiError<T>(error: AxiosError): ApiResponse<T> {
    console.error("API request failed:", error);

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as {
        error?: { message?: string };
        message?: string;
      };
      const message =
        data?.error?.message ||
        data?.message ||
        `Server error: ${error.response.status}`;

      return {
        success: false,
        error: message,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: "Network error: Unable to connect to server",
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestConfig & {
      method?: string;
      data?: unknown;
      params?: unknown;
    } = {}
  ): Promise<ApiResponse<T>> {
    const {
      requiresAuth = true,
      method = "GET",
      data,
      params,
      ...requestOptions
    } = options;

    try {
      const config: {
        method: string;
        url: string;
        data?: unknown;
        params?: unknown;
        headers?: Record<string, string>;
      } = {
        method,
        url: endpoint,
        data,
        params,
        ...requestOptions,
      };

      // Remove auth header for public endpoints
      if (!requiresAuth && config.headers) {
        delete config.headers.Authorization;
      }

      const response = await this.axiosInstance.request(config);
      return this.handleApiResponse<T>(response);
    } catch (error) {
      return this.handleApiError<T>(error as AxiosError);
    }
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Test backend connectivity
  async testConnection(): Promise<{
    available: boolean;
    message: string;
    baseURL: string;
  }> {
    const baseURL = this.axiosInstance.defaults.baseURL;
    console.log("Testing connection to:", baseURL);

    try {
      // Try a simple GET request to test if the backend is responding
      const response = await fetch(`${baseURL}/health`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        return {
          available: true,
          message: `Backend is responding (${response.status})`,
          baseURL: baseURL || "unknown",
        };
      } else {
        return {
          available: false,
          message: `Backend returned ${response.status}: ${response.statusText}`,
          baseURL: baseURL || "unknown",
        };
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      return {
        available: false,
        message: `Connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        baseURL: baseURL || "unknown",
      };
    }
  }

  // Admin authentication endpoints
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    console.log("Attempting admin login with:", {
      email,
      baseURL: this.axiosInstance.defaults.baseURL,
    });

    try {
      console.log("Using confirmed admin login endpoint: /auth/admin/login");

      const response = await this.request<AuthResponse>("/auth/admin/login", {
        method: "POST",
        requiresAuth: false,
        data: { email, password },
      });

      console.log("Admin login successful!", response);

      // Store token if login successful
      if (response.success && response.data?.accessToken) {
        this.setToken(response.data.accessToken);
        console.log("Token stored successfully");
      }

      return response;
    } catch (error) {
      console.error("Admin login failed:", error);
      return this.handleApiError<AuthResponse>(error as AxiosError);
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>("/auth/admin/logout", {
      method: "POST",
    });

    // Clear token regardless of response
    this.clearToken();

    return response;
  }

  async getProfile(id: string): Promise<ApiResponse<AdminUser>> {
    return this.request<AdminUser>(`/admin/profile/${id}`);
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/admin/refresh", {
      method: "POST",
    });
  }

  // Dashboard endpoints
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    return this.request("/admin/dashboard/summary");
  }

  async getRecentActivities(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<DashboardActivitiesResponse>> {
    return this.request("/admin/dashboard/recent-activities", { params });
  }

  async getLoanStats(): Promise<ApiResponse<LoanStats>> {
    return this.request("/admin/dashboard/loan-stats");
  }

  async getInvestmentStats(): Promise<ApiResponse<InvestmentStats>> {
    return this.request("/admin/dashboard/investment-stats");
  }

  async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    return this.request("/admin/system-health");
  }

  // User management endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    verified?: boolean;
    isActive?: boolean;
  }): Promise<ApiResponse<UsersResponse>> {
    return this.request("/admin/users", {
      method: "GET",
      params,
    });
  }

  async getUserById(id: string): Promise<ApiResponse<UserResponse>> {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<UserResponse>> {
    return this.request(`/admin/users/${id}`, {
      method: "PUT",
      data,
    });
  }

  async updateUserStatus(
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/admin/users/${id}/status`, {
      method: "PUT",
      data: { isActive },
    });
  }

  async getUserLoans(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Loan>>> {
    return this.request(`/admin/users/${userId}/loans`, {
      method: "GET",
      params,
    });
  }

  async getUserInvestments(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Investment>>> {
    return this.request(`/admin/users/${userId}/investments`, {
      method: "GET",
      params,
    });
  }

  async getUserTransactions(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      type?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return this.request(`/admin/users/${userId}/transactions`, {
      method: "GET",
      params,
    });
  }

  // Loan management endpoints
  async getLoans(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<unknown>> {
    return this.request("/admin/loans", {
      method: "GET",
      params,
    });
  }

  async getLoanById(id: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/loans/${id}`);
  }

  async updateLoanStatus(
    id: string,
    status: string,
    approvedAmount?: number,
    notes?: string
  ): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/loans/${id}/status`, {
      method: "PUT",
      data: { status, approvedAmount, notes },
    });
  }

  // Notification endpoints
  async getNotifications(): Promise<ApiResponse<unknown>> {
    return this.request("/admin/notifications");
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/notifications/${id}/read`, {
      method: "PUT",
    });
  }

  async getUnreadNotificationCount(): Promise<ApiResponse<unknown>> {
    return this.request("/admin/notifications/unread-count");
  }

  // Wallet management endpoints
  async getDeposits(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<unknown>> {
    return this.request("/admin/wallet/deposits", {
      method: "GET",
      params,
    });
  }

  async getWithdrawals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<unknown>> {
    return this.request("/admin/wallet/withdrawals", {
      method: "GET",
      params,
    });
  }

  async getPaymentChannels(): Promise<ApiResponse<unknown>> {
    return this.request("/admin/wallet/payment-channels");
  }

  async processWithdrawal(
    id: string,
    approve: boolean,
    notes?: string,
    reference?: string
  ): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/wallet/withdrawals/${id}/process`, {
      method: "POST",
      data: { approve, notes, reference },
    });
  }

  async getWalletStats(): Promise<ApiResponse<unknown>> {
    return this.request("/admin/wallet/stats");
  }

  // Admin Profile & Management
  async getAdminProfile(id: string): Promise<ApiResponse<AdminUser>> {
    return this.request(`/admin/profile/${id}`);
  }

  async updateAdminProfile(
    id: string,
    data: AdminProfileUpdate
  ): Promise<ApiResponse<AdminUser>> {
    return this.request(`/admin/profile/${id}`, {
      method: "PUT",
      data,
    });
  }

  async changeAdminPassword(
    id: string,
    data: PasswordChange
  ): Promise<ApiResponse<void>> {
    return this.request(`/admin/profile/${id}/change-password`, {
      method: "POST",
      data,
    });
  }

  async getAllAdmins(): Promise<ApiResponse<AdminUser[]>> {
    return this.request("/admin/admins");
  }

  async createAdmin(
    data: AdminProfileUpdate & { password: string }
  ): Promise<ApiResponse<AdminUser>> {
    return this.request("/admin/admins", {
      method: "POST",
      data,
    });
  }

  async updateAdmin(
    id: string,
    data: AdminProfileUpdate
  ): Promise<ApiResponse<AdminUser>> {
    return this.request(`/admin/admins/${id}`, {
      method: "PUT",
      data,
    });
  }

  async toggleAdminStatus(
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<AdminUser>> {
    return this.request(`/admin/admins/${id}/status`, {
      method: "PUT",
      data: { isActive },
    });
  }

  // Transaction Management
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    return this.request("/admin/transactions", {
      method: "GET",
      params,
    });
  }

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return this.request(`/admin/transactions/${id}`);
  }

  // Analytics & Reporting
  async getFinancialAnalytics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<FinancialAnalytics>> {
    return this.request("/admin/analytics/financial", {
      method: "GET",
      params,
    });
  }

  async getUserAnalytics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<UserAnalytics>> {
    return this.request("/admin/analytics/users", {
      method: "GET",
      params,
    });
  }

  async requestExport(
    data: ExportRequest
  ): Promise<ApiResponse<{ exportId: string }>> {
    return this.request("/admin/exports", {
      method: "POST",
      data,
    });
  }

  async getExportStatus(id: string): Promise<ApiResponse<ExportStatus>> {
    return this.request(`/admin/exports/${id}/status`);
  }

  // Bulk Operations

  async bulkUserOperation<T>(
    data: BulkOperation<T>
  ): Promise<ApiResponse<BulkOperationResult>> {
    return this.request("/admin/users/bulk", {
      method: "POST",
      data,
    });
  }

  async bulkLoanOperation<T>(
    data: BulkOperation<T>
  ): Promise<ApiResponse<BulkOperationResult>> {
    return this.request("/admin/loans/bulk", {
      method: "POST",
      data,
    });
  }

  // Audit & Compliance
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<AuditLog[]>> {
    return this.request("/admin/audit-logs", {
      method: "GET",
      params,
    });
  }

  async getComplianceReports(): Promise<ApiResponse<ComplianceReport[]>> {
    return this.request("/admin/compliance/reports");
  }

  async generateComplianceReport(data: {
    type: ComplianceReport["type"];
    period: ComplianceReport["period"];
  }): Promise<ApiResponse<ComplianceReport>> {
    return this.request("/admin/compliance/reports", {
      method: "POST",
      data,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
