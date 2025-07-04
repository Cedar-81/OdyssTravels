import { useEffect, useState } from "react";
import CircleCard from "@/components/circle_card";
import CircleDetail from "@/components/circle_detail";
import { circlesService, type Circle } from "@/services/circles";
import { useNavigate } from "react-router-dom";

function isCirclesResponse(data: any): data is { circles: Circle[] } {
  return data && typeof data === 'object' && Array.isArray(data.circles);
}

export default function Circles() {
  const navigate = useNavigate();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    circlesService.getAllCircles()
      .then((data: any) => {
        let circles: Circle[] = [];
        if (Array.isArray(data)) {
          circles = data;
        } else if (isCirclesResponse(data)) {
          circles = data.circles;
        }
        console.log("Circles: ", circles)
        setCircles(circles);
      })
      .catch((err) => {
        setError(err?.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  }, []);

  return(
    <main className="bg-transparent">
      <div className="flex justify-between px-10 items-center pt-10">
        <h2 className="text-base font-bold lg:text-2xl">Circles</h2>
        <button onClick={() => navigate("/create-circle")} className="px-6 cursor-pointer text-xs lg:text-base bg-black text-white py-2 rounded-full">Create Circle</button>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 bg-white px-8 py-10 lg:p-10">
        {loading && <div className="col-span-3 text-center">Loading circles...</div>}
        {error && <div className="col-span-3 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && circles.length === 0 && <div className="col-span-3 text-center">No circles found.</div>}
        {circles.map(circle => (
          <CircleCard key={circle.id} circle={circle} onJoin={setSelectedCircle} />
        ))}
      </section>

      {selectedCircle && (
        <CircleDetail circle={selectedCircle} onClose={() => setSelectedCircle(null)} />
      )}
    </main>
  );
} 