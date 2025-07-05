import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Circle } from "@/services/circles";

interface CircleDetailProps {
  circle: Circle;
  onClose: () => void;
}

export default function CircleDetail({ circle, onClose }: CircleDetailProps)  {
    const [copySuccess, setCopySuccess] = useState(false);

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
        const shareableLink = `${window.location.origin}/rides?trip_id=${circle.id}`;
        
        try {
            await navigator.clipboard.writeText(shareableLink);
            setCopySuccess(true);
            
            // Reset success message after 3 seconds
            setTimeout(() => {
                setCopySuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Failed to copy link:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareableLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            setCopySuccess(true);
            setTimeout(() => {
                setCopySuccess(false);
            }, 3000);
        }
    };

    const currentUserId = getCurrentUserId();
    const isCurrentUserMember = circle.users?.some(user => user.id === currentUserId) || 
                               circle.members?.some(member => member.user_id === currentUserId);

    return(
        <section className="shadow-2xl space-y-6 fixed w-[22rem] top-0 right-0 h-screen z-50 bg-white">
            <div className="px-3 py-6 h-[7.5rem] border space-y-4 rounded-b-xl shadow-xl">
                <div className="flex gap-2">
                    <svg className="h-5 mt-4 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
                        <path d="M15.375 5.25L8.625 12L15.375 18.75" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex gap-2 items-center">
                        <div className="flex w-[3.4rem] h-[3.5rem]">
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
            
            <div className="space-y-4 h-[calc(100%-12.5rem)] pb-6 overflow-y-auto">
                <p className="py-3 px-4 text-sm text-black/60">{circle.description}</p>
                <div className="px-4 space-y-4">
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
                                            <button className="text-xs border border-black rounded-full cursor-pointer px-3 py-1">
                                                invite
                                            </button>
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
                                            <button className="text-xs border border-black rounded-full cursor-pointer px-3 py-1">
                                                invite
                                            </button>
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

            <div className="h-[5rem] absolute w-full justify-center bottom-0">
               <div className="flex justify-center mt-5">
                   <button 
                       className={`border-0 cursor-pointer text-center w-[90%] rounded-full py-3 transition-colors duration-200 ${
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
        </section>
    )
}