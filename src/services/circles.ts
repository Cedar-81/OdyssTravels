import { apiService } from './api';
import axios from 'axios';

// Public API service for unauthenticated requests
const publicApiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://server.odyss.ng',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CircleUser {
  id: string;
  avatar?: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname?: string;
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  users: CircleUser[];
  created_at?: string;
  updated_at?: string;
  members?: CircleMember[];
}

export interface CircleMember {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  joined_at: string;
  is_creator: boolean;
}

export interface CreateCircleData {
  name: string;
  description?: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  users: string[];
}

export interface CircleSearchParams {
  departure?: string;
  destination?: string;
}

class CirclesService {
  // Circle management
  async getAllCircles(): Promise<Circle[]> {
    return apiService.get<Circle[]>('/users/circles');
  }

  async getMyCircles(): Promise<Circle[]> {
    return apiService.get<Circle[]>('/users/my_circles');
  }

  async getCircleDetails(circleId: string): Promise<Circle> {
    try {
      // First try with authenticated request
      console.log("🔐 Trying authenticated request for circle:", circleId);
      return await apiService.get<Circle>(`/users/circles/${circleId}`);
    } catch (error: any) {
      console.log("❌ Authenticated request failed:", error.response?.status, error.response?.data);
      // If 401 (unauthorized), try with public request
      if (error.response?.status === 401) {
        console.log("🔓 Trying public access for circle:", circleId);
        try {
          const response = await publicApiService.get<Circle>(`/users/circles/${circleId}`);
          console.log("✅ Public access successful");
          return response.data;
        } catch (publicError: any) {
          console.log("❌ Public access also failed:", publicError.response?.status, publicError.response?.data);
          throw publicError;
        }
      }
      throw error;
    }
  }

  async createCircle(data: CreateCircleData): Promise<Circle> {
    return apiService.post<Circle>('/users/circle', data);
  }

  async joinCircle(circleId: string): Promise<{ message: string }> {
    return apiService.post(`/users/circle/${circleId}/join`);
  }

  // Circle search and recommendations
  async searchCircles(params: CircleSearchParams): Promise<Circle[]> {
    return apiService.get<Circle[]>('/users/circles/search', params);
  }

  async getRecommendedCircles(): Promise<Circle[]> {
    return apiService.get<Circle[]>('/users/circles/recommended');
  }

  // Auto-grouping and waitlist features
  async autoGroupCircles(): Promise<{ message: string }> {
    return apiService.post('/users/auto_group_circles');
  }

  async previewWaitlistGroups(): Promise<Array<{
    group_id: string;
    member_count: number;
    members: Array<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
    }>;
  }>> {
    return apiService.get('/users/circles/preview-waitlist');
  }

  async createCirclesFromWaitlist(): Promise<{ message: string; circles_created: Circle[] }> {
    return apiService.post('/users/circles/create-from-waitlist');
  }
}

export const circlesService = new CirclesService(); 