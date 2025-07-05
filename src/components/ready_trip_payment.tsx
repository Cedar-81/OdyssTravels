import { useState } from "react";
import { paymentsService } from "@/services/payments";
import { getPaymentError } from "../utils/errorHandling";

interface ReadyTripPaymentProps {
  tripData: {
    departureLoc: string;
    arrivalLoc: string;
    departureDate: string;
    arrivalDate: string;
    seats: number;
    price: number;
    vehicle: string;
    memberIds: string[];
    company: string;
    departureTOD: string;
    creator: string;
    fill: boolean;
    vibes: string[];
    route_id: string;
  };
  email: string;
}

export default function ReadyTripPayment({ tripData, email }: ReadyTripPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await paymentsService.initiateTripPayment({
                departureLoc: tripData.departureLoc,
                arrivalLoc: tripData.arrivalLoc,
                departureDate: tripData.departureDate,
                arrivalDate: tripData.arrivalDate,
                seats: tripData.seats,     
                price: tripData.price,
                vehicle: tripData.vehicle,
                company: tripData.company,
                departureTOD: tripData.departureTOD,
                creator: tripData.creator,
                email: email
            });
            
            if (res.authorization_url) {
                window.location.href = res.authorization_url;
            } else {
                setError("No payment URL returned.");
            }
        } catch (err: any) {
            setError(getPaymentError(err));
            setLoading(false);
        }
    };

    return (
        <section className="space-y-6 px-8 w-[90%] lg:w-[30rem] h-max p-10 bg-white shadow-2xl rounded-2xl flex flex-col items-center mx-auto mt-[5rem] lg:mt-[3rem]">
            <svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.176 58.225C13.7488 51.1997 3.1875 36.55 3.1875 28.6875C3.1875 23.6152 5.20245 18.7507 8.78908 15.1641C12.3757 11.5775 17.2402 9.5625 22.3125 9.5625C27.3848 9.5625 32.2493 11.5775 35.8359 15.1641C39.4225 18.7507 41.4375 23.6152 41.4375 28.6875M60.5625 28.6875C60.5625 26.176 61.0572 23.689 62.0183 21.3687C62.9794 19.0483 64.3882 16.94 66.1641 15.1641C67.94 13.3882 70.0483 11.9794 72.3687 11.0183C74.689 10.0572 77.176 9.5625 79.6875 9.5625C82.199 9.5625 84.686 10.0572 87.0063 11.0183C89.3267 11.9794 91.435 13.3882 93.2109 15.1641C94.9868 16.94 96.3956 19.0483 97.3567 21.3687C98.3178 23.689 98.8125 26.176 98.8125 28.6875C98.8125 36.5117 88.3108 51.119 82.8708 58.157M51 41.4375C56.0723 41.4375 60.9368 43.4525 64.5234 47.0391C68.11 50.6257 70.125 55.4902 70.125 60.5625C70.125 68.7268 58.701 84.2605 53.5117 90.899C53.2136 91.2806 52.8325 91.5892 52.3973 91.8015C51.9621 92.0137 51.4842 92.124 51 92.124C50.5158 92.124 50.0379 92.0137 49.6027 91.8015C49.1675 91.5892 48.7864 91.2806 48.4883 90.899C43.299 84.2648 31.875 68.7268 31.875 60.5625C31.875 55.4902 33.89 50.6257 37.4766 47.0391C41.0632 43.4525 45.9277 41.4375 51 41.4375Z" stroke="black" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22.3125 30.2812C21.8898 30.2812 21.4844 30.1133 21.1855 29.8145C20.8867 29.5156 20.7188 29.1102 20.7188 28.6875C20.7188 28.2648 20.8867 27.8594 21.1855 27.5605C21.4844 27.2617 21.8898 27.0938 22.3125 27.0938M22.3125 30.2812C22.7352 30.2812 23.1406 30.1133 23.4395 29.8145C23.7383 29.5156 23.9062 29.1102 23.9062 28.6875C23.9062 28.2648 23.7383 27.8594 23.4395 27.5605C23.1406 27.2617 22.7352 27.0938 22.3125 27.0938M79.6875 30.2812C79.2648 30.2812 78.8594 30.1133 78.5605 29.8145C78.2617 29.5156 78.0938 29.1102 78.0938 28.6875C78.0938 28.2648 78.2617 27.8594 78.5605 27.5605C78.8594 27.2617 79.2648 27.0938 79.6875 27.0938M79.6875 30.2812C80.1102 30.2812 80.5156 30.1133 80.8145 29.8145C81.1133 29.5156 81.2812 29.1102 81.2812 28.6875C81.2812 28.2648 81.1133 27.8594 80.8145 27.5605C80.5156 27.2617 80.1102 27.0938 79.6875 27.0938M51 62.1562C50.5773 62.1562 50.1719 61.9883 49.873 61.6895C49.5742 61.3906 49.4062 60.9852 49.4062 60.5625C49.4062 60.1398 49.5742 59.7344 49.873 59.4355C50.1719 59.1367 50.5773 58.9688 51 58.9688M51 62.1562C51.4227 62.1562 51.8281 61.9883 52.127 61.6895C52.4258 61.3906 52.5938 60.9852 52.5938 60.5625C52.5938 60.1398 52.4258 59.7344 52.127 59.4355C51.8281 59.1367 51.4227 58.9688 51 58.9688" stroke="black" stroke-width="3.5"/>
            </svg>


            <div className="space-y-4 text-center">
                <h1 className="text-xl font-semibold">Almost done!!!</h1>
                <p  className="text-sm">Create your trip to start your journey and connect with fellow travelers.</p>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button 
                className="w-full cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors disabled:opacity-60" 
                onClick={handlePayment}
                disabled={loading}
            >
                {loading ? "Processing..." : "Make payment"}
            </button>
        </section>
    );
} 