import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  AuthResponse, 
  AdminUser, 
  DashboardSummary, 
  DashboardActivitiesResponse, 
  LoanStats, 
  InvestmentStats, 
  SystemHealth 
} from './types';

interface RequestConfig {
  requiresAuth?: boolean;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;
  private isDevelopment: boolean;

  constructor() {
    // Use environment variable for backend URL with localhost as fallback for development
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
        headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LiteFi-Admin-Dashboard/1.0',
      },
    });

    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
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
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
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
        error: data.error?.message || data.message || 'API request failed',
        };
      }
      
      return {
        success: true,
      data: data.data || data,
        message: data.message,
    };
  }

  private handleApiError<T>(error: AxiosError): ApiResponse<T> {
    console.error('API request failed:', error);

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as { error?: { message?: string }; message?: string };
      const message = data?.error?.message || data?.message || `Server error: ${error.response.status}`;
      
      return {
        success: false,
        error: message,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'Network error: Unable to connect to server',
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  private getDemoData<T>(endpoint: string): T | null {
    // Return demo data for development when backend endpoints are not available
    if (!this.isDevelopment) return null;

    switch (endpoint) {
      case '/admin/dashboard/summary':
        return {
          overview: {
            totalUsers: 1250,
            activeUsers: 850,
            totalLoans: 320,
            activeLoans: 180,
            totalInvestments: 420,
            activeInvestments: 280,
            totalTransactions: 5600,
            totalRevenue: 15750000
          },
          recentStats: {
            newUsersToday: 25,
            newLoansToday: 8,
            newInvestmentsToday: 12,
            transactionsToday: 156
          },
          monthlyGrowth: {
            userGrowth: 12.5,
            loanGrowth: 18.3,
            investmentGrowth: 22.1,
            revenueGrowth: 15.8
          }
        } as T;

      case '/admin/dashboard/recent-activities':
        return {
          activities: [
            {
              id: 'act_1',
              type: 'USER_REGISTRATION',
              description: 'New user registered: John Doe',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              severity: 'INFO'
            },
            {
              id: 'act_2',
              type: 'INVESTMENT_CREATED',
              description: 'Investment application: ₦500,000',
              timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
              severity: 'INFO'
            },
            {
              id: 'act_3',
              type: 'LOAN_APPLICATION',
              description: 'Loan application submitted: ₦250,000',
              timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
              severity: 'INFO'
            }
          ],
          pagination: {
            total: 3,
            page: 1,
            limit: 10,
            pages: 1
          }
        } as T;

      case '/admin/dashboard/loan-stats':
        return {
          overview: {
            totalLoans: 320,
            activeLoans: 180,
            completedLoans: 95,
            defaultedLoans: 12,
            totalLoanAmount: 125000000,
            totalRepaid: 89500000
          },
          byStatus: {
            PENDING: 45,
            APPROVED: 25,
            ACTIVE: 180,
            COMPLETED: 95,
            DEFAULTED: 12,
            REJECTED: 28
          },
          byType: {
            SALARY: 180,
            WORKING_CAPITAL: 85,
            AUTO: 35,
            PERSONAL: 20
          },
          monthlyData: []
        } as T;

      case '/admin/dashboard/investment-stats':
        return {
          overview: {
            totalInvestments: 420,
            activeInvestments: 280,
            maturedInvestments: 115,
            totalInvestmentAmount: 185000000,
            totalInterestPaid: 12750000
          },
          byStatus: {
            PENDING: 25,
            ACTIVE: 280,
            MATURED: 115,
            WITHDRAWN: 85,
            CANCELLED: 8
          },
          byType: {
            NAIRA: 320,
            FOREIGN: 85,
            EQUITY: 15
          },
          monthlyData: []
        } as T;

      case '/admin/system-health':
        return {
          database: {
            status: 'CONNECTED',
            responseTime: '12ms',
            connections: 15
          },
          externalServices: {
            mono: {
              status: 'AVAILABLE',
              responseTime: '145ms',
              lastChecked: new Date().toISOString()
            },
            dot: {
              status: 'AVAILABLE',
              responseTime: '89ms',
              lastChecked: new Date().toISOString()
            },
            zeptomail: {
              status: 'AVAILABLE',
              responseTime: '234ms',
              lastChecked: new Date().toISOString()
            },
            sms: {
              status: 'AVAILABLE',
              responseTime: '167ms',
              lastChecked: new Date().toISOString()
            }
          },
          serverMetrics: {
            uptime: '14d 5h 30m',
            memoryUsage: '68%',
            cpuUsage: '23%',
            diskUsage: '45%'
          }
        } as T;

      case '/admin/profile':
        return {
          id: 'admin_123',
          firstName: 'Joseph',
          lastName: 'Awe',
          email: 'joseph.awe@litefi.ng',
          role: 'SUPER_ADMIN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as T;

      default:
        return null;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestConfig & { method?: string; data?: unknown; params?: unknown } = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, method = 'GET', data, params, ...requestOptions } = options;
    
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
      const axiosError = error as AxiosError;
      
      // In development, try to return demo data for missing endpoints
      if (this.isDevelopment && (axiosError.response?.status === 404 || axiosError.response?.status === 500)) {
        const demoData = this.getDemoData<T>(endpoint);
        if (demoData) {
          console.warn(`Using demo data for missing endpoint: ${endpoint}`);
          return {
            success: true,
            data: demoData,
            message: 'Demo data (endpoint not implemented)'
          };
        }
      }

      return this.handleApiError<T>(axiosError);
    }
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Test backend connectivity
  async testConnection(): Promise<{ available: boolean; message: string; baseURL: string }> {
    const baseURL = this.axiosInstance.defaults.baseURL;
    console.log('Testing connection to:', baseURL);
    
    try {
      // Try a simple GET request to test if the backend is responding
      const response = await fetch(`${baseURL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        return {
          available: true,
          message: `Backend is responding (${response.status})`,
          baseURL: baseURL || 'unknown'
        };
      } else {
        return {
          available: false,
          message: `Backend returned ${response.status}: ${response.statusText}`,
          baseURL: baseURL || 'unknown'
        };
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        available: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        baseURL: baseURL || 'unknown'
      };
    }
  }

  // Admin authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    console.log('Attempting admin login with:', { email, baseURL: this.axiosInstance.defaults.baseURL });
    
    try {
      console.log('Using confirmed admin login endpoint: /auth/admin/login');
      
      const response = await this.request<AuthResponse>('/auth/admin/login', {
        method: 'POST',
        requiresAuth: false,
        data: { email, password },
      });
      
      console.log('Admin login successful!', response);
      
      // Store token if login successful
      if (response.success && response.data?.accessToken) {
        this.setToken(response.data.accessToken);
        console.log('Token stored successfully');
      }

      return response;
      
    } catch (error) {
      console.error('Admin login failed:', error);
      return this.handleApiError<AuthResponse>(error as AxiosError);
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>('/auth/admin/logout', {
      method: 'POST',
    });
    
    // Clear token regardless of response
    this.clearToken();
    
    return response;
  }

  async getProfile(): Promise<ApiResponse<AdminUser>> {
    return this.request<AdminUser>('/admin/profile');
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/admin/refresh', {
      method: 'POST',
    });
  }

  // Dashboard endpoints
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    return this.request('/admin/dashboard/summary');
  }

  async getRecentActivities(params?: { 
    page?: number; 
    limit?: number; 
  }): Promise<ApiResponse<DashboardActivitiesResponse>> {
    return this.request('/admin/dashboard/recent-activities', { params });
  }

  async getLoanStats(): Promise<ApiResponse<LoanStats>> {
    return this.request('/admin/dashboard/loan-stats');
  }

  async getInvestmentStats(): Promise<ApiResponse<InvestmentStats>> {
    return this.request('/admin/dashboard/investment-stats');
  }

  async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    return this.request('/admin/system-health');
  }

  // User management endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    verified?: boolean;
    isActive?: boolean;
  }): Promise<ApiResponse<unknown>> {
    return this.request('/admin/users', {
      method: 'GET',
      params,
    });
  }

  async getUserById(id: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(id: string, data: unknown): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/users/${id}/status`, {
      method: 'PUT',
      data: { isActive },
    });
  }

  // Investment management endpoints
  async getInvestments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }): Promise<ApiResponse<unknown>> {
    return this.request('/admin/investments', {
      method: 'GET',
      params,
    });
  }

  async getInvestmentById(id: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/investments/${id}`);
  }

  async updateInvestmentStatus(id: string, status: string, notes?: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/investments/${id}/status`, {
      method: 'PUT',
      data: { status, notes },
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
    return this.request('/admin/loans', {
      method: 'GET',
      params,
    });
  }

  async getLoanById(id: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/loans/${id}`);
  }

  async updateLoanStatus(id: string, status: string, approvedAmount?: number, notes?: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/loans/${id}/status`, {
      method: 'PUT',
      data: { status, approvedAmount, notes },
    });
  }

  // Notification endpoints
  async getNotifications(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/notifications');
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async getUnreadNotificationCount(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/notifications/unread-count');
  }

  // Wallet management endpoints
  async getDeposits(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<unknown>> {
    return this.request('/admin/wallet/deposits', {
      method: 'GET',
      params,
    });
  }

  async getWithdrawals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<unknown>> {
    return this.request('/admin/wallet/withdrawals', {
      method: 'GET',
      params,
    });
  }

  async getPaymentChannels(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/wallet/payment-channels');
  }

  async processWithdrawal(id: string, approve: boolean, notes?: string, reference?: string): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/wallet/withdrawals/${id}/process`, {
      method: 'POST',
      data: { approve, notes, reference },
    });
  }

  async getWalletStats(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/wallet/stats');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;