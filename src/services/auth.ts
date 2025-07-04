import { apiService } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  password: string;
  bio?: string;
  phone_number?: string;
  profile_pic?: string;
  intro_video?: string;
  date_of_birth?: string;
  vibes?: string[];
  access_code: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface GoogleOAuthData {
  id_token: string;
}

export interface PasswordResetData {
  email: string;
  new_password: string;
  token?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface AuthResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
  }
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    nickname: string;
    bio?: string;
    phone_number?: string;
    profile_pic?: string;
    intro_video?: string;
    date_of_birth?: string;
    vibes?: string[];
  };
}

class AuthService {
  // User authentication
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('odyss_user', JSON.stringify(response.user));
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('odyss_user', JSON.stringify(response.user));
    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return apiService.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
    }
  }

  async refreshToken(): Promise<{ access_token: string }> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return apiService.post('/auth/token/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
    }
    throw new Error('No refresh token available');
  }

  // OTP and password management
  async requestOTP(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/request-otp', { email });
  }

  async verifyOTP(data: OTPData): Promise<{ message: string }> {
    return apiService.post('/auth/verify-otp', data);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(data: PasswordResetData): Promise<{ message: string }> {
    return apiService.post('/auth/reset-password', data);
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiService.post('/auth/change-password', data);
  }

  // OAuth
  async googleOAuth(data: GoogleOAuthData): Promise<AuthResponse> {
    return apiService.post('/auth/oauth/google', data);
  }

  // Token management
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService(); 