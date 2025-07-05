import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RideCard from "@/components/ride_card";
import RideDetail from "@/components/ride_detail";
import { tripsService, type Trip } from "@/services/trips";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/contexts/SearchContext";
import { getTripError } from "../utils/errorHandling";

function isTripsResponse(data: any): data is { trips: Trip[] } {
  return data && typeof data === 'object' && Array.isArray(data.trips);
}

export default function Rides() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, clearSearchResults } = useSearch();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for trip_id query parameter on component mount
  useEffect(() => {
    const tripIdFromQuery = searchParams.get('trip_id');
    if (tripIdFromQuery) {
      console.log("🎯 Found trip_id in query params:", tripIdFromQuery);
      setSelectedTripId(tripIdFromQuery);
    }
  }, [searchParams]);

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
        console.log("📋 Fetched all trips:", trips);
        setTrips(trips);
      })
      .catch((err) => {
        console.error("❌ Error fetching trips:", err);
        setError(getTripError(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("🎯 Selected tripId:", selectedTripId);
  }, [selectedTripId]);

  // Log when search results change
  useEffect(() => {
    if (searchResults !== null) {
      console.log("🔍 Search results received in Rides page:", searchResults);
    }
  }, [searchResults]);

  // Clear search results when component unmounts
  useEffect(() => {
    return () => {
      console.log("🧹 Clearing search results on Rides page unmount");
      clearSearchResults();
    };
  }, [clearSearchResults]);

  // Handle closing the trip detail and clearing the query parameter
  const handleCloseTripDetail = () => {
    setSelectedTripId(null);
    // Remove trip_id from URL query parameters
    searchParams.delete('trip_id');
    setSearchParams(searchParams);
  };

  // Display search results if available, otherwise show all trips
  const displayTrips = searchResults !== null ? searchResults : trips;

  console.log("📊 Displaying trips:", {
    totalTrips: trips.length,
    searchResults: searchResults?.length || 0,
    displayTrips: displayTrips.length,
    isSearchMode: searchResults !== null
  });

  return(
    <main className="bg-transparent">
      <div className="flex justify-between gap-5 px-8 lg:px-10 items-center pt-10">
        <div>
          <h2 className="text-base font-bold lg:text-2xl">
            {searchResults !== null ? "Search Results" : "Available Rides"}
          </h2>
          <p className="text-xs leading-tight">
            curate the perfect trip and find/invite the right crew to travel with you
          </p>
        </div>
        <div>
          <button onClick={() => navigate("/curate-trip")} className="!size-10 flex items-center justify-center cursor-pointer text-xs lg:text-base bg-black text-white rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 12.5H6V11.5H11.5V6H12.5V11.5H18V12.5H12.5V18H11.5V12.5Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-white py-10 px-8 lg:p-10">
        {loading && <div className="col-span-4 text-center">Loading rides...</div>}
        {error && <div className="col-span-4 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && displayTrips.length === 0 && (
          <div className="col-span-4 text-center">
            {searchResults !== null ? "No rides found matching your search criteria." : "No rides found."}
          </div>
        )}
        {displayTrips.map(trip => (
          <RideCard key={trip.id} trip={trip} onJoin={() => setSelectedTripId(trip.id)} />
        ))}
      </section>

      {selectedTripId && (
        <RideDetail tripId={selectedTripId} onClose={handleCloseTripDetail} />
      )}
    </main>
  );
} 