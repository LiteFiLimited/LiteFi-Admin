import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  ApiResponse,
  SystemSettings,
  UpdateSystemSettingsRequest,
} from "./types";

interface RequestConfig {
  requiresAuth?: boolean;
}

class SettingsApiClient {
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
    console.error("Settings API request failed:", error);

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as {
        error?: { message?: string; details?: unknown };
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

  // Settings API Methods

  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<ApiResponse<SystemSettings>> {
    return this.request<SystemSettings>("/admin/settings", {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(
    data: UpdateSystemSettingsRequest
  ): Promise<ApiResponse<SystemSettings>> {
    return this.request<SystemSettings>("/admin/settings", {
      method: "PUT",
      data,
      requiresAuth: true,
    });
  }
}

// Create and export a singleton instance
const settingsApi = new SettingsApiClient();
export default settingsApi;
