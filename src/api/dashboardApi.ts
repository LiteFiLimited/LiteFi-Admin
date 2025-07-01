import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Types for dashboard API responses
export interface DashboardSummaryData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalLoans: number;
  activeLoans: number;
  pendingLoans: number;
  totalInvestments: number;
  activeInvestments: number;
  pendingInvestments: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
}

export interface LoanStatisticsData {
  totalLoanAmount: number;
  totalActiveAmount: number;
  totalRepaidAmount: number;
  totalDefaultedAmount: number;
  loansByType: Array<{
    type: string;
    count: number;
    amount: number;
  }>;
  loansByStatus: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
  monthlyStats: Array<{
    month: string;
    disbursed: number;
    repaid: number;
  }>;
}

export interface InvestmentStatisticsData {
  totalInvestmentAmount: number;
  totalActiveAmount: number;
  totalMaturedAmount: number;
  totalWithdrawnAmount: number;
  investmentsByType: Array<{
    type: string;
    count: number;
    amount: number;
  }>;
  investmentsByStatus: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
  monthlyStats: Array<{
    month: string;
    invested: number;
    matured: number;
    withdrawn: number;
  }>;
}

export interface SystemHealthData {
  database: string;
  externalServices: {
    mono: string;
    dot: string;
    sms: string;
    email: string;
  };
  serverStatus: string;
  uptime: string;
  timestamp: string;
}

export interface RecentActivityData {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

class DashboardApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://litefi-backend.onrender.com";
    
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "LiteFi-Admin-Dashboard/1.0",
      },
    });

    // Get token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
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

    if (data.success === false) {
      return {
        success: false,
        error: data.error || { code: "API_ERROR", message: data.message || "API request failed" },
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
      const data = error.response.data as {
        error?: { message?: string };
        message?: string;
      };
      const message = data?.error?.message || data?.message || `Server error: ${error.response.status}`;

      return {
        success: false,
        error: { code: "SERVER_ERROR", message },
      };
    } else if (error.request) {
      return {
        success: false,
        error: { code: "NETWORK_ERROR", message: "Network error: Unable to connect to server" },
      };
    } else {
      return {
        success: false,
        error: { code: "UNKNOWN_ERROR", message: error.message || "An unexpected error occurred" },
      };
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

  // Dashboard Summary Endpoint
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummaryData>> {
    try {
      const response = await this.axiosInstance.get("/admin/dashboard/summary");
      return this.handleApiResponse<DashboardSummaryData>(response);
    } catch (error) {
      return this.handleApiError<DashboardSummaryData>(error as AxiosError);
    }
  }

  // Investment Statistics Endpoint
  async getInvestmentStatistics(): Promise<ApiResponse<InvestmentStatisticsData>> {
    try {
      const response = await this.axiosInstance.get("/admin/dashboard/investment-stats");
      return this.handleApiResponse<InvestmentStatisticsData>(response);
    } catch (error) {
      return this.handleApiError<InvestmentStatisticsData>(error as AxiosError);
    }
  }

  // Loan Statistics Endpoint
  async getLoanStatistics(): Promise<ApiResponse<LoanStatisticsData>> {
    try {
      const response = await this.axiosInstance.get("/admin/dashboard/loan-stats");
      return this.handleApiResponse<LoanStatisticsData>(response);
    } catch (error) {
      return this.handleApiError<LoanStatisticsData>(error as AxiosError);
    }
  }

  // System Health Endpoint
  async getSystemHealth(): Promise<ApiResponse<SystemHealthData>> {
    try {
      const response = await this.axiosInstance.get("/admin/system-health");
      return this.handleApiResponse<SystemHealthData>(response);
    } catch (error) {
      return this.handleApiError<SystemHealthData>(error as AxiosError);
    }
  }

  // Recent Activities Endpoint
  async getRecentActivities(): Promise<ApiResponse<RecentActivityData[]>> {
    try {
      const response = await this.axiosInstance.get("/admin/dashboard/recent-activities");
      return this.handleApiResponse<RecentActivityData[]>(response);
    } catch (error) {
      return this.handleApiError<RecentActivityData[]>(error as AxiosError);
    }
  }
}

// Export singleton instance
export const dashboardApiClient = new DashboardApiClient();
export default dashboardApiClient; 