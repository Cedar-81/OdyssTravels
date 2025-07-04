import { apiService } from './api';

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyLoginData {
  email: string;
  password: string;
}

export interface CompanySignupData {
  name: string;
  email: string;
  password: string;
  company_name: string;
  company_email: string;
  company_cert: string; // base64 encoded certificate
}

export interface Vehicle {
  id: string;
  model: string;
  plate_number: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateVehicleData {
  model: string;
  plate_number: string;
  capacity: number;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateRouteData {
  origin: string;
  destination: string;
}

class CompanyService {
  // Company authentication
  async login(data: CompanyLoginData): Promise<{
    access_token: string;
    refresh_token: string;
    company: CompanyProfile;
  }> {
    return apiService.post('/company/login', data);
  }

  async signup(data: CompanySignupData): Promise<{
    access_token: string;
    refresh_token: string;
    company: CompanyProfile;
  }> {
    return apiService.post('/company/signup', data);
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('company_refresh_token');
    if (refreshToken) {
      return apiService.post('/company/logout', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
    }
  }

  async refreshToken(): Promise<{ access_token: string }> {
    const refreshToken = localStorage.getItem('company_refresh_token');
    if (refreshToken) {
      return apiService.post('/company/token/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
    }
    throw new Error('No company refresh token available');
  }

  // Company profile
  async getCompanyProfile(): Promise<CompanyProfile> {
    return apiService.get('/company/me');
  }

  // Vehicle management
  async getVehicles(): Promise<Vehicle[]> {
    return apiService.get<Vehicle[]>('/company/vehicles');
  }

  async addVehicle(data: CreateVehicleData): Promise<Vehicle> {
    return apiService.post<Vehicle>('/company/vehicles', data);
  }

  // Route management
  async getRoutes(): Promise<Route[]> {
    return apiService.get<Route[]>('/company/routes');
  }

  async createRoute(data: CreateRouteData): Promise<Route> {
    return apiService.post<Route>('/company/routes', data);
  }

  // Trip management (already covered in trips.ts but included here for completeness)
  async listTrips(): Promise<any[]> {
    return apiService.get('/company/trips');
  }

  async createTrip(data: any): Promise<any> {
    return apiService.post('/company/trips', data);
  }

  async updateTrip(tripId: string, data: any): Promise<any> {
    return apiService.patch(`/company/trips/${tripId}`, data);
  }

  async deleteTrip(tripId: string): Promise<void> {
    return apiService.delete(`/company/trips/${tripId}`);
  }

  // Booking management
  async getAllBookings(): Promise<any[]> {
    return apiService.get('/company/bookings');
  }

  // Company token management
  setCompanyTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('company_access_token', accessToken);
    localStorage.setItem('company_refresh_token', refreshToken);
  }

  getCompanyAccessToken(): string | null {
    return localStorage.getItem('company_access_token');
  }

  getCompanyRefreshToken(): string | null {
    return localStorage.getItem('company_refresh_token');
  }

  clearCompanyTokens(): void {
    localStorage.removeItem('company_access_token');
    localStorage.removeItem('company_refresh_token');
  }

  isCompanyAuthenticated(): boolean {
    return !!this.getCompanyAccessToken();
  }
}

export const companyService = new CompanyService(); 