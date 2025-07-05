import { useState, useEffect } from "react";
import { tripsService, type Trip } from "@/services/trips";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TripInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberId: string;
}

export default function TripInvitationModal({ 
  isOpen, 
  onClose, 
  memberName, 
  memberId 
}: TripInvitationModalProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMyTrips();
    }
  }, [isOpen]);

  const fetchMyTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripsService.getMyTrips();
      console.log("my trips response: ", response);
      
      // Handle case where API returns null or undefined
      if (!response) {
        setTrips([]);
        return;
      }
      
      // Handle nested structure { trips: [...] }
      let tripsArray: Trip[] = [];
      if (response.trips && Array.isArray(response.trips)) {
        tripsArray = response.trips;
      }
      
      console.log("trips array: ", tripsArray);
      
      // Filter out any invalid trips
      const validTrips = tripsArray.filter(trip => 
        trip && 
        trip.id && 
        trip.departureLoc && 
        trip.arrivalLoc
      );
      
      console.log("valid trips: ", validTrips);
      setTrips(validTrips);
    } catch (err: any) {
      console.error("Error fetching my trips:", err);
      
      // Provide more specific error messages based on error type
      let errorMessage = "Failed to load your trips";
      if (err?.response?.status === 401) {
        errorMessage = "Please log in to view your trips";
      } else if (err?.response?.status === 403) {
        errorMessage = "You don't have permission to view trips";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      } else if (err?.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteToTrip = async (tripId: string) => {
    setInviting(true);
    try {
      await tripsService.inviteToTrip(tripId, memberId);
      console.log(`Successfully invited ${memberName} to trip ${tripId}`);
      setInviteSuccess(true);
      
      // Close modal after showing success for 2 seconds
      setTimeout(() => {
        onClose();
        setInviteSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Error inviting to trip:", err);
      setError("Failed to send invitation. Please try again.");
    } finally {
      setInviting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid date';
    }
  };

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', dateTimeString, error);
      return 'Invalid time';
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Invite {memberName} to Trip</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          {loading && (
            <div className="text-center py-8">
              {/* Loading state icon */}
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-2">Loading your trips</h4>
              <p className="text-gray-500 text-sm">Please wait while we fetch your trips...</p>
            </div>
          )}

          {error && !inviteSuccess && (
            <div className="text-center py-8">
              {/* Error state icon */}
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-2">Unable to load trips</h4>
              <p className="text-red-500 text-sm mb-6 max-w-sm mx-auto">{error}</p>
              
              <div className="space-y-3">
                <button
                  onClick={fetchMyTrips}
                  className="w-full bg-black text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Try again
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!loading && !error && !inviteSuccess && trips.length === 0 && (
            <div className="text-center py-8">
              {/* Empty state icon */}
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-2">No trips available</h4>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                You haven't created any trips yet. Create a trip to invite {memberName} to join you on your journey.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/create-trip'}
                  className="w-full bg-black text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Create your first trip
                </button>
                
                <button
                  onClick={() => window.location.href = '/rides'}
                  className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Browse available trips
                </button>
              </div>
            </div>
          )}

          {inviteSuccess && (
            <div className="text-center py-8">
              {/* Success state icon */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-2">Invitation sent!</h4>
              <p className="text-gray-500 text-sm">Successfully invited {memberName} to your trip.</p>
            </div>
          )}

          {!loading && !error && !inviteSuccess && trips.length > 0 && (
            <div className="space-y-3">
              {trips.map((trip) => { console.log("tripData: ", trip); return(
                <div
                  key={trip.id}
                  className={`border border-gray-200 rounded-lg p-4 transition-colors cursor-pointer ${
                    inviting ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'
                  }`}
                  onClick={() => !inviting && handleInviteToTrip(trip.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">
                          {trip.departureLoc} → {trip.arrivalLoc}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          {formatDate(trip.departureDate)} at {formatTime(trip.departure_time || trip.departureDate)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {trip.seats_available} seats available • ${trip.price}
                        </p>
                        <p className="text-xs text-gray-600">
                          {trip.vehicle} • {trip.company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {trip.seats_available} seats
                      </span>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 