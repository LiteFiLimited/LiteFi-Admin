import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  ApiResponse,
  Loan,
  LoansResponse,
  LoanProduct,
  LoanProductsResponse,
  UpdateLoanStatusRequest,
  ManualRepaymentRequest,
  BulkRepaymentRequest,
  BulkRepaymentResponse,
  CreateLoanProductRequest,
  UpdateLoanProductRequest,
  BulkLoanOperationRequest,
  BulkLoanOperationResponse,
  LoanStatus,
  LoanType,
  PaymentMethod,
} from "./types";

interface RequestConfig {
  requiresAuth?: boolean;
}

class LoanApiClient {
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
    console.error("Loan API request failed:", error);

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

      const response = await this.axiosInstance.request({
        url: endpoint,
        ...config,
      });

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

  // Loan API Methods

  /**
   * Get all loans with pagination, search, and filtering capabilities
   */
  async getLoans(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: LoanStatus;
    type?: LoanType;
  }): Promise<ApiResponse<LoansResponse>> {
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

    return this.request<LoansResponse>("/admin/loans", {
      method: "GET",
      params: cleanParams,
      requiresAuth: true,
    });
  }

  /**
   * Get detailed information about a specific loan
   */
  async getLoanById(id: string): Promise<ApiResponse<Loan>> {
    return this.request<Loan>(`/admin/loans/${id}`, {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Update the status of a loan (approve, reject, activate, etc.)
   */
  async updateLoanStatus(
    id: string,
    data: UpdateLoanStatusRequest
  ): Promise<
    ApiResponse<{
      id: string;
      status: LoanStatus;
      approvedAmount?: number;
      startDate?: string;
      maturityDate?: string;
    }>
  > {
    return this.request<{
      id: string;
      status: LoanStatus;
      approvedAmount?: number;
      startDate?: string;
      maturityDate?: string;
    }>(`/admin/loans/${id}/status`, {
      method: "PUT",
      data,
      requiresAuth: true,
    });
  }

  /**
   * Record a manual loan repayment
   */
  async recordManualRepayment(data: ManualRepaymentRequest): Promise<
    ApiResponse<{
      id: string;
      loanId: string;
      amount: number;
      paymentMethod: PaymentMethod;
      reference: string;
      status: string;
      paidAt: string;
      notes?: string;
    }>
  > {
    return this.request<{
      id: string;
      loanId: string;
      amount: number;
      paymentMethod: PaymentMethod;
      reference: string;
      status: string;
      paidAt: string;
      notes?: string;
    }>("/admin/loans/manual-repayment", {
      method: "POST",
      data,
      requiresAuth: true,
    });
  }

  /**
   * Process multiple loan repayments at once
   */
  async processBulkRepayments(
    data: BulkRepaymentRequest
  ): Promise<ApiResponse<BulkRepaymentResponse>> {
    return this.request<BulkRepaymentResponse>("/admin/loans/repayments/bulk", {
      method: "POST",
      data,
      requiresAuth: true,
    });
  }

  /**
   * Get all available loan products
   */
  async getLoanProducts(): Promise<ApiResponse<LoanProductsResponse>> {
    return this.request<LoanProductsResponse>("/admin/loans/products", {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Create a new loan product
   */
  async createLoanProduct(
    data: CreateLoanProductRequest
  ): Promise<ApiResponse<LoanProduct>> {
    return this.request<LoanProduct>("/admin/loans/products", {
      method: "POST",
      data,
      requiresAuth: true,
    });
  }

  /**
   * Update an existing loan product
   */
  async updateLoanProduct(
    id: string,
    data: UpdateLoanProductRequest
  ): Promise<ApiResponse<LoanProduct>> {
    return this.request<LoanProduct>(`/admin/loans/products/${id}`, {
      method: "PUT",
      data,
      requiresAuth: true,
    });
  }

  /**
   * Perform bulk operations on multiple loans
   */
  async bulkLoanOperation(
    data: BulkLoanOperationRequest
  ): Promise<ApiResponse<BulkLoanOperationResponse>> {
    return this.request<BulkLoanOperationResponse>("/admin/loans/bulk", {
      method: "POST",
      data,
      requiresAuth: true,
    });
  }
}

const loanApi = new LoanApiClient();
export default loanApi;
