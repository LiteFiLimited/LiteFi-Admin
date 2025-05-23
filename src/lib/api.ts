import { ApiResponse, AuthResponse } from './types';

// Base URL for API
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * API client for communicating with the backend
 */
export const api = {
  /**
   * Make a request to the API
   * @param endpoint API endpoint
   * @param options Fetch options
   * @returns Promise with the response data
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        credentials: 'include', // Include cookies for authentication
      });
      
      // Check if response exists before trying to parse JSON
      if (!response) {
        throw new Error('Network response was not received');
      }
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        return {
          success: false,
          error: 'Invalid response format',
        };
      }
      
      if (!response.ok) {
        return {
          success: false,
          error: data?.message || 'Something went wrong',
        };
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please try again.',
      };
    }
  },
  
  /**
   * Make a GET request to the API
   * @param endpoint API endpoint
   * @param options Fetch options
   * @returns Promise with the response data
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  },
  
  /**
   * Make a POST request to the API
   * @param endpoint API endpoint
   * @param data Request data
   * @param options Fetch options
   * @returns Promise with the response data
   */
  async post<T>(
    endpoint: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Make a PUT request to the API
   * @param endpoint API endpoint
   * @param data Request data
   * @param options Fetch options
   * @returns Promise with the response data
   */
  async put<T>(
    endpoint: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Make a DELETE request to the API
   * @param endpoint API endpoint
   * @param options Fetch options
   * @returns Promise with the response data
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
  
  /**
   * Login to the API
   * @param email User email
   * @param password User password
   * @returns Promise with the auth response
   */
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/admin/auth/login', { email, password });
  },
  
  /**
   * Logout from the API
   * @returns Promise with the response data
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.post<void>('/admin/auth/logout', {});
  },
}; 