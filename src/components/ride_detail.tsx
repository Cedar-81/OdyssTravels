import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { tripsService, type Trip } from "@/services/trips";
import { getTripError } from "../utils/errorHandling";
import clsx from "clsx";
import ReadyPayment from "./ready_payment";
import { jwtDecode } from 'jwt-decode';

interface RideDetailProps {
  tripId: string;
  onClose: () => void;
}

export default function RideDetail({ tripId, onClose }: RideDetailProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    tripsService.getTrip(tripId)
      .then((trip) => {
        setTrip(trip);
        console.log('Fetched trip in RideDetail:', trip);
      })
      .catch((err) => setError(getTripError(err)))
      .finally(() => setLoading(false));
  }, [tripId]);

  // Prevent scroll on body when sidebar is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Helper to format date/time to '13 July, 2025 10AM'
  function formatDateTime(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: undefined, hour12: true }).replace(':00', '').replace(' ', '');
  }

  function getUserIdFromLocalStorage() {
    if (typeof window === 'undefined') return '';
    const userStr = localStorage.getItem('odyss_user');
    if (!userStr) return '';
    try {
      const user = JSON.parse(userStr);
      return user.id || '';
    } catch {
      return '';
    }
  }

  function getUserEmailFromLocalStorage() {
    if (typeof window === 'undefined') return '';
    const userStr = localStorage.getItem('odyss_user');
    if (!userStr) return '';
    try {
      const user = JSON.parse(userStr);
      return user.email || '';
    } catch {
      return '';
    }
  }

  function isUserMember() {
    if (!trip) return false;
    const userId = getUserIdFromLocalStorage();
    return Array.isArray(trip.memberIds) && trip.memberIds.includes(userId);
  }

  function isAccessTokenValid() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const exp = decoded && typeof decoded === 'object' ? decoded.exp : undefined;
      if (!exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return exp > now;
    } catch {
      return false;
    }
  }

  // Handle copying the shareable link
  const handleInviteOthers = async () => {
    const shareableLink = `${window.location.origin}/rides?trip_id=${tripId}`;
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopySuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Silently fail for copy errors - no need to show error to user
    }
  };

  // Prevent scroll propagation
  const handleScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <section className="shadow-2xl fixed w-[22rem] top-0 right-0 h-screen z-50 bg-white flex items-center justify-center">
        <div>Loading ride details...</div>
      </section>
    );
  }
  if (error || !trip) {
    return (
      <section className="shadow-2xl fixed w-[22rem] top-0 right-0 h-screen z-50 bg-white flex items-center justify-center">
        <div className="text-red-500">{error || "Ride not found."}</div>
      </section>
    );
  }

  return(
        <section 
          className="shadow-2xl fixed w-[22rem] top-0 right-0 h-full z-50 bg-white flex flex-col overflow-hidden"
          onWheel={handleScroll}
        >
            <div className="px-3 py-6 h-[10rem] border space-y-4 rounded-b-xl shadow-xl flex-shrink-0">
                <div className="flex gap-2 items-center">
                    <svg className="h-5 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
                        <path d="M15.375 5.25L8.625 12L15.375 18.75" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3 className="font-semibold">Selected Ride</h3>
                </div>
                <div className="px-3">
                    <div className="flex items-center gap-2">
                        <svg width="9" className="ml-1" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4.5" cy="4.5" r="4.5" fill="black"/>
                        </svg>
                        <div className="flex text-xs items-center justify-between w-full"><h3 className="text-sm font-medium">{trip.origin}</h3> <p>{formatDateTime(trip.departure_time)}</p></div>
                    </div>
                    <svg className="ml-2" width="2" height="20" viewBox="0 0 2 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="4.37114e-08" x2="0.999999" y2="33" stroke="black" strokeWidth="2" strokeDasharray="6 6"/>
                    </svg>
                    <div className="flex items-center gap-2">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.9401 14.7458C16.5156 13.1695 17.4007 11.0321 17.4007 8.8034C17.4007 6.57474 16.5156 4.4373 14.9401 2.861C14.1601 2.08089 13.2341 1.46208 12.2149 1.03988C11.1957 0.617691 10.1033 0.400391 9.00013 0.400391C7.89696 0.400391 6.80458 0.617691 5.78539 1.03988C4.7662 1.46208 3.84015 2.08089 3.06013 2.861C1.48464 4.4373 0.599609 6.57474 0.599609 8.8034C0.599609 11.0321 1.48464 13.1695 3.06013 14.7458L4.88533 16.5446L7.33693 18.9266L7.49653 19.0682C8.42653 19.8218 9.78853 19.7738 10.6645 18.9266L13.5865 16.0826L14.9401 14.7458ZM9.00013 12.3998C8.04535 12.3998 7.12968 12.0205 6.45455 11.3454C5.77942 10.6703 5.40013 9.75458 5.40013 8.7998C5.40013 7.84502 5.77942 6.92934 6.45455 6.25421C7.12968 5.57908 8.04535 5.1998 9.00013 5.1998C9.95491 5.1998 10.8706 5.57908 11.5457 6.25421C12.2208 6.92934 12.6001 7.84502 12.6001 8.7998C12.6001 9.75458 12.2208 10.6703 11.5457 11.3454C10.8706 12.0205 9.95491 12.3998 9.00013 12.3998Z" fill="black"/>
                        </svg>
                        <div className="flex text-xs items-center justify-between w-full"><h3 className="text-sm font-medium">{trip.destination}</h3> <p>{formatDateTime(trip.arrival_time)}</p></div>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="font-medium">Travel buddies</h2>
                        <div className="flex flex-col px-2 gap-3">
                            {trip.users.length === 0 && <div className="text-xs text-gray-400">No travel buddies yet.</div>}
                            {trip.users.map((user) => {
                              const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
                              return (
                                <div className="flex gap-2 items-center" key={user.id}>
                                  <Avatar className="size-5">
                                    {user.avatar ? (
                                      <AvatarImage src={user.avatar} alt={user.first_name + ' ' + user.last_name} />
                                    ) : null}
                                    <AvatarFallback>{initials}</AvatarFallback>
                                  </Avatar>
                                  <p className="text-xs">{user.first_name} {user.last_name}</p>
                                </div>
                              );
                            })}
                        </div>

                        <div className="w-full flex justify-end">
                            <button 
                                className={`text-xs border border-black rounded-full cursor-pointer px-5 py-1 transition-colors duration-200 ${
                                    copySuccess ? 'bg-green-500 text-white border-green-500' : 'hover:bg-black hover:text-white'
                                }`}
                                onClick={handleInviteOthers}
                            >
                                {copySuccess ? 'Copied!' : 'invite others'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-medium">Smart fill policy</h2>

                        <div className="flex flex-col px-2 gap-5">
                            <div className="flex justify-between items-center">
                                <p className="text-xs">Split the Remaining Cost</p>
                                <svg className={clsx("h-3", trip.fill ? "hidden" : "")} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.273438 8.93973L4.0001 12.6664L4.9401 11.7197L1.2201 7.99973M14.8268 3.71973L7.77344 10.7797L5.0001 7.99973L4.04677 8.93973L7.77344 12.6664L15.7734 4.66639M12.0001 4.66639L11.0601 3.71973L6.82677 7.95306L7.77344 8.89306L12.0001 4.66639Z" fill="black"/>
                                </svg>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs">Allow Offline Fill-In</p>
                                <svg className={clsx("h-3", trip.fill ? "" : "hidden")}width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.273438 8.93973L4.0001 12.6664L4.9401 11.7197L1.2201 7.99973M14.8268 3.71973L7.77344 10.7797L5.0001 7.99973L4.04677 8.93973L7.77344 12.6664L15.7734 4.66639M12.0001 4.66639L11.0601 3.71973L6.82677 7.95306L7.77344 8.89306L12.0001 4.66639Z" fill="black"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-medium">Refund Eligibility</h2>

                        <div className="flex flex-col px-2 gap-5">
                            <div className="flex gap-4">
                                <svg className="h-1 mt-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="black"/>
                                </svg>

                                <p className="text-xs">You are eligible for a full refund if you cancel your booking at least 3 days (72 hours) before the scheduled trip date.</p>
                            </div>
                            <div className="flex gap-4">
                                <svg className="h-1 mt-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="black"/>
                                </svg>

                                <p className="text-xs">Refunds will be processed within 5–7 business days to your original payment method.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-5 pb-4 px-4 space-y-4 flex-shrink-0">
                <div className="flex items-center justify-between text-sm"><h3 className="font-medium">{trip.company}</h3> <p><span className="font-medium capitalize">Vehicle: </span> {trip.vehicle}</p></div>
            
                <div className="flex justify-between">
                    <div className="flex flex-col items-center">
                        <h4 className="font-medium">N{trip.price}</h4>
                        <p className="text-sm">per seat</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <h4 className="font-medium">{trip.seats_available} seats</h4>
                        <p className="text-sm">available</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <h4 className="font-medium">{trip.days_left}</h4>
                        <p className="text-sm">left to trip</p>
                    </div>
                </div>   

                <div className="flex justify-center">
                  <button
                    className={`border-0 disabled:bg-gray-300 cursor-pointer text-center w-full rounded-full py-3 transition-colors duration-200 ${isUserMember() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                    onClick={() => {
                      if (!isAccessTokenValid() || !localStorage.getItem('odyss_user')) {
                        window.location.href = '/login';
                        return;
                      }
                      setShowPayment(true);
                    }}
                    disabled={isUserMember() || trip.id == "096c5dfa-d17d-467c-b554-eb2a889af8f4"}
                  > 
                    Book trip
                  </button>
                </div>
            </div>
            {/* Payment Modal */}
            {showPayment && (
              <div className="fixed inset-0 z-[999] flex pt-[8rem] justify-center bg-black/40">
                <div className="relative animate-in fade-in-0 zoom-in-95 duration-300 transition-all ease-out">
                  <button className="absolute top-2 right-2 text-2xl cursor-pointer font-bold text-black bg-white rounded-full px-2 z-10" onClick={() => setShowPayment(false)}>&times;</button>
                  <ReadyPayment tripId={trip.id} email={getUserEmailFromLocalStorage()} />
                </div>
              </div>
            )}
        </section>
    )
}