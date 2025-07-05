import { apiService } from './api';

export interface TripInBooking {
  trip_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  departure_tod: string;
  price: number;
  seats: number;
  seats_available: number;
  status: string;
  vehicle: string;
  fill: boolean;
  memberIds: string[];
  vibes: string[];
  creator: string;
  created_at: string;
  updated_at: string;
}


export interface Booking {
  booking: {
    booking_id: string;
    user_id: string;
    seat_number: number;
    status: string; // e.g. "paid"
    created_at: string;
  }
  trip: TripInBooking;
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