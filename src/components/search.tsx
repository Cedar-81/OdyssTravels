import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "./ui/date_picker"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { tripsService } from "@/services/trips"
import { circlesService } from "@/services/circles"
import { useSearch } from "@/contexts/SearchContext"

function Search() {
  const location = useLocation();
  const { setSearchResults } = useSearch();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");

  // Determine if we're on rides or circles page
  const isRidesPage = location.pathname === "/rides";
  const isCirclesPage = location.pathname === "/circles";

  const handleSearch = async () => {
    if (!origin || !destination) return;

    try {
      if (isRidesPage) {
        const searchParams = {
          origin,
          destination,
          date: date?.toISOString().split('T')[0],
          time
        };
        console.log('🔍 Searching rides with params:', searchParams);
        const results = await tripsService.searchTrips(searchParams);
        console.log('✅ Rides search results:', results);
        // Handle both old format (array) and new format ({ trips: Trip[] })
        const trips = Array.isArray(results) ? results : results.trips;
        setSearchResults(trips);
      } else if (isCirclesPage) {
        const searchParams = {
          departure: origin,
          destination
        };
        console.log('🔍 Searching circles with params:', searchParams);
        const results = await circlesService.searchCircles(searchParams);
        console.log('✅ Circles search results:', results);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      // Silently handle search errors - they're not critical for UX
    }
  };

  // Auto-search when all required fields are filled
  useEffect(() => {
    if (origin && destination) {
      console.log('🔄 Auto-triggering search for:', { origin, destination, date, time });
      handleSearch();
    }
  }, [origin, destination, date, time]);

  return (
    <section className="hidden lg:flex min-w-max bg-white border shadow-xl border-black/20 gap-4 py-3 px-4 mx-auto rounded-xl overflow-clip">
        <div className="flex flex-col space-y-2">
            <label className="text-xs px-3" htmlFor="origin">
              {isCirclesPage ? "Departure" : "Origin"}
            </label>
            <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue className="text-sm" placeholder={isCirclesPage ? "e.g Enugu" : "e.g Enugu"} />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectGroup>
                    <SelectLabel>{isCirclesPage ? "Departure" : "Origin"}</SelectLabel>
                    <SelectItem value="enugu">Enugu</SelectItem>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-xs px-3" htmlFor="destination">Destination</label>
            <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-[180px] text-sm">
                    <SelectValue className="text-sm" placeholder="e.g Abuja" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectGroup>
                    <SelectLabel>Destination</SelectLabel>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="enugu">Enugu</SelectItem>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        {isRidesPage && (
          <>
            <div className="flex flex-col space-y-2">
                <label className="text-xs px-3" htmlFor="date">Date</label>
                <DatePicker date={date} onDateChange={setDate} />
            </div>
            <div className="flex flex-col space-y-2">
                <label className="text-xs px-3" htmlFor="time">Time</label>
                <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="w-[180px] text-sm">
                        <SelectValue className="text-sm" placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                        <SelectGroup>
                        <SelectLabel>Time</SelectLabel>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
          </>
        )}
    </section>
  )
}

export default Search