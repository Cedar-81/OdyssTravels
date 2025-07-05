import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date_range_picker";
import { circlesService } from "@/services/circles";
import type { DateRange } from "react-day-picker";
import { getCircleError } from "../utils/errorHandling";

function validateCircleForm(data: any) {
  if (!data.name) return "Circle title is required.";
  if (!data.description) return "Circle description is required.";
  if (!data.departure) return "Departure city is required.";
  if (!data.destination) return "Destination city is required.";
  if (!data.dateRange?.from) return "Start date is required.";
  if (!data.dateRange?.to) return "End date is required.";
  return null;
}

export default function CreateCircle() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    departure: "",
    destination: "",
    dateRange: undefined as DateRange | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setForm((prev) => ({ ...prev, dateRange }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const validationError = validateCircleForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem('odyss_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const currentUserId = user?.id || '';
      
      console.log("circle form: ", {
        name: form.name,
        description: form.description,
        departure: form.departure,
        destination: form.destination,
        startDate: form.dateRange?.from ? new Date(form.dateRange.from.setHours(0, 0, 0, 0)).toISOString() : "",
        endDate: form.dateRange?.to ? new Date(form.dateRange.to.setHours(0, 0, 0, 0)).toISOString() : "",
        users: currentUserId ? [currentUserId] : [],
      })
      await circlesService.createCircle({
        name: form.name,
        description: form.description,
        departure: form.departure,
        destination: form.destination,
        startDate: form.dateRange?.from ? new Date(form.dateRange.from.setHours(0, 0, 0, 0)).toISOString() : "",
        endDate: form.dateRange?.to ? new Date(form.dateRange.to.setHours(0, 0, 0, 0)).toISOString() : "",
        users: currentUserId ? [currentUserId] : [],
      });
      setSuccess(true);
      setForm({
        name: "",
        description: "",
        departure: "",
        destination: "",
        dateRange: undefined,
      });
      // Redirect to circles page after successful creation
      navigate("/circles");
    } catch (err: any) {
      setError(getCircleError(err));
    } finally {
      setLoading(false);
    }
  };

  return(
        <main className="fixed top-0 right-0 h-screen w-screen overflow-y-auto bg-white z-50">
            {/* Fixed Top Progress Bar and Home Button */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
              <div className="flex justify-center py-2">
                <div className="group flex items-center cursor-pointer" onClick={() => navigate("/")}>
                  <svg
                    className="h-6 w-6 text-black transition-transform duration-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12L12 3l9 9" />
                    <path d="M9 21V9h6v12" />
                  </svg>
                  <span className="ml-2 text-sm text-black font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs">
                    Go Home
                  </span>
                </div>
              </div>
            </div>
            
            <section className="space-y-8 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[4rem] pb-[5rem] lg:mt-[6rem]">
                <div className="flex gap-2 w-full items-center">
                    <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => navigate("/circles")}
                    >
                        <svg width="32" height="33" className="h-5" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5 7.5L11.5 16.5L20.5 25.5" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold">What makes up this circle?</h1>
                </div>

                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Circle title</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="Name your circle to set the vibe"
                            value={form.name}
                            onChange={e => handleChange("name", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Circle description</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="Tell others who might be interested what kind of circle this is"
                            value={form.description}
                            onChange={e => handleChange("description", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Departure city</label>
                        <Select 
                            value={form.departure} 
                            onValueChange={(value) => handleChange("departure", value)}
                        >
                            <SelectTrigger className="w-full text-sm border-none shadow-none">
                                <SelectValue className="text-sm" placeholder="Select departure city" />
                            </SelectTrigger>
                            <SelectContent className="text-sm">
                                <SelectGroup>
                                    <SelectLabel>Departure Cities</SelectLabel>
                                    <SelectItem value="Enugu">Enugu</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Destination City</label>
                        <Select 
                            value={form.destination} 
                            onValueChange={(value) => handleChange("destination", value)}
                        >
                            <SelectTrigger className="w-full text-sm border-none shadow-none">
                                <SelectValue className="text-sm" placeholder="Select destination city" />
                            </SelectTrigger>
                            <SelectContent className="text-sm">
                                <SelectGroup>
                                    <SelectLabel>Destination Cities</SelectLabel>
                                    <SelectItem value="Abuja">Abuja</SelectItem>
                                    <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                                    <SelectItem value="Lagos">Lagos</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Date range</label>
                        <DateRangePicker 
                            dateRange={form.dateRange}
                            onDateRangeChange={handleDateRangeChange}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    {success && <div className="text-green-600 text-sm text-center">Circle created successfully!</div>}
                    <button 
                        type="submit"
                        className="w-full cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </form>
            </section>
        </main>
    )
} 