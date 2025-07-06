import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Circle } from "@/services/circles";
import { circlesService } from "@/services/circles";
import { getCircleError } from "../utils/errorHandling";

interface CircleCardProps {
  circle: Circle;
  onJoin: (circle: Circle) => void;
}

export default function CircleCard({ circle, onJoin }: CircleCardProps) {
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get current user from localStorage
        const userStr = localStorage.getItem('odyss_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const userId = user.id;
                
                // Check if user is in the circle.users array
                if (userId && Array.isArray(circle.users) && circle.users.some(user => user.id === userId)) {
                    setJoined(true);
                }
            } catch (err) {
                console.error("Error parsing user data:", err);
                // Continue with empty user data
            }
        }
    }, [circle]);

    const isLoggedIn = () => {
        if (typeof window === 'undefined') return false;
        const userStr = localStorage.getItem('odyss_user');
        const accessToken = localStorage.getItem('access_token');
        console.log("🔍 CircleCard auth check - user:", !!userStr, "token:", !!accessToken);
        // Allow access if user exists, even if token is missing (token might be expired)
        return !!userStr;
    };

    const handleJoin = async () => {
        if (!isLoggedIn()) {
            // Store circle_id in localStorage and redirect to login
            localStorage.setItem('redirect_circle', circle.id);
            console.log("🔐 Stored circle_id and redirecting to login:", circle.id);
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await circlesService.joinCircle(circle.id);
            setJoined(true);
        } catch (err: any) {
            setError(getCircleError(err));
        } finally {
            setLoading(false);
        }
    };

    // Helper to format date to 'July 20, 10AM'
    function formatDateTime(dateStr: string) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        // Include weekday as short (e.g., Thu, Fri)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: '2-digit',
        });
    }

    return(
        <div className="flex gap-3 bg-black/5 rounded-xl overflow-clip p-6">
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
                <h3 className="text-sm lg:text-base font-semibold">{circle.name}</h3>
                <p className="text-xs">
                    {formatDateTime(circle.startDate) === formatDateTime(circle.endDate)
                        ? formatDateTime(circle.startDate)
                        : `${formatDateTime(circle.startDate)} - ${formatDateTime(circle.endDate)}`}
                </p>
            </div>
            <div className="flex flex-col gap-2 items-end ml-auto">
                {error && <div className="text-xs text-red-500 mb-1">{error}</div>}
                {!joined ? (
                    <div className="flex flex-col gap-1">
                        <button 
                            className="text-sm cursor-pointer rounded-full bg-black text-white h-max px-5 py-1 disabled:opacity-60" 
                            onClick={handleJoin}
                            disabled={loading}
                        >
                            {loading ? "Joining..." : (isLoggedIn() ? "Join" : "Login to Join")}
                        </button>
                        <button 
                            className="text-xs cursor-pointer min-w-max rounded-full border border-black text-black h-max px-3 py-1 hover:bg-black hover:text-white transition-colors" 
                            onClick={() => onJoin(circle)}
                        >
                            View Details
                        </button>
                    </div>
                ) : (
                    <button 
                        className="text-sm cursor-pointer rounded-full bg-black text-white h-max px-5 py-1" 
                        onClick={() => onJoin(circle)}
                    >
                        View
                    </button>
                )}
            </div>
        </div>
    )
}