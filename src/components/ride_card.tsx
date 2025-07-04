import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { Trip } from "@/services/trips";

interface RideCardProps {
  trip: Trip;
  onJoin: (trip: Trip) => void;
}

export default function RideCard({ trip, onJoin }: RideCardProps) {
    // Helper to format date to '08 May, 2025' and time to 'hh:mm am/pm' from a timestamp
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
    const departure = formatDateTime(trip.departureDate);
    const arrival = formatDateTime(trip.arrival_time);

    let isMember = false;
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('odyss_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          isMember = Array.isArray(trip.memberIds) && trip.memberIds.includes(user.id);
        } catch {}
      }
    }
    return(
        <div className="bg-black/5 rounded-xl flex flex-col overflow-clip p-6 gap-7">
            <div className="flex gap-16 justify-between">
                <div className="flex items-center gap-2 font-medium">
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-5 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                        {/* Show up to 3 avatars from trip.users */}
                        {trip.users.slice(0, 3).map((user, idx) => {
                          const initials = ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase();
                          return (
                            <Avatar className="size-8 rounded-full overflow-clip" key={idx}>
                              {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.name} />
                              ) : null}
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                          );
                        })}
                    </div>  

                    {/* Truncate name to 5 chars + ... if longer */}
                    <h2 className="text-sm">
                      {trip.users.length > 0 && (
                        trip.users.length > 1
                          ? `${trip.users[0].name.length > 5 ? trip.users[0].name.slice(0, 5) + '...' : trip.users[0].name} and ${trip.users.length - 1} others`
                          : (trip.users[0].name.length > 5 ? trip.users[0].name.slice(0, 5) + '...' : trip.users[0].name)
                      )}
                    </h2>
                </div>
                
                <button 
                  className="text-sm cursor-pointer rounded-full bg-black text-white px-5 py-1"
                  onClick={() => onJoin(trip)}
                >{isMember ? 'View' : 'Join'}</button>
            </div>

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


                    <div className="flex text-xs items-center justify-between w-full"><h3 className="text-sm font-medium">{trip.arrivalLoc}</h3> <p>{arrival.date} {arrival.time}</p></div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs"><h3 className="font-medium">{trip.company}</h3> <p><span className="font-medium">Vehicle: </span> {trip.vehicle}</p></div>
        
            <div className="flex justify-between">
                <div className="flex flex-col items-center">
                    <h4 className="font-medium">N{trip.price.toLocaleString()}</h4>
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
        </div>
    )
}