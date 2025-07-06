import { useEffect, useState } from "react";
import CircleCard from "@/components/circle_card";
import CircleDetail from "@/components/circle_detail";
import { circlesService, type Circle } from "@/services/circles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearch } from "@/contexts/SearchContext";
import { getCircleError } from "../utils/errorHandling";
import { updateSEO, resetSEO, formatCircleSEO } from "@/utils/seo";

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
    console.log("🔍 Circles page loaded with circle_id:", circleId);
    console.log("🔍 Current user logged in:", isLoggedIn());
    console.log("🔍 Full URL:", window.location.href);
    
    if (circleId) {
      // Store circle_id in localStorage for redirect purposes
      localStorage.setItem('redirect_circle', circleId);
      console.log("💾 Stored redirect_circle in localStorage:", circleId);
      
      // Fetch specific circle
      console.log("📋 Fetching specific circle with ID:", circleId);
      circlesService.getCircleDetails(circleId)
        .then((circle: Circle) => {
          console.log("📋 Fetched specific circle:", circle);
          setCircles([circle]);
          setSelectedCircle(circle);
          
          // Update SEO for shared circle
          const seoData = formatCircleSEO(circle);
          updateSEO(seoData);
          
          // Clear the redirect_circle from localStorage since we successfully loaded it
          localStorage.removeItem('redirect_circle');
          console.log("🧹 Cleared redirect_circle from localStorage");
        })
        .catch((err: any) => {
          console.error("❌ Error fetching specific circle:", err);
          console.error("❌ Error details:", err.response?.data || err.message);
          setError(getCircleError(err));
          // Reset SEO on error
          resetSEO();
        })
        .finally(() => setLoading(false));
    } else {
      // Check if there's a stored redirect_circle in localStorage
      const storedCircleId = localStorage.getItem('redirect_circle');
      console.log("🔍 No circle_id in URL, checking localStorage redirect_circle:", storedCircleId);
      
      if (storedCircleId) {
        // Fetch the stored circle
        console.log("📋 Fetching stored circle with ID:", storedCircleId);
        circlesService.getCircleDetails(storedCircleId)
          .then((circle: Circle) => {
            console.log("📋 Fetched stored circle:", circle);
            setCircles([circle]);
            setSelectedCircle(circle);
            
            // Update SEO for shared circle
            const seoData = formatCircleSEO(circle);
            updateSEO(seoData);
            
            // Clear the redirect_circle from localStorage since we successfully loaded it
            localStorage.removeItem('redirect_circle');
            console.log("🧹 Cleared redirect_circle from localStorage");
          })
          .catch((err: any) => {
            console.error("❌ Error fetching stored circle:", err);
            console.error("❌ Error details:", err.response?.data || err.message);
            setError(getCircleError(err));
            // Reset SEO on error
            resetSEO();
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
            
            // Reset SEO to default when viewing all circles
            resetSEO();
          })
          .catch((err) => {
            console.error("❌ Error fetching circles:", err);
            setError(getCircleError(err));
            // Reset SEO on error
            resetSEO();
          })
          .finally(() => setLoading(false));
      }
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
      // Reset SEO when component unmounts
      resetSEO();
    };
  }, [clearSearchResults]);

  // Display search results if available, otherwise show all circles
  const displayCircles = searchResults !== null ? searchResults : circles;

  // Check if user is logged in
  const isLoggedIn = () => {
    if (typeof window === 'undefined') return false;
    const userStr = localStorage.getItem('odyss_user');
    const accessToken = localStorage.getItem('access_token');
    console.log("🔍 Circles page auth check - user:", !!userStr, "token:", !!accessToken);
    // Allow access if user exists, even if token is missing (token might be expired)
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