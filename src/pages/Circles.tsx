import { useEffect, useState } from "react";
import CircleCard from "@/components/circle_card";
import CircleDetail from "@/components/circle_detail";
import { circlesService, type Circle } from "@/services/circles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearch } from "@/contexts/SearchContext";
import { getCircleError } from "../utils/errorHandling";

function isCirclesResponse(data: any): data is { circles: Circle[] } {
  return data && typeof data === 'object' && Array.isArray(data.circles);
}

export default function Circles() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { searchResults, clearSearchResults } = useSearch();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Check if there's a circle_id in the URL
    const circleId = searchParams.get('circle_id');
    
    if (circleId) {
      // Fetch specific circle
      circlesService.getCircleDetails(circleId)
        .then((circle: Circle) => {
          console.log("📋 Fetched specific circle:", circle);
          setCircles([circle]);
          setSelectedCircle(circle);
        })
        .catch((err: any) => {
          console.error("❌ Error fetching specific circle:", err);
          setError(getCircleError(err));
        })
        .finally(() => setLoading(false));
    } else {
      // Fetch all circles
      circlesService.getAllCircles()
        .then((data: any) => {
          let circles: Circle[] = [];
          if (Array.isArray(data)) {
            circles = data;
          } else if (isCirclesResponse(data)) {
            circles = data.circles;
          }
          console.log("📋 Fetched all circles:", circles);
          setCircles(circles);
        })
        .catch((err) => {
          console.error("❌ Error fetching circles:", err);
          setError(getCircleError(err));
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  // Log when search results change
  useEffect(() => {
    if (searchResults !== null) {
      console.log("🔍 Search results received in Circles page:", searchResults);
    }
  }, [searchResults]);

  // Clear search results when component unmounts
  useEffect(() => {
    return () => {
      console.log("🧹 Clearing search results on Circles page unmount");
      clearSearchResults();
    };
  }, [clearSearchResults]);

  // Display search results if available, otherwise show all circles
  const displayCircles = searchResults !== null ? searchResults : circles;

  // Check if user is logged in
  const isLoggedIn = () => {
    if (typeof window === 'undefined') return false;
    const userStr = localStorage.getItem('odyss_user');
    return !!userStr;
  };

  const handleCreateCircle = () => {
    if (isLoggedIn()) {
      navigate("/create-circle");
    } else {
      navigate("/login");
    }
  };

  console.log("📊 Displaying circles:", {
    totalCircles: circles.length,
    searchResults: searchResults?.length || 0,
    displayCircles: displayCircles.length,
    isSearchMode: searchResults !== null
  });

  return(
    <main className="bg-transparent">
      <div className="flex justify-between px-8 gap-8 items-center pt-10">
        <div>
          <h2 className="text-base font-bold lg:text-2xl">
            {searchResults !== null ? "Search Results" : "Circles"} <br />
          </h2>
          <p className="text-xs leading-tight">
            curate public circles for people with the same trip interests
          </p>
        </div>
        <div>
          <button onClick={handleCreateCircle} className="!size-10 flex items-center justify-center cursor-pointer text-xs lg:text-base bg-black text-white rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 12.5H6V11.5H11.5V6H12.5V11.5H18V12.5H12.5V18H11.5V12.5Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-3 bg-white px-8 py-10 lg:p-10">
        {loading && <div className="col-span-3 text-center">Loading circles...</div>}
        {error && <div className="col-span-3 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && displayCircles.length === 0 && (
          <div className="col-span-3 text-center">
            {searchResults !== null ? "No circles found matching your search criteria." : "No circles found."}
          </div>
        )}
        {displayCircles.map(circle => (
          <CircleCard key={circle.id} circle={circle} onJoin={setSelectedCircle} />
        ))}
      </section>

      {selectedCircle && (
        <CircleDetail circle={selectedCircle} onClose={() => setSelectedCircle(null)} />
      )}
    </main>
  );
} 