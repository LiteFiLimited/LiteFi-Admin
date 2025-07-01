import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  AdminNotification,
  CreateNotificationRequest,
  NotificationCountResponse,
  NotificationsApiResponse,
} from "./types";

class NotificationsApi {
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
          console.log("Notifications API: Token attached to request");
        } else {
          console.warn("Notifications API: No token available for request");
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
            "Notifications API Error:",
            error.response?.data || error.message
          );
        }
        return Promise.reject(error);
      }
    );

    console.log("Notifications API Client initialized with baseURL:", baseURL);
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    console.log("Notifications API token set");
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    console.log("Notifications API token cleared");
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  /**
   * Create a new admin notification
   * POST /admin/notifications
   */
  async createNotification(
    data: CreateNotificationRequest
  ): Promise<NotificationsApiResponse> {
    try {
      console.log("Creating notification:", data);

      const response: AxiosResponse<AdminNotification> = await this.api.post(
        "/admin/notifications",
        data
      );

      console.log("Notification creation successful:", response.data);
      return {
        success: true,
        data: response.data,
        message: "Notification created successfully",
      };
    } catch (error: unknown) {
      console.error("Error creating notification:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Create notification endpoint not found");
        return {
          success: false,
          data: [],
          error:
            "Notification creation not available (endpoint not implemented)",
        };
      }

      return this.handleError(error, "Failed to create notification");
    }
  }

  // Helper method to check if error is an Axios error
  private isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
  }
  /**
   * Get all admin notifications for the current admin
   * GET /admin/notifications
   */
  async getNotifications(): Promise<NotificationsApiResponse> {
    try {
      // If no token, return default response
      if (!this.token) {
        console.warn("No authentication token available for notifications");
        return {
          success: true,
          data: [],
          message: "No notifications available (not authenticated)",
        };
      }

      console.log("Fetching notifications");

      const response: AxiosResponse<AdminNotification[]> = await this.api.get(
        "/admin/notifications"
      );

      console.log("Notifications fetch successful:", response.data);
      return {
        success: true,
        data: response.data,
        message: "Notifications retrieved successfully",
      };
    } catch (error: unknown) {
      console.error("Error fetching notifications:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Notifications endpoint not found, returning empty array");
        return {
          success: true,
          data: [],
          message: "No notifications available (endpoint not implemented)",
        };
      }

      // Check if it's an auth error
      if (this.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Authentication required for notifications");
        return {
          success: true,
          data: [],
          message: "No notifications available (authentication required)",
        };
      }

      return this.handleError(error, "Failed to fetch notifications");
    }
  }

  /**
   * Get unread notifications count
   * GET /admin/notifications/unread-count
   */
  async getUnreadCount(): Promise<NotificationsApiResponse> {
    try {
      // If no token, return default response
      if (!this.token) {
        console.warn("No authentication token available for notifications");
        return {
          success: true,
          data: { count: 0 },
          message: "No unread notifications (not authenticated)",
        };
      }

      console.log("Fetching unread notifications count");

      const response: AxiosResponse<NotificationCountResponse> =
        await this.api.get("/admin/notifications/unread-count");

      console.log("Unread count fetch successful:", response.data);
      return {
        success: true,
        data: response.data,
        message: "Unread count retrieved successfully",
      };
    } catch (error: unknown) {
      console.error("Error fetching unread count:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Unread count endpoint not found, returning 0");
        return {
          success: true,
          data: { count: 0 },
          message: "No unread notifications (endpoint not implemented)",
        };
      }

      // Check if it's an auth error
      if (this.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Authentication required for notifications");
        return {
          success: true,
          data: { count: 0 },
          message: "No unread notifications (authentication required)",
        };
      }

      return this.handleError(error, "Failed to fetch unread count");
    }
  }

  /**
   * Mark all notifications as read
   * PATCH /admin/notifications/mark-all-read
   */
  async markAllAsRead(): Promise<NotificationsApiResponse> {
    try {
      console.log("Marking all notifications as read");

      const response: AxiosResponse<NotificationCountResponse> =
        await this.api.patch("/admin/notifications/mark-all-read");

      console.log("Mark all as read successful:", response.data);
      return {
        success: true,
        data: response.data,
        message: "All notifications marked as read",
      };
    } catch (error: unknown) {
      console.error("Error marking all as read:", error);

      // Check if it's a 404 error (endpoint not implemented)
      if (this.isAxiosError(error) && error.response?.status === 404) {
        console.warn(
          "Mark all as read endpoint not found, returning success anyway"
        );
        return {
          success: true,
          data: { count: 0 },
          message: "Marked as read (endpoint not implemented)",
        };
      }

      return this.handleError(error, "Failed to mark all as read");
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(
    error: unknown,
    defaultMessage: string
  ): NotificationsApiResponse {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string; statusCode?: number };
          status?: number;
        };
      };

      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status;

      if (statusCode === 401) {
        return {
          success: false,
          data: [] as AdminNotification[],
          error: "Unauthorized: Please login again",
        };
      } else if (statusCode === 403) {
        return {
          success: false,
          data: [] as AdminNotification[],
          error:
            "Forbidden: You do not have permission to access notifications",
        };
      }

      const errorMessage =
        errorData?.message || errorData?.error || defaultMessage;
      return {
        success: false,
        data: [] as AdminNotification[],
        error: errorMessage,
      };
    } else if (error && typeof error === "object" && "request" in error) {
      return {
        success: false,
        data: [] as AdminNotification[],
        error: "Network error: Unable to connect to server",
      };
    } else {
      const errorMessage =
        error instanceof Error ? error.message : defaultMessage;
      return {
        success: false,
        data: [] as AdminNotification[],
        error: errorMessage,
      };
    }
  }
}

// Create and export a singleton instance
const notificationsApi = new NotificationsApi();
export default notificationsApi;
