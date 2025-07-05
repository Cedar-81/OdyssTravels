import { apiService } from './api';

export interface PaymentInitiationData {
  booking_id: string;
  payment_method: 'paystack';
}

export interface TripPaymentData {
  departureLoc: string;
  arrivalLoc: string;
  departureDate: string;
  arrivalDate: string;
  seats: number;
  price: number;
  vehicle: string;
  company: string;
  departureTOD: string;
  creator: string;
  email: string;
}

export interface JoinTripPaymentData {
  trip_id: string;
  email: string;
}

export interface PaymentVerificationData {
  reference: string;
  booking_id?: string;
}

export interface TripPaymentVerificationData {
  reference: string;
  trip: {
    departureLoc: string;
    arrivalLoc: string;
    departureDate: string;
    arrivalDate: string;
    seats: number;
    price: number;
    vehicle: string;
    company: string;
    departureTOD: string;
    creator: string;
  };
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  reference: string;
  payment_method: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

class PaymentsService {
  // Payment configuration
  async getPaystackPublicKey(): Promise<{ public_key: string }> {
    return apiService.get('/payments/paystack-public-key');
  }

  // Payment initiation deprecated
  async initiatePayment(data: PaymentInitiationData): Promise<{
    authorization_url: string;
    reference: string;
    access_code: string;
  }> {
    return apiService.post('/payments/initiate', data);
  }

  async initiateTripPayment(data: TripPaymentData): Promise<{
    authorization_url: string;
    reference: string;
    access_code: string;
    booking_id: string;
  }> {
    return apiService.post('/payments/initiate-trip', data);
  }

  async joinTripPayment(data: JoinTripPaymentData): Promise<{
    authorization_url?: string;
    reference: string;
    access_code?: string;
    message: string;
  }> {
    return apiService.post('/payments/join-trip', data);
  }

  // Payment verification
  async verifyPayment(data: PaymentVerificationData): Promise<{
    status: 'success' | 'failed';
    message: string;
    transaction_details?: Record<string, any>;
  }> {
    return apiService.post('/payments/verify', data);
  }

  async verifyTripPayment(data: TripPaymentVerificationData): Promise<{
    status: string;
    message: string;
    booking_id: string;
    trip_details?: Record<string, any>;
  }> {
    return apiService.post('/payments/verify-trip', data);
  }

  async verifyJoinTripPayment(data: { reference: string }): Promise<{
    status: string;
    message: string;
    booking_id: string;
    trip_id: string;
    seat_number: string;
    booking_status: string;
  }> {
    return apiService.post('/payments/verify-join-trip', data);
  }

  // Payment history
  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    return apiService.get('/payments/history');
  }
}

export const paymentsService = new PaymentsService(); 