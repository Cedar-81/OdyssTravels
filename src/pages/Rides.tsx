import { useEffect, useState } from "react";
import RideCard from "@/components/ride_card";
import RideDetail from "@/components/ride_detail";
import { tripsService, type Trip } from "@/services/trips";
import { useNavigate } from "react-router-dom";

function isTripsResponse(data: any): data is { trips: Trip[] } {
  return data && typeof data === 'object' && Array.isArray(data.trips);
}

export default function Rides() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    tripsService.listTrips()
      .then((data: any) => {
        let trips: Trip[] = [];
        if (Array.isArray(data)) {
          trips = data;
        } else if (isTripsResponse(data)) {
          trips = data.trips;
        }
        console.log("Fetched trips:", trips);
        setTrips(trips);
      })
      .catch((err) => {
        console.error("Error fetching trips:", err);
        setError(err?.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("Selected tripId:", selectedTripId);
  }, [selectedTripId]);

  return(
    <main className="bg-transparent">
      <div className="flex justify-between px-8 lg:px-10 items-center pt-10">
        <h2 className="text-base font-bold lg:text-2xl">Available Rides</h2>
        <button onClick={() => navigate("/curate-trip")} className="px-6 cursor-pointer text-xs lg:text-base bg-black text-white py-2 rounded-full">Curate Ride</button>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-white py-10 px-8 lg:p-10">
        {loading && <div className="col-span-4 text-center">Loading rides...</div>}
        {error && <div className="col-span-4 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && trips.length === 0 && <div className="col-span-4 text-center">No rides found.</div>}
        {trips.map(trip => (
          <RideCard key={trip.id} trip={trip} onJoin={() => setSelectedTripId(trip.id)} />
        ))}
      </section>

      {selectedTripId && (
        <RideDetail tripId={selectedTripId} onClose={() => setSelectedTripId(null)} />
      )}
    </main>
  );
} 