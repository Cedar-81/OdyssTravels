import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server.odyss.ng';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        // Debug log
        // console.log('Attaching access token:', token);
        if (config.headers) {
          if (typeof config.headers.set === 'function') {
            // AxiosHeaders instance
            if (token) {
              config.headers.set('Authorization', `Bearer ${token}`);
            } else {
              config.headers.delete('Authorization');
            }
          } else {
            // Plain object fallback
            if (token) {
              (config.headers as any)['Authorization'] = `Bearer ${token}`;
            } else {
              delete (config.headers as any)['Authorization'];
            }
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post(`${API_BASE_URL}/auth/token/refresh`, {
              refresh_token: refreshToken,
            });
            localStorage.setItem('access_token', response.data.access_token);
            if (originalRequest.headers) {
              if (typeof originalRequest.headers.set === 'function') {
                originalRequest.headers.set('Authorization', `Bearer ${response.data.access_token}`);
              } else {
                (originalRequest.headers as any)['Authorization'] = `Bearer ${response.data.access_token}`;
              }
            }
            return this.api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService(); 