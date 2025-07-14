import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  ProfileResponse,
  ApiResponse,
  User,
  UsersResponse,
  UserResponse,
  UserFilters,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UserLoansResponse,
  BulkUserOperation,
  BulkOperationResponse,
  AdminUser,
  AdminsResponse,
  AdminResponse,
  CreateAdminRequest,
  UpdateAdminRequest,
  UpdateAdminStatusRequest,
} from "./types";

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
          console.log("Profile API: Token attached to request");
        } else {
          console.warn("Profile API: No token available for request");
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
        // Only log meaningful errors, not empty objects
        if (error.response?.data || error.message) {
          console.error(
            "Profile API Error:",
            error.response?.data || error.message
          );
        }
        return Promise.reject(error);
      }
    );

    console.log("Profile API Client initialized with baseURL:", baseURL);
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

  // Helper method to check if error is an Axios error
  private isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
  }

  /**
   * Handle API errors consistently
   */
  private handleError<T>(
    error: unknown,
    defaultMessage: string
  ): ApiResponse<T> {
    if (this.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data as
        | { message?: string; error?: string }
        | undefined;

      if (statusCode === 401) {
        return {
          success: false,
          error: "Unauthorized: Please login again",
        };
      } else if (statusCode === 403) {
        return {
          success: false,
          error: "Forbidden: You do not have permission to perform this action",
        };
      } else if (statusCode === 404) {
        return {
          success: false,
          error: "Resource not found",
        };
      }

      const errorMessage =
        errorData?.message || errorData?.error || defaultMessage;
      return {
        success: false,
        error: errorMessage,
      };
    } else if (error && typeof error === "object" && "request" in error) {
      return {
        success: false,
        error: "Network error: Unable to connect to server",
      };
    } else {
      const errorMessage =
        error instanceof Error ? error.message : defaultMessage;
      return {
        success: false,
        error: errorMessage,
      };
    }
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
      return this.handleError(
        error,
        "Failed to fetch profile"
      ) as ProfileResponse;
    }
  }

  /**
   * Get all users with pagination and filters
   * GET /admin/users
   */
  async getUsers(
    filters: UserFilters = {}
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      console.log("Fetching users with filters:", filters);

      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);
      if (filters.verified !== undefined)
        params.append("verified", filters.verified.toString());
      if (filters.isActive !== undefined)
        params.append("isActive", filters.isActive.toString());

      const response: AxiosResponse<{
        success: boolean;
        data: UsersResponse;
        message: string;
      }> = await this.api.get(`/admin/users?${params.toString()}`);

      console.log("Users fetch successful:", response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Users retrieved successfully",
      };
    } catch (error: unknown) {
      console.error("Error fetching users:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Users endpoint not found, returning empty list");
        return {
          success: true,
          data: {
            users: [],
            pagination: { total: 0, page: 1, limit: 10, pages: 0 },
          },
          message: "No users available (endpoint not implemented)",
        };
      }

      return this.handleError(error, "Failed to fetch users");
    }
  }

  /**
   * Get user by ID with detailed information
   * GET /admin/users/{id}
   */
  async getUserById(userId: string): Promise<ApiResponse<UserResponse>> {
    try {
      console.log(`Fetching user details for ID: ${userId}`);

      const response: AxiosResponse<{
        success: boolean;
        data: User;
        message: string;
      }> = await this.api.get(`/admin/users/${userId}`);

      console.log("User details fetch successful:", response.data);
      return {
        success: true,
        data: { user: response.data.data },
        message: response.data.message || "User retrieved successfully",
      };
    } catch (error: unknown) {
      console.error("Error fetching user details:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("User details endpoint not found");
        return {
          success: false,
          error: "User not found or endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to fetch user details");
    }
  }

  /**
   * Update user information
   * PUT /admin/users/{id}
   */
  async updateUser(
    userId: string,
    data: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    try {
      console.log(`Updating user ${userId}:`, data);

      const response: AxiosResponse<{
        success: boolean;
        data: User;
        message: string;
      }> = await this.api.put(`/admin/users/${userId}`, data);

      console.log("User update successful:", response.data);
      return {
        success: true,
        data: { user: response.data.data },
        message: response.data.message || "User updated successfully",
      };
    } catch (error: unknown) {
      console.error("Error updating user:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Update user endpoint not found");
        return {
          success: false,
          error: "Update user endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to update user");
    }
  }

  /**
   * Update user status (activate/deactivate)
   * PUT /admin/users/{id}/status
   */
  async updateUserStatus(
    userId: string,
    isActive: boolean
  ): Promise<ApiResponse<UserResponse>> {
    try {
      console.log(
        `Updating user ${userId} status to: ${isActive ? "active" : "inactive"}`
      );

      const data: UpdateUserStatusRequest = { isActive };
      const response: AxiosResponse<{
        success: boolean;
        data: User;
        message: string;
      }> = await this.api.put(`/admin/users/${userId}/status`, data);

      console.log("User status update successful:", response.data);
      return {
        success: true,
        data: { user: response.data.data },
        message: response.data.message || "User status updated successfully",
      };
    } catch (error: unknown) {
      console.error("Error updating user status:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Update user status endpoint not found");
        return {
          success: false,
          error: "Update user status endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to update user status");
    }
  }

  /**
   * Get user loans
   * GET /admin/users/{id}/loans
   */
  async getUserLoans(userId: string): Promise<ApiResponse<UserLoansResponse>> {
    try {
      console.log(`Fetching loans for user ID: ${userId}`);

      const response: AxiosResponse<{
        success: boolean;
        data: UserLoansResponse["loans"];
        message: string;
      }> = await this.api.get(`/admin/users/${userId}/loans`);

      console.log("User loans fetch successful:", response.data);
      return {
        success: true,
        data: { loans: response.data.data },
        message: response.data.message || "User loans retrieved successfully",
      };
    } catch (error: unknown) {
      console.error("Error fetching user loans:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("User loans endpoint not found, returning empty array");
        return {
          success: true,
          data: { loans: [] },
          message: "No loans available (endpoint not implemented)",
        };
      }

      return this.handleError(error, "Failed to fetch user loans");
    }
  }

  /**
   * Safe delete user (deactivate instead of hard delete)
   * DELETE /admin/users/{id}/safe-delete
   */
  async safeDeleteUser(
    userId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      console.log(`Safe deleting user ID: ${userId}`);

      const response: AxiosResponse<{ success: boolean; message: string }> =
        await this.api.delete(`/admin/users/${userId}/safe-delete`);

      console.log("User safe delete successful:", response.data);
      return {
        success: true,
        data: { message: response.data.message },
        message: response.data.message || "User safely deleted",
      };
    } catch (error: unknown) {
      console.error("Error safe deleting user:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Safe delete user endpoint not found");
        return {
          success: false,
          error: "Safe delete user endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to safely delete user");
    }
  }

  /**
   * Bulk user operations
   * POST /admin/users/bulk
   */
  async bulkUserOperations(
    operation: BulkUserOperation
  ): Promise<ApiResponse<BulkOperationResponse>> {
    try {
      console.log("Performing bulk user operation:", operation);

      const response: AxiosResponse<{
        success: boolean;
        data: BulkOperationResponse;
        message: string;
      }> = await this.api.post("/admin/users/bulk", operation);

      console.log("Bulk user operation successful:", response.data);
      return {
        success: true,
        data: response.data.data,
        message:
          response.data.message || "Bulk operation completed successfully",
      };
    } catch (error: unknown) {
      console.error("Error performing bulk user operation:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Bulk user operations endpoint not found");
        return {
          success: false,
          error: "Bulk user operations endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to perform bulk user operation");
    }
  }

  /**
   * Get all admin users
   * GET /admin/roles/admins
   */
  async getAdmins(): Promise<ApiResponse<AdminsResponse>> {
    try {
      // If no token, return default response
      if (!this.token) {
        console.warn("No authentication token available for admin management");
        return {
          success: true,
          data: { admins: [] },
          message: "No admins available (not authenticated)",
        };
      }

      console.log("Fetching admin users");

      const response: AxiosResponse<{
        success: boolean;
        data: AdminUser[];
        message: string;
      }> = await this.api.get("/admin/roles/admins");

      console.log("Admins fetch successful:", response.data);
      return {
        success: true,
        data: { admins: response.data.data },
        message: response.data.message || "Admins retrieved successfully",
      };
    } catch (error: unknown) {
      console.error("Error fetching admins:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Admins endpoint not found, returning empty list");
        return {
          success: true,
          data: { admins: [] },
          message: "No admins available (endpoint not implemented)",
        };
      }

      // Check if it's an auth error
      if (this.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Authentication required for admin management");
        return {
          success: true,
          data: { admins: [] },
          message: "No admins available (authentication required)",
        };
      }

      return this.handleError(error, "Failed to fetch admins");
    }
  }

  /**
   * Create a new admin user
   * POST /admin/roles/admins
   */
  async createAdmin(
    data: CreateAdminRequest
  ): Promise<ApiResponse<AdminResponse>> {
    try {
      // If no token, return error
      if (!this.token) {
        console.warn("No authentication token available for admin creation");
        return {
          success: false,
          error: "Authentication required to create admin users",
        };
      }

      console.log("Creating admin user:", { ...data, password: "[REDACTED]" });

      const response: AxiosResponse<{
        success: boolean;
        data: AdminUser;
        message: string;
      }> = await this.api.post("/admin/roles/admins", data);

      console.log("Admin creation successful:", response.data);
      return {
        success: true,
        data: { admin: response.data.data },
        message: response.data.message || "Admin created successfully",
      };
    } catch (error: unknown) {
      console.error("Error creating admin:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Create admin endpoint not found");
        return {
          success: false,
          error: "Create admin endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to create admin");
    }
  }

  /**
   * Update an admin user
   * PUT /admin/roles/admins/{id}
   */
  async updateAdmin(
    adminId: string,
    data: UpdateAdminRequest
  ): Promise<ApiResponse<AdminResponse>> {
    try {
      // If no token, return error
      if (!this.token) {
        console.warn("No authentication token available for admin update");
        return {
          success: false,
          error: "Authentication required to update admin users",
        };
      }

      console.log(`Updating admin ${adminId}:`, data);

      const response: AxiosResponse<{
        success: boolean;
        data: AdminUser;
        message: string;
      }> = await this.api.put(`/admin/roles/admins/${adminId}`, data);

      console.log("Admin update successful:", response.data);
      return {
        success: true,
        data: { admin: response.data.data },
        message: response.data.message || "Admin updated successfully",
      };
    } catch (error: unknown) {
      console.error("Error updating admin:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Update admin endpoint not found");
        return {
          success: false,
          error: "Update admin endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to update admin");
    }
  }

  /**
   * Toggle admin status (activate/deactivate)
   * PUT /admin/roles/admins/{id}/status
   */
  async updateAdminStatus(
    adminId: string,
    isActive: boolean
  ): Promise<ApiResponse<AdminResponse>> {
    try {
      // If no token, return error
      if (!this.token) {
        console.warn(
          "No authentication token available for admin status update"
        );
        return {
          success: false,
          error: "Authentication required to update admin status",
        };
      }

      console.log(
        `Updating admin ${adminId} status to: ${
          isActive ? "active" : "inactive"
        }`
      );

      const data: UpdateAdminStatusRequest = { isActive };
      const response: AxiosResponse<{
        success: boolean;
        data: AdminUser;
        message: string;
      }> = await this.api.put(`/admin/roles/admins/${adminId}/status`, data);

      console.log("Admin status update successful:", response.data);
      return {
        success: true,
        data: { admin: response.data.data },
        message: response.data.message || "Admin status updated successfully",
      };
    } catch (error: unknown) {
      console.error("Error updating admin status:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Update admin status endpoint not found");
        return {
          success: false,
          error: "Update admin status endpoint not implemented",
        };
      }

      return this.handleError(error, "Failed to update admin status");
    }
  }
}

// Create and export a singleton instance
const profileApi = new ProfileApi();
export default profileApi;
