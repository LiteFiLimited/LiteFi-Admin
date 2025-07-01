import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  ApiResponse,
  Deposit,
  Withdrawal,
  PaymentChannel,
  DepositStatus,
  WithdrawalStatus,
  Pagination,
} from "./types";

interface RequestConfig {
  requiresAuth?: boolean;
}

class WalletApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Use environment variable for backend URL
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

    // For successful responses, return the data field
    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  }

  private handleApiError<T>(error: AxiosError): ApiResponse<T> {
    console.error("Wallet API request failed:", error);

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

  private async request<T>(
    endpoint: string,
    options: RequestConfig & {
      method?: string;
      data?: unknown;
      params?: unknown;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { method = "GET", data, params } = options;

      const config: {
        method: string;
        data?: unknown;
        params?: unknown;
      } = {
        method,
      };

      if (data) {
        config.data = data;
      }

      if (params) {
        config.params = params;
      }

      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        ...config,
      });

      return this.handleApiResponse<T>(response);
    } catch (error) {
      return this.handleApiError<T>(error as AxiosError);
    }
  }

  // Public methods for token management
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

  // Wallet API Methods

  /**
   * Get all deposits with pagination, search, and filtering capabilities
   */
  async getDeposits(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: DepositStatus;
  }): Promise<ApiResponse<{ deposits: Deposit[]; pagination: Pagination }>> {
    // Clean up params to only include defined values, excluding limit to avoid backend issues
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .filter(([key]) => key !== "limit") // Remove limit parameter as it's causing backend issues
            .map(([key, value]) => {
              // Ensure page is a number
              if (key === "page") {
                return [key, Number(value)];
              }
              return [key, value];
            })
        )
      : undefined;

    return this.request<{ deposits: Deposit[]; pagination: Pagination }>(
      "/admin/wallet/deposits",
      {
        method: "GET",
        params: cleanParams,
        requiresAuth: true,
      }
    );
  }

  /**
   * Get all withdrawals with pagination, search, and filtering capabilities
   */
  async getWithdrawals(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: WithdrawalStatus;
  }): Promise<
    ApiResponse<{ withdrawals: Withdrawal[]; pagination: Pagination }>
  > {
    // Clean up params to only include defined values, excluding limit to avoid backend issues
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .filter(([key]) => key !== "limit") // Remove limit parameter as it's causing backend issues
            .map(([key, value]) => {
              // Ensure page is a number
              if (key === "page") {
                return [key, Number(value)];
              }
              return [key, value];
            })
        )
      : undefined;

    return this.request<{ withdrawals: Withdrawal[]; pagination: Pagination }>(
      "/admin/wallet/withdrawals",
      {
        method: "GET",
        params: cleanParams,
        requiresAuth: true,
      }
    );
  }

  /**
   * Get all payment channels
   */
  async getPaymentChannels(): Promise<
    ApiResponse<{ paymentChannels: PaymentChannel[] }>
  > {
    return this.request<{ paymentChannels: PaymentChannel[] }>(
      "/admin/wallet/payment-channels",
      {
        method: "GET",
        requiresAuth: true,
      }
    );
  }

  /**
   * Process a withdrawal request (approve or reject)
   */
  async processWithdrawal(
    id: string,
    data: {
      approve: boolean;
      notes?: string;
    }
  ): Promise<ApiResponse<Withdrawal>> {
    return this.request<Withdrawal>(`/admin/wallet/withdrawals/${id}/process`, {
      method: "POST",
      data,
      requiresAuth: true,
    });
  }
}

// Create and export a singleton instance
const walletApi = new WalletApiClient();
export default walletApi;
