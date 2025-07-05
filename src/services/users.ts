import { apiService } from './api';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  bio?: string;
  phone_number?: string;
  avatar?: string;
  intro_video?: string;
  date_of_birth?: string;
  vibes?: string[];
  x?: string;
  fb?: string;
  tiktok?: string;
  insta?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  nickname?: string;
  bio?: string;
  avatar?: string;
  intro_video?: string;
  x?: string;
  fb?: string;
  tiktok?: string;
  insta?: string;
}

export interface Company {
  id: string;
  company_name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  is_verified: boolean;
  created_at: string;
}

export interface CompanyRoute {
  id: string;
  origin: string;
  dep_time: string;
  destination: string;
  company_id: string;
  price: number;
  terminal?: string;
  vehicles?: string[];
}

export interface CompanyVehicle {
  id: string;
  type: string;
  plate_number: string;
  capacity: number;
  company_id: string;
  company_name: string;
  is_active: boolean;
  created_at: string;
}

export interface UploadFileData {
  file: File;
  type: 'avatar' | 'intro_video';
}

class UsersService {
  // User profile management
  async getMyProfile(): Promise<UserProfile> {
    return apiService.get<UserProfile>('/users/me');
  }

  async updateMyProfile(data: UpdateProfileData): Promise<UserProfile> {
    return apiService.put<UserProfile>('/users/me', data);
  }

  async uploadFile(data: UploadFileData): Promise<{ file_url: string; message: string }> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('type', data.type);
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/users/upload-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
    
    return response.json();
  }

  // User listing (admin only)
  async listUsers(): Promise<UserProfile[]> {
    return apiService.get<UserProfile[]>('/users/');
  }

  // Company data (for trip booking)
  async getAllCompanies(): Promise<Company[]> {
    const companies = await apiService.get<Company[]>('/users/companies');
    console.log('Fetched companies:', companies);
    return companies;
  }

  async getAllCompanyRoutes(): Promise<CompanyRoute[]> {
    return apiService.get<CompanyRoute[]>('/users/company_routes');
  }

  async getAllCompanyVehicles(): Promise<CompanyVehicle[]> {
    return apiService.get<CompanyVehicle[]>('/users/company_vehicles');
  }
}

export const usersService = new UsersService(); 