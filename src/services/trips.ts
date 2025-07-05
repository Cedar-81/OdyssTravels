import { apiService } from './api';

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  seats_available: number;
  departureDate: string;
  departureLoc: string;
  arrivalLoc: string;
  days_left: number;
  seats: number;
  price: number;
  vehicle: string;
  memberIds: string[];
  users: Array<{avatar: string, first_name: string, last_name: string, name: string, id: string}>,
  company: string;
  departureTOD: string;
  creator: string;
  fill: boolean;
  vibes: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateTripData {
  departureLoc: string;
  arrivalLoc: string;
  departureDate: string;
  arrivalDate: string;
  seats: number;
  price: number;
  vehicle: string;
  memberIds: string[];
  company: string;
  departureTOD: string;
  creator: string;
  fill: boolean;
  vibes: string[];
  route_id: string;
}

export interface UpdateTripData {
  departureLoc?: string;
  arrivalLoc?: string;
  departureDate?: string;
  arrivalDate?: string;
  seats?: number;
  price?: number;
  vehicle?: string;
  memberIds?: string[];
  company?: string;
  departureTOD?: string;
  fill?: boolean;
  vibes?: string[];
}

export interface TripSearchParams {
  origin?: string;
  destination?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
}

export interface Seat {
  seat_number: string;
  is_available: boolean;
  passenger_name?: string;
}

export interface BookTripData {
  seat_number: number;
}

class TripsService {
  // Trip management
  async listTrips(): Promise<Trip[]> {
    return apiService.get<Trip[]>('/trips/');
  }

  async getTrip(tripId: string): Promise<Trip> {
    return apiService.get<Trip>(`/trips/${tripId}`);
  }

  async createTrip(data: CreateTripData): Promise<Trip> {
    return apiService.post<Trip>('/trips/', data);
  }

  async updateTrip(tripId: string, data: UpdateTripData): Promise<Trip> {
    return apiService.patch<Trip>(`/trips/${tripId}`, data);
  }

  async deleteTrip(tripId: string): Promise<void> {
    return apiService.delete(`/trips/${tripId}`);
  }

  async searchTrips(params: TripSearchParams): Promise<Trip[]> {
    return apiService.get<Trip[]>('/trips/search', params);
  }

  // Booking related
  async bookTrip(tripId: string, data: BookTripData): Promise<{ booking_id: string; message: string }> {
    return apiService.post(`/trips/${tripId}/book`, data);
  }

  async getTripSeats(tripId: string): Promise<Seat[]> {
    return apiService.get<Seat[]>(`/trips/${tripId}/seats`);
  }

  async getTripPassengers(tripId: string): Promise<Array<{
    id: string;
    first_name: string;
    last_name: string;
    seat_number: string;
    phone?: string;
  }>> {
    return apiService.get(`/trips/${tripId}/passengers`);
  }

  // User trips
  async getMyTrips(): Promise<{ trips: Trip[] }> {
    return apiService.get<{ trips: Trip[] }>('/users/my_trips');
  }

  async inviteToTrip(tripId: string, userId: string): Promise<{ message: string }> {
    return apiService.post(`/trips/${tripId}/invite`, { user_id: userId });
  }

  // Company trips (for company users)
  async listCompanyTrips(): Promise<Trip[]> {
    return apiService.get<Trip[]>('/company/trips');
  }

  async createCompanyTrip(data: CreateTripData): Promise<Trip> {
    return apiService.post<Trip>('/company/trips', data);
  }

  async updateCompanyTrip(tripId: string, data: UpdateTripData): Promise<Trip> {
    return apiService.patch<Trip>(`/company/trips/${tripId}`, data);
  }

  async deleteCompanyTrip(tripId: string): Promise<void> {
    return apiService.delete(`/company/trips/${tripId}`);
  }
}

export const tripsService = new TripsService(); 