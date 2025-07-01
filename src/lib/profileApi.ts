import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ProfileResponse, AdminProfile } from "./types";

class ProfileApi {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://litefi-backend-741585839791.us-central1.run.app";

    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "Profile API Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    console.log("Profile API token set");
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    console.log("Profile API token cleared");
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  /**
   * Get admin profile by ID
   * GET /admin/profile/{id}
   */
  async getProfile(adminId: string): Promise<ProfileResponse> {
    try {
      console.log(`Fetching profile for admin ID: ${adminId}`);

      const response: AxiosResponse<ProfileResponse> = await this.api.get(
        `/admin/profile/${adminId}`
      );

      console.log("Profile fetch successful:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);

      // Handle different error types
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string; error?: string } };
        };
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Failed to fetch profile";
        return {
          success: false,
          data: {} as AdminProfile,
          message: errorMessage,
        };
      } else if (error && typeof error === "object" && "request" in error) {
        return {
          success: false,
          data: {} as AdminProfile,
          message: "Network error: Unable to connect to server",
        };
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        return {
          success: false,
          data: {} as AdminProfile,
          message: errorMessage,
        };
      }
    }
  }
}

// Create and export a singleton instance
const profileApi = new ProfileApi();
export default profileApi;
