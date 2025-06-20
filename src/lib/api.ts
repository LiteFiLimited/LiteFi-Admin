import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, AuthResponse, AdminUser } from './types';

interface RequestConfig {
  requiresAuth?: boolean;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Use environment variable for backend URL with localhost as fallback for development
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    
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
      return this.handleApiError<T>(error as AxiosError);
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

  // Auth endpoints - Updated with better debugging and endpoint detection
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    console.log('Attempting login with:', { email, baseURL: this.axiosInstance.defaults.baseURL });
    
    // Try different possible login endpoints based on your API documentation
    const possibleEndpoints = [
      '/auth/login',        // Backend confirmed endpoint 
      '/admin/auth/login',  // Alternative admin login endpoint
      '/auth/admin/login',  // Alternative admin endpoint
      '/admin/login',       // Simple admin login
    ];
    
    let lastError: unknown = null;
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying login endpoint: ${endpoint}`);
        
        const response = await this.request<AuthResponse>(endpoint, {
          method: 'POST',
          requiresAuth: false,
          data: { email, password },
        });
        
        console.log(`Login endpoint ${endpoint} worked!`, response);
        
        // Store token if login successful
        if (response.success && response.data?.token) {
          this.setToken(response.data.token);
          console.log('Token stored successfully');
        }

        return response;
        
      } catch (error) {
        console.log(`Login endpoint ${endpoint} failed:`, error);
        lastError = error;
        continue; // Try next endpoint
      }
    }
    
    // If all endpoints failed, return the last error
    console.error('All login endpoints failed. Last error:', lastError);
    return this.handleApiError<AuthResponse>(lastError as AxiosError);
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
  async getDashboardSummary(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/dashboard/summary');
  }

  async getRecentActivities(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/dashboard/recent-activities');
  }

  async getLoanStats(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/dashboard/loan-stats');
  }

  async getInvestmentStats(): Promise<ApiResponse<unknown>> {
    return this.request('/admin/dashboard/investment-stats');
  }

  async getSystemHealth(): Promise<ApiResponse<unknown>> {
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
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;