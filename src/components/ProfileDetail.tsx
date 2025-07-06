import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { usersService, type UserProfile } from "@/services/users";
import { bookingsService, type Booking } from "@/services/bookings";
import { tripsService, type Trip } from "@/services/trips";

interface ProfileDetailProps {
  onClose: () => void;
}

export default function ProfileDetail({ onClose }: ProfileDetailProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [_loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [tripsLoading, setTripsLoading] = useState(true);

  // Prevent scroll on body when sidebar is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    usersService.getMyProfile()
      .then((data) => { 
        if (isMounted) { 
          console.log("📋 User profile:", data); 
          setProfile(data); 
          setLoading(false); 
        } 
      })
      .catch((err) => {
        console.error("❌ Error fetching profile:", err);
        // fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('odyss_user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              
              setProfile({
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                nickname: user.nickname || user.name || user.first_name || '',
                avatar: user.profile_pic || user.avatar || undefined,
              } as UserProfile);
            } catch(err) {
              console.error("❌ Profile detail error:", err)
            }
          }
        }
        setLoading(false);
      });

    // Fetch user's bookings
    bookingsService.getUserBookings()
      .then((data) => {
        if (isMounted) {
          console.log("🎫 User bookings:", data);
          setBookings(data);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching bookings:", err);
      })
      .finally(() => {
        if (isMounted) setBookingsLoading(false);
      });

    // Fetch all trips and filter for user's trips
    tripsService.listTrips()
      .then((data) => {
        if (isMounted) {
          console.log("🚗 All trips:", data);
          // Get current user ID
          const userStr = localStorage.getItem('odyss_user');
          const user = userStr ? JSON.parse(userStr) : null;
          const userId = user?.id;
          
          if (userId) {
            // Handle both old format (array) and new format ({ trips: Trip[] })
            const trips = Array.isArray(data) ? data : data.trips;
            
            // Filter trips where user is a member or creator
            const userTrips = trips.filter(trip => 
              trip.memberIds.includes(userId) || trip.creator === userId
            );
            
            // Filter for trips that haven't happened yet (departure date is in the future)
            const futureTrips = userTrips.filter(trip => {
              const departureDate = new Date(trip.departureDate);
              const now = new Date();
              return departureDate > now;
            });
            
            console.log("🎯 User's future trips:", futureTrips);
            setUserTrips(futureTrips);
          }
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching trips:", err);
      })
      .finally(() => {
        if (isMounted) setTripsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      console.log("🗑️ Cancelling booking:", bookingId);
      await bookingsService.cancelBooking(bookingId);
      // Remove the cancelled booking from state
      setBookings(prev => prev.filter(booking => booking.booking.booking_id !== bookingId));
      console.log("✅ Booking cancelled successfully");
    } catch (err) {
      console.error("❌ Error cancelling booking:", err);
    }
  };

  // Helper to format date to '08 May, 2025' and time to 'hh:mm am/pm'
  function formatDateTime(dateStr: string) {
    if (!dateStr) return { date: '', time: '' };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { date: dateStr, time: '' };
    return {
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  }

  // Prevent scroll propagation
  const handleScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  let avatarUrl = profile?.avatar || undefined;
  let initials = 'U';
  let displayName = profile?.nickname || profile?.first_name || 'User';
  let fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
  if (profile) {
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    initials = (first + last).toUpperCase() || 'U';
  }

  return (
    <section 
      className="shadow-2xl space-y-6 fixed w-[22rem] top-0 right-0 h-screen z-50 bg-white flex flex-col overflow-hidden"
      onWheel={handleScroll}
    >
      <div className="px-4 py-4 h-min max-h-[7.5rem] border-b space-y-4 rounded-b-xl border-black/60 flex items-start justify-between flex-shrink-0">
        <div className="flex gap-3 items-start">
          <Avatar className="size-10">
            <AvatarImage src={avatarUrl} alt={initials} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="">
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-xs text-gray-500">{fullName}</p>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <button onClick={onClose} className="text-xl cursor-pointer font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 15l6-6m-4-3l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11"/></svg>
          </button>
          <button onClick={onClose} className="text-xl cursor-pointer font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"/></g></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {/* Tickets Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="font-medium">Tickets</h2>
              <h4 className="text-xs font-medium text-black/40">Active</h4>
            </div>
            
            <div className="space-y-3">
              {bookingsLoading ? (
                <div className="text-center py-4 text-sm text-gray-500">Loading tickets...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">No active tickets</div>
              ) : (
                bookings.map((booking) => {
                  console.log('🎫 Booking details:', booking);
                  const departure = formatDateTime(booking.trip?.departure_time || '');
                  const trip = booking.trip;
                  
                  if (!trip) {
                    console.warn('⚠️ Booking missing trip data:', booking);
                    return null;
                  }
                  
                  return (
                    <div key={booking.booking.booking_id} className="bg-black/5 rounded-xl p-4 space-y-5">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Trip #{booking.booking.booking_id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            booking.booking.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            booking.booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.booking.status}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleCancelBooking(booking.booking.booking_id)}
                          className="text-xs text-red-600 hover:text-red-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <svg width="9" className="ml-1" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4.5" cy="4.5" r="4.5" fill="black"/>
                          </svg>
                          <div className="flex text-xs items-center justify-between w-full">
                            <h3 className="text-sm font-medium">{trip.origin}</h3>
                            <p>{departure.date}, {departure.time}</p>
                          </div>
                        </div>
                        <svg className="ml-2" width="2" height="20" viewBox="0 0 2 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="1" y1="4.37114e-08" x2="0.999999" y2="33" stroke="black" stroke-width="2" stroke-dasharray="6 6"/>
                        </svg>
                        <div className="flex items-center gap-2">
                          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9401 14.7458C16.5156 13.1695 17.4007 11.0321 17.4007 8.8034C17.4007 6.57474 16.5156 4.4373 14.9401 2.861C14.1601 2.08089 13.2341 1.46208 12.2149 1.03988C11.1957 0.617691 10.1033 0.400391 9.00013 0.400391C7.89696 0.400391 6.80458 0.617691 5.78539 1.03988C4.7662 1.46208 3.84015 2.08089 3.06013 2.861C1.48464 4.4373 0.599609 6.57474 0.599609 8.8034C0.599609 11.0321 1.48464 13.1695 3.06013 14.7458L4.88533 16.5446L7.33693 18.9266L7.49653 19.0682C8.42653 19.8218 9.78853 19.7738 10.6645 18.9266L13.5865 16.0826L14.9401 14.7458ZM9.00013 12.3998C8.04535 12.3998 7.12968 12.0205 6.45455 11.3454C5.77942 10.6703 5.40013 9.75458 5.40013 8.7998C5.40013 7.84502 5.77942 6.92934 6.45455 6.25421C7.12968 5.57908 8.04535 5.1998 9.00013 5.1998C9.95491 5.1998 10.8706 5.57908 11.5457 6.25421C12.2208 6.92934 12.6001 7.84502 12.6001 8.7998C12.6001 9.75458 12.2208 10.6703 11.5457 11.3454C10.8706 12.0205 9.95491 12.3998 9.00013 12.3998Z" fill="black"/>
                          </svg>
                          <div className="flex text-xs items-center justify-between w-full">
                            <h3 className="text-sm font-medium">{trip.destination}</h3>
                            <p>{departure.date} {departure.time}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <h3 className="font-medium">Seat {booking.booking.seat_number}</h3>
                        <p><span className="font-medium">Vehicle: </span> {trip.vehicle}</p>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                          <h4 className="font-medium text-xs">N{trip.price.toLocaleString()}</h4>
                          <p className="text-xs">per seat</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="font-medium text-xs">{trip.seats_available} seats</h4>
                          <p className="text-xs">available</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="font-medium text-xs">-</h4>
                          <p className="text-xs">days left</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Trips Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="font-medium">Upcoming Trips</h2>
              <h4 className="text-xs font-medium text-black/40">Future</h4>
            </div>
            
            <div className="space-y-3">
              {tripsLoading ? (
                <div className="text-center py-4 text-sm text-gray-500">Loading trips...</div>
              ) : userTrips.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">No upcoming trips</div>
              ) : (
                userTrips.map((trip) => {
                  const departure = formatDateTime(trip.departureDate);
                  const arrival = formatDateTime(trip.arrival_time);
                  
                  return (
                    <div key={trip.id} className="bg-black/5 rounded-xl p-4 space-y-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <svg width="9" className="ml-1" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4.5" cy="4.5" r="4.5" fill="black"/>
                          </svg>
                          <div className="flex text-xs items-center justify-between w-full">
                            <h3 className="text-sm font-medium">{trip.departureLoc}</h3>
                            <p>{departure.date}, {departure.time}</p>
                          </div>
                        </div>
                        <svg className="ml-2" width="2" height="20" viewBox="0 0 2 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="1" y1="4.37114e-08" x2="0.999999" y2="33" stroke="black" stroke-width="2" stroke-dasharray="6 6"/>
                        </svg>
                        <div className="flex items-center gap-2">
                          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9401 14.7458C16.5156 13.1695 17.4007 11.0321 17.4007 8.8034C17.4007 6.57474 16.5156 4.4373 14.9401 2.861C14.1601 2.08089 13.2341 1.46208 12.2149 1.03988C11.1957 0.617691 10.1033 0.400391 9.00013 0.400391C7.89696 0.400391 6.80458 0.617691 5.78539 1.03988C4.7662 1.46208 3.84015 2.08089 3.06013 2.861C1.48464 4.4373 0.599609 6.57474 0.599609 8.8034C0.599609 11.0321 1.48464 13.1695 3.06013 14.7458L4.88533 16.5446L7.33693 18.9266L7.49653 19.0682C8.42653 19.8218 9.78853 19.7738 10.6645 18.9266L13.5865 16.0826L14.9401 14.7458ZM9.00013 12.3998C8.04535 12.3998 7.12968 12.0205 6.45455 11.3454C5.77942 10.6703 5.40013 9.75458 5.40013 8.7998C5.40013 7.84502 5.77942 6.92934 6.45455 6.25421C7.12968 5.57908 8.04535 5.1998 9.00013 5.1998C9.95491 5.1998 10.8706 5.57908 11.5457 6.25421C12.2208 6.92934 12.6001 7.84502 12.6001 8.7998C12.6001 9.75458 12.2208 10.6703 11.5457 11.3454C10.8706 12.0205 9.95491 12.3998 9.00013 12.3998Z" fill="black"/>
                          </svg>
                          <div className="flex text-xs items-center justify-between w-full">
                            <h3 className="text-sm font-medium">{trip.arrivalLoc}</h3>
                            <p>{arrival.date} {arrival.time}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <h3 className="font-medium">{trip.company}</h3>
                        <p><span className="font-medium">Vehicle: </span> {trip.vehicle}</p>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                          <h4 className="font-medium text-xs">N{trip.price.toLocaleString()}</h4>
                          <p className="text-xs">per seat</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="font-medium text-xs">{trip.seats_available} seats</h4>
                          <p className="text-xs">available</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="font-medium text-xs">{trip.days_left}</h4>
                          <p className="text-xs">left to trip</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 