import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Circle } from "@/services/circles";
import { circlesService } from "@/services/circles";

function getUserIdFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id || payload.sub || payload.id || null;
    } catch {
        return null;
    }
}

interface CircleCardProps {
  circle: Circle;
  onJoin: (circle: Circle) => void;
}

export default function CircleCard({ circle, onJoin }: CircleCardProps) {
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userId = getUserIdFromToken(token);
        if (userId && (circle.users?.includes(userId) || circle.members?.some(m => m.user_id === userId))) {
            setJoined(true);
        }
    }, [circle]);

    const handleJoin = async () => {
        setLoading(true);
        setError(null);
        try {
            await circlesService.joinCircle(circle.id);
            setJoined(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to join circle.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to format date to 'July 20, 10AM'
    function formatDateTime(dateStr: string) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
        }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: undefined, hour12: true }).replace(':00', '').replace(' ', '');
    }

    return(
        <div className="flex gap-3 lg:items-center bg-black/5 rounded-xl overflow-clip p-6">
            <div className="hidden lg:flex w-[3.4rem] h-[3.5rem]">
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
                <p className="text-xs">{formatDateTime(circle.startDate)} - {formatDateTime(circle.endDate)}</p>
            </div>
            <div className="flex flex-col gap-2 items-end ml-auto">
                {error && <div className="text-xs text-red-500 mb-1">{error}</div>}
                {!joined ? (
                    <button 
                        className="text-sm cursor-pointer rounded-full bg-black text-white h-max px-5 py-1 disabled:opacity-60" 
                        onClick={handleJoin}
                        disabled={loading}
                    >
                        {loading ? "Joining..." : "Join"}
                    </button>
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