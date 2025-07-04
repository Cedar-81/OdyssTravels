import { apiService } from './api';

export interface Booking {
  id: string;
  trip_id: string;
  user_id: string;
  passenger_count: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  seat_numbers: string[];
  passenger_details: Array<{
    first_name: string;
    last_name: string;
    phone?: string;
  }>;
  created_at: string;
  updated_at: string;
  trip?: {
    origin: string;
    destination: string;
    departure_time: string;
    company_name: string;
  };
}

export interface CreateBookingData {
  trip_id: string;
  passenger_count: number;
  seat_numbers?: string[];
  passenger_details?: Array<{
    first_name: string;
    last_name: string;
    phone?: string;
  }>;
}

class BookingsService {
  // User bookings
  async getUserBookings(): Promise<Booking[]> {
    return apiService.get<Booking[]>('/bookings/');
  }

  async cancelBooking(bookingId: string): Promise<{ message: string }> {
    return apiService.delete(`/bookings/${bookingId}`);
  }

  // Company bookings (for company users)
  async getCompanyBookings(): Promise<Booking[]> {
    return apiService.get<Booking[]>('/company/bookings');
  }

  // Trip passengers (for trip details)
  async getTripPassengers(tripId: string): Promise<Array<{
    id: string;
    first_name: string;
    last_name: string;
    seat_number: string;
    phone?: string;
    booking_id: string;
  }>> {
    return apiService.get(`/bookings/${tripId}/passengers`);
  }
}

export const bookingsService = new BookingsService(); 