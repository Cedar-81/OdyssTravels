import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { circlesService, type Circle } from "@/services/circles";
import { getCircleError } from "../utils/errorHandling";
import { updateSEO, resetSEO, formatCircleSEO } from "@/utils/seo";

export default function CircleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/circles");
      return;
    }

    setLoading(true);
    setError(null);

    circlesService.getCircleDetails(id)
      .then((circle: Circle) => {
        console.log("📋 Fetched circle details:", circle);
        setCircle(circle);
        
        // Update SEO for the circle
        const seoData = formatCircleSEO(circle);
        updateSEO(seoData);
      })
      .catch((err: any) => {
        console.error("❌ Error fetching circle details:", err);
        setError(getCircleError(err));
        resetSEO();
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Reset SEO when component unmounts
  useEffect(() => {
    return () => {
      resetSEO();
    };
  }, []);

  if (loading) {
    return (
      <main className="bg-transparent">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Loading circle...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-transparent">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => navigate("/circles")}
              className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Back to Circles
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!circle) {
    return (
      <main className="bg-transparent">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Circle not found</h2>
            <button 
              onClick={() => navigate("/circles")}
              className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Back to Circles
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-transparent">
      <div className="flex justify-between px-8 gap-8 items-center pt-10">
        <div>
          <h2 className="text-base font-bold lg:text-2xl">
            Circle Details
          </h2>
          <p className="text-xs leading-tight">
            {circle.name} - {circle.departure} to {circle.destination}
          </p>
        </div>
        <div>
          <button 
            onClick={() => navigate("/circles")}
            className="!size-10 flex items-center justify-center cursor-pointer text-xs lg:text-base bg-black text-white rounded-full"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.375 5.25L8.625 12L15.375 18.75" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <section className="bg-white px-8 py-10 lg:p-10">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{circle.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{circle.departure} → {circle.destination}</p>
              <p className="text-sm text-gray-500">{circle.description}</p>
            </div>
            
            {circle.startDate && circle.endDate && (
              <div>
                <h3 className="font-semibold mb-2">Trip Dates</h3>
                <p className="text-sm">
                  {new Date(circle.startDate).toLocaleDateString()} - {new Date(circle.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">Members</h3>
              <p className="text-sm text-gray-600">
                {circle.users?.length || circle.members?.length || 0} members
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 