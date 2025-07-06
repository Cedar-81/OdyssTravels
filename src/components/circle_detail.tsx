import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Circle } from "@/services/circles";
import { circlesService } from "@/services/circles";
import { tripsService, type Trip } from "@/services/trips";
import TripInvitationModal from "./trip_invitation_modal";
import { updateSEO, formatCircleSEO } from "@/utils/seo";

interface CircleDetailProps {
  circle: Circle;
  onClose: () => void;
}

export default function CircleDetail({ circle, onClose }: CircleDetailProps)  {
    const [copySuccess, setCopySuccess] = useState(false);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<{ name: string; id: string; email: string } | null>(null);
    const [memberTripsModalOpen, setMemberTripsModalOpen] = useState(false);
    const [memberTrips, setMemberTrips] = useState<Trip[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(false);

    // Prevent scroll on body when sidebar is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Update SEO when circle detail is opened
    useEffect(() => {
        if (circle) {
            const seoData = formatCircleSEO(circle);
            updateSEO(seoData);
        }
    }, [circle]);

    // Helper to get user initials
    const getUserInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    // Get current user from localStorage to check if they're already a member
    const getCurrentUserId = () => {
        if (typeof window === 'undefined') return '';
        const userStr = localStorage.getItem('odyss_user');
        if (!userStr) return '';
        try {
            const user = JSON.parse(userStr);
            return user.id || '';
        } catch {
            return '';
        }
    };

    // Handle copying the shareable link
    const handleInviteOthers = async () => {
        const shareableLink = `${window.location.origin}/circles?circle_id=${circle.id}`;
        
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

    // Handle opening invite to trip modal
    const handleInviteToTrip = (memberName: string, memberId: string, memberEmail: string) => {
        setSelectedMember({ name: memberName, id: memberId, email: memberEmail });
        setInviteModalOpen(true);
    };

    // Helper to get member email
    const getMemberEmail = (memberId: string, _memberName: string) => {
        // First try to find in circle.users array
        const user = circle.users?.find(u => u.id === memberId);
        if (user?.email) {
            return user.email;
        }
        
        // If not found in users, try to find in members and get email from users
        const member = circle.members?.find(m => m.user_id === memberId);
        if (member) {
            const user = circle.users?.find(u => 
                u.first_name === member.first_name && u.last_name === member.last_name
            );
            if (user?.email) {
                return user.email;
            }
        }
        
        // Fallback - return empty string if no email found
        return '';
    };

    // Handle closing invite modal
    const handleCloseInviteModal = () => {
        setInviteModalOpen(false);
        setSelectedMember(null);
    };

    // Handle viewing member trips
    const handleViewMemberTrips = async () => {
        setLoadingTrips(true);
        setMemberTripsModalOpen(true);
        
        try {
            // Get all trips
            const allTrips = await tripsService.listTrips();
            
            // Get circle member IDs
            const memberIds = circle.users?.map(user => user.id) || 
                            circle.members?.map(member => member.user_id) || [];
            
            // Filter trips that:
            // 1. Are created by circle members
            // 2. Fall within the circle's date range
            // const circleStartDate = new Date(circle.startDate);
            // const circleEndDate = new Date(circle.endDate);
            
            const relevantTrips = allTrips.trips.filter(trip => {
                // const tripDate = new Date(trip.departureDate);
                const isByMember = memberIds.includes(trip.creator);
                // const isInDateRange = tripDate >= circleStartDate && tripDate <= circleEndDate;
                
                return isByMember;
            });
            
            console.log("🚗 Member trips found:", relevantTrips);
            setMemberTrips(relevantTrips);
        } catch (err) {
            console.error("❌ Error fetching member trips:", err);
        } finally {
            setLoadingTrips(false);
        }
    };

    // Handle closing member trips modal
    const handleCloseMemberTripsModal = () => {
        setMemberTripsModalOpen(false);
        setMemberTrips([]);
    };

    // Handle joining circle
    const handleJoinCircle = async () => {
        if (!isLoggedIn()) {
            // Store circle_id in localStorage and redirect to login
            localStorage.setItem('redirect_circle', circle.id);
            console.log("🔐 Stored circle_id and redirecting to login:", circle.id);
            window.location.href = '/login';
            return;
        }

        try {
            await circlesService.joinCircle(circle.id);
            // Refresh the page to show updated member status
            window.location.reload();
        } catch (err) {
            console.error('Failed to join circle:', err);
            // You could add a toast notification here
        }
    };

    // Prevent scroll propagation
    const handleScroll = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    const currentUserId = getCurrentUserId();
    const isCurrentUserMember = circle.users?.some(user => user.id === currentUserId) || 
                               circle.members?.some(member => member.user_id === currentUserId);
    const isLoggedIn = () => {
        if (typeof window === 'undefined') return false;
        const userStr = localStorage.getItem('odyss_user');
        const accessToken = localStorage.getItem('access_token');
        console.log("🔍 CircleDetail auth check - user:", !!userStr, "token:", !!accessToken);
        // Allow access if user exists, even if token is missing (token might be expired)
        return !!userStr;
    };

    return(
        <section 
            className="shadow-2xl space-y-6 fixed w-[22rem] top-0 right-0 h-full z-50 bg-white flex flex-col overflow-hidden"
            onWheel={handleScroll}
        >
            <div className="px-3 py-6 h-[7.5rem] border space-y-4 rounded-b-xl shadow-xl flex-shrink-0">
                <div className="flex gap-2">
                    <svg className="h-5 mt-4 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
                        <path d="M15.375 5.25L8.625 12L15.375 18.75" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex gap-2 items-center">
                        <div className="hidden w-[3.4rem] h-[3.5rem]">
                            <Avatar className="size-8 ">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar className="size-8 -left-3">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar className="size-8 -left-13 -bottom-5">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs">{circle.departure} → {circle.destination}</p>
                            <h3>{circle.name}</h3>
                            {/* <p className="text-xs">2nd July 2025 - 13th July 2025</p> */}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-6">
                    <p className="text-sm text-black/60">{circle.description}</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">Members</h2>
                            <button 
                                className="text-xs border border-black rounded-full cursor-pointer px-3 py-1 hover:bg-black hover:text-white transition-colors"
                                onClick={handleViewMemberTrips}
                            >
                                view trips by members
                            </button>
                        </div>
                        <div className="flex flex-col px-2 gap-3">
                            {circle.users && circle.users.length > 0 ? (
                                circle.users.map((user) => {
                                    const initials = getUserInitials(user.first_name, user.last_name);
                                    return (
                                        <div className="flex gap-2 items-center justify-between" key={user.id}>
                                            <div className="flex gap-2 items-center">
                                                <Avatar className="size-5">
                                                    {user.avatar ? (
                                                        <AvatarImage src={user.avatar} alt={user.first_name + ' ' + user.last_name} />
                                                    ) : null}
                                                    <AvatarFallback>{initials}</AvatarFallback>
                                                </Avatar>
                                                <p className="text-xs">{user.first_name} {user.last_name}</p>
                                            </div>
                                            {user.id !== currentUserId && isCurrentUserMember && (
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="text-xs border border-black rounded-full cursor-pointer px-3 py-1 hover:bg-black hover:text-white transition-colors"
                                                        onClick={() => handleInviteToTrip(`${user.first_name} ${user.last_name}`, user.id, user.email)}
                                                    >
                                                        invite to trip
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : circle.members && circle.members.length > 0 ? (
                                circle.members.map((member) => {
                                    const initials = getUserInitials(member.first_name, member.last_name);
                                    return (
                                        <div className="flex gap-2 items-center justify-between" key={member.id}>
                                            <div className="flex gap-2 items-center">
                                                <Avatar className="size-5">
                                                    <AvatarFallback>{initials}</AvatarFallback>
                                                </Avatar>
                                                <p className="text-xs">{member.first_name} {member.last_name}</p>
                                            </div>
                                            {member.user_id !== currentUserId && isCurrentUserMember && (
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="text-xs border border-black rounded-full cursor-pointer px-3 py-1 hover:bg-black hover:text-white transition-colors"
                                                        onClick={() => handleInviteToTrip(`${member.first_name} ${member.last_name}`, member.user_id, getMemberEmail(member.user_id, `${member.first_name} ${member.last_name}`))}
                                                    >
                                                        invite to trip
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-xs text-gray-400">No members yet.</div>
                            )}
                        </div>

                        {isCurrentUserMember && (
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
                        )}
                    </div>

                    {/* Member Trips Section */}
                    {/* <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">Member Trips</h2>
                            <button 
                                className="text-xs border border-black rounded-full cursor-pointer px-3 py-1 hover:bg-black hover:text-white transition-colors"
                                onClick={handleViewMemberTrips}
                            >
                                View Trips
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            See trips created by circle members within the circle's date range
                        </p>
                    </div> */}
                </div>
            </div>

            <div className="border-t pt-5 pb-4 px-4 space-y-4 flex-shrink-0">
                <div className="flex justify-center">
                    <button 
                        className={`border-0 cursor-pointer text-center w-full rounded-full py-3 transition-colors duration-200 ${
                            isCurrentUserMember 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                        disabled={isCurrentUserMember}
                        onClick={handleJoinCircle}
                    >
                        {isCurrentUserMember ? 'Already Joined' : (isLoggedIn() ? 'Join' : 'Login to Join')}
                    </button>
                </div>
            </div>

            {/* Trip Invitation Modal */}
            {inviteModalOpen && selectedMember && (
                <TripInvitationModal
                    isOpen={inviteModalOpen}
                    onClose={handleCloseInviteModal}
                    memberName={selectedMember.name}
                    memberId={selectedMember.id}
                    memberEmail={selectedMember.email}
                    circleId={circle.id}
                    circleName={circle.name}
                />
            )}

            {/* Member Trips Modal */}
            {memberTripsModalOpen && (
                <div className="fixed inset-0 bg-black/40 shadow-xl bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Member Trips</h3>
                            <button 
                                onClick={handleCloseMemberTripsModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {loadingTrips ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                                <p className="text-sm text-gray-500 mt-2">Loading trips...</p>
                            </div>
                        ) : memberTrips.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">Circle members have not created any trips yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {memberTrips.map((trip) => {
                                    const tripDate = new Date(trip.departureDate);
                                    const formattedDate = tripDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });
                                    
                                    return (
                                        <div key={trip.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm">{trip.departureLoc} → {trip.arrivalLoc}</h4>
                                                <span className="text-xs text-gray-500">{formattedDate}</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                <span>Vehicle: {trip.vehicle}</span>
                                                <span>Available seats: {trip.seats_available}/{trip.seats}</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">₦{trip.price.toLocaleString()}</span>
                                                <button 
                                                    onClick={() => {
                                                        // Navigate to trip detail or open trip booking
                                                        window.open(`/rides?trip_id=${trip.id}`, '_blank');
                                                    }}
                                                    className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors"
                                                >
                                                    View Trip
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}