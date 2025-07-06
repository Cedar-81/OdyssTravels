import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Circle } from "@/services/circles";
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

    // Prevent scroll propagation
    const handleScroll = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    const currentUserId = getCurrentUserId();
    const isCurrentUserMember = circle.users?.some(user => user.id === currentUserId) || 
                               circle.members?.some(member => member.user_id === currentUserId);

    return(
        <section 
            className="shadow-2xl space-y-6 fixed w-[22rem] top-0 right-0 h-screen z-50 bg-white flex flex-col overflow-hidden"
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
                        <h2 className="font-medium">Members</h2>
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
                                            {user.id !== currentUserId && (
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
                                            {member.user_id !== currentUserId && (
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
                    >
                        {isCurrentUserMember ? 'Already Joined' : 'Join'}
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
        </section>
    );
}