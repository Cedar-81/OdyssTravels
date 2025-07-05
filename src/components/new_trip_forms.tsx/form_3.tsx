import { useState, useEffect } from 'react';
import { DatePicker } from "../ui/date_picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { usersService, type CompanyRoute } from "@/services/users";

interface Form3Props {
  onNext: () => void;
  onPrevious: () => void;
  formData: {
    departureCity: string;
    destinationCity: string;
    tripDate: Date | null;
    tripTime: string;
  };
  onFormDataChange: (field: string, value: any) => void;
}

export default function Form3({ onNext, onPrevious, formData, onFormDataChange }: Form3Props) {
    const [localData, setLocalData] = useState({
        departureCity: formData.departureCity,
        destinationCity: formData.destinationCity,
        tripDate: formData.tripDate,
        tripTime: formData.tripTime
    });
    const [routes, setRoutes] = useState<CompanyRoute[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      usersService.getAllCompanyRoutes().then(data => {
        console.log('Fetched company routes:', data);
        setRoutes(data);
      }).catch(() => setRoutes([]));
    }, []);

    // Get unique origins for departure city options
    const origins = Array.from(new Set(routes.map(r => r.origin)));
    // Get destinations for selected origin
    const destinations = Array.from(new Set(routes.filter(r => r.origin === localData.departureCity).map(r => r.destination)));
    // Get available times for selected origin+destination based on dep_time from API
    const times = Array.from(new Set(
      routes
        .filter(r => r.origin === localData.departureCity && r.destination === localData.destinationCity)
        .map(r => r.dep_time)
    )).filter(Boolean).sort();

    // Log filtered options for debugging
    console.log('Origins:', origins);
    console.log('Destinations:', destinations);
    console.log('Times:', times);

    const isValid = localData.departureCity && localData.destinationCity && localData.tripDate && localData.tripTime;

    const handleNext = () => {
        if (!isValid) {
          setError("Please select all trip details (departure, destination, date, and time).");
          return;
        }
        setError(null);
        onFormDataChange('departureCity', localData.departureCity);
        onFormDataChange('destinationCity', localData.destinationCity);
        onFormDataChange('tripDate', localData.tripDate);
        onFormDataChange('tripTime', localData.tripTime);
        onNext();
    };

    const handlePrevious = () => {
        onFormDataChange('departureCity', localData.departureCity);
        onFormDataChange('destinationCity', localData.destinationCity);
        onFormDataChange('tripDate', localData.tripDate);
        onFormDataChange('tripTime', localData.tripTime);
        onPrevious();
    };

    return(
        <section className="space-y-6 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[10rem]">
            <div className="flex gap-2 w-full items-center">
                <button 
                    onClick={handlePrevious}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg width="32" height="33" className="h-5" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5 7.5L11.5 16.5L20.5 25.5" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">Where are we going?</h1>
            </div>

            <div className="space-y-4 w-full">
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="departureCity">Departure city</label>
                    <Select 
                        value={localData.departureCity} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, departureCity: value, destinationCity: '', tripTime: '' }))}
                    >
                        <SelectTrigger className="w-full text-sm">
                            <SelectValue className="text-sm" placeholder="What city are you currently in?" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Serviced cities</SelectLabel>
                                {origins.map(origin => (
                                  <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="destinationCity">Destination City</label>
                    <Select 
                        value={localData.destinationCity} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, destinationCity: value, tripTime: '' }))}
                        disabled={!localData.departureCity}
                    >
                        <SelectTrigger className="w-full text-sm">
                            <SelectValue className="text-sm" placeholder="What city are you heading to?" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Serviced cities</SelectLabel>
                                {destinations.map(dest => (
                                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="tripDate">Trip date</label>
                    <DatePicker 
                        date={localData.tripDate}
                        onDateChange={(date) => setLocalData(prev => ({ ...prev, tripDate: date }))}
                    />
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="tripTime">Trip time</label>
                    <Select 
                        value={localData.tripTime} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, tripTime: value }))}
                        disabled={!localData.departureCity || !localData.destinationCity}
                    >
                        <SelectTrigger className="w-full text-sm">
                            <SelectValue className="text-sm" placeholder="What time would you be heading out?" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Supported times</SelectLabel>
                                {times.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button 
                onClick={handleNext}
                className={`w-full py-3 text-center rounded-full text-white transition-colors ${isValid ? 'bg-black hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!isValid}
            >
                Next
            </button>
        </section>
    )
}