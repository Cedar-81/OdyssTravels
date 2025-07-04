import { apiService } from './api';

export interface Circle {
  id: string;
  name: string;
  description?: string;
  departure: string;
  destination: string;
  startDate: string;
  endDate: string;
  users: string[];
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
    return apiService.get<Circle>(`/users/circles/${circleId}`);
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