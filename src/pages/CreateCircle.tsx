import { useState } from "react";
import { Input } from "@/components/ui/input";
import { circlesService } from "@/services/circles";

function validateCircleForm(data: any) {
  if (!data.name) return "Circle title is required.";
  if (!data.description) return "Circle description is required.";
  if (!data.departure) return "Departure city is required.";
  if (!data.destination) return "Destination city is required.";
  if (!data.startDate) return "Start date is required.";
  if (!data.endDate) return "End date is required.";
  return null;
}

export default function CreateCircle() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    departure: "",
    destination: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      await circlesService.createCircle({
        name: form.name,
        description: form.description,
        departure: form.departure,
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        users: [], // You may want to add user selection
      });
      setSuccess(true);
      setForm({
        name: "",
        description: "",
        departure: "",
        destination: "",
        startDate: "",
        endDate: "",
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create circle.");
    } finally {
      setLoading(false);
    }
  };

  return(
        <main className="fixed top-0 right-0 h-screen w-screen bg-white z-50">
            <section className="space-y-8 w-[30rem] flex flex-col items-center mx-auto mt-[10rem]">
                <div className="flex gap-2 w-full items-center">
                    <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
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
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="What city are you currently in?"
                            value={form.departure}
                            onChange={e => handleChange("departure", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Destination City</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="What city are you heading to?"
                            value={form.destination}
                            onChange={e => handleChange("destination", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Start date</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="date" 
                            placeholder="Start date"
                            value={form.startDate}
                            onChange={e => handleChange("startDate", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >End date</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="date" 
                            placeholder="End date"
                            value={form.endDate}
                            onChange={e => handleChange("endDate", e.target.value)}
                            required
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