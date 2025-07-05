import { useState, useEffect } from 'react';
import { DatePicker } from "../ui/date_picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { usersService, type CompanyRoute, type Company } from "@/services/users";
import { showToast, toastMessages } from "@/utils/toast";

interface Form3Props {
  onNext: () => void;
  onPrevious: () => void;
  formData: {
    departureCity: string;
    destinationCity: string;
    tripDate: Date | null;
    tripTime: string;
    transportPartner: string;
    selectedRouteId: string;
    selectedRoutePrice: number;
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
    const [allRoutes, setAllRoutes] = useState<CompanyRoute[]>([]);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [filteredRoutes, setFilteredRoutes] = useState<CompanyRoute[]>([]);
    const [hasShownNoRoutesToast, setHasShownNoRoutesToast] = useState(false);

    useEffect(() => {
      // Fetch both routes and companies
      Promise.all([
        usersService.getAllCompanyRoutes(),
        usersService.getAllCompanies()
      ]).then(([routesData, companiesData]) => {
        console.log('Fetched company routes:', routesData);
        console.log('Fetched companies:', companiesData);
        setAllRoutes(routesData);
        setAllCompanies(companiesData);
      }).catch(() => {
        setAllRoutes([]);
        setAllCompanies([]);
      });
    }, []);

    // Filter routes based on selected transport partner
    useEffect(() => {
      console.log('Form3 - transportPartner:', formData.transportPartner);
      console.log('Form3 - allRoutes:', allRoutes);
      console.log('Form3 - allCompanies:', allCompanies);
      
      if (formData.transportPartner && allCompanies.length > 0) {
        // Find the selected company by name
        const selectedCompany = allCompanies.find(company => 
          company.company_name === formData.transportPartner
        );
        
        console.log('Form3 - selectedCompany:', selectedCompany);
        
        if (selectedCompany) {
          // Filter routes by company_id
          const companyRoutes = allRoutes.filter(route => 
            route.company_id === selectedCompany.id
          );
          
          console.log('Form3 - filtered companyRoutes by company_id:', companyRoutes);
          setFilteredRoutes(companyRoutes);
          
          if (companyRoutes.length === 0 && !hasShownNoRoutesToast) {
            showToast.warning(toastMessages.noRoutesAvailable);
            setHasShownNoRoutesToast(true);
          } else if (companyRoutes.length > 0) {
            setHasShownNoRoutesToast(false);
          }
        } else {
          console.log('Form3 - Company not found:', formData.transportPartner);
          setFilteredRoutes([]);
        }
      } else {
        setFilteredRoutes([]);
        // Clear form data when no transport partner is selected
        if (localData.departureCity || localData.destinationCity || localData.tripTime) {
          setLocalData(prev => ({ ...prev, departureCity: '', destinationCity: '', tripTime: '' }));
          onFormDataChange('departureCity', '');
          onFormDataChange('destinationCity', '');
          onFormDataChange('tripTime', '');
        }
      }
    }, [formData.transportPartner, allRoutes, allCompanies]);

    // Handle clearing form data when transport partner changes
    useEffect(() => {
      if (formData.transportPartner && filteredRoutes.length > 0) {
        // Clear form data if current selections are not available for the selected company
        if (localData.departureCity && !filteredRoutes.find(r => r.origin === localData.departureCity)) {
          setLocalData(prev => ({ ...prev, departureCity: '', destinationCity: '', tripTime: '' }));
          onFormDataChange('departureCity', '');
          onFormDataChange('destinationCity', '');
          onFormDataChange('tripTime', '');
          showToast.info(toastMessages.departureCityCleared);
        }
      }
    }, [filteredRoutes, localData.departureCity]);

    // Get unique origins for departure city options
    const origins = Array.from(new Set(filteredRoutes.map(r => r.origin)));
    // Get destinations for selected origin
    const destinations = Array.from(new Set(filteredRoutes.filter(r => r.origin === localData.departureCity).map(r => r.destination)));
    // Get available times for selected origin+destination based on dep_time from API
    const times = Array.from(new Set(
      filteredRoutes
        .filter(r => r.origin === localData.departureCity && r.destination === localData.destinationCity)
        .map(r => r.dep_time)
    )).filter(Boolean).sort();

    // Log filtered options for debugging
    console.log('Form3 - Origins:', origins);
    console.log('Form3 - Destinations:', destinations);
    console.log('Form3 - Times:', times);
    console.log('Form3 - Selected departureCity:', localData.departureCity);
    console.log('Form3 - Selected destinationCity:', localData.destinationCity);

    const isValid = localData.departureCity && localData.destinationCity && localData.tripDate && localData.tripTime;

    const handleNext = () => {
        if (!isValid) {
          showToast.error("Please select all trip details (departure, destination, date, and time).");
          return;
        }
        
        // Find the selected route to get route_id and price
        const selectedRoute = filteredRoutes.find(route => 
          route.origin === localData.departureCity && 
          route.destination === localData.destinationCity &&
          route.dep_time === localData.tripTime
        );
        
        onFormDataChange('departureCity', localData.departureCity);
        onFormDataChange('destinationCity', localData.destinationCity);
        onFormDataChange('tripDate', localData.tripDate);
        onFormDataChange('tripTime', localData.tripTime);
        onFormDataChange('selectedRouteId', selectedRoute?.id || '');
        onFormDataChange('selectedRoutePrice', selectedRoute?.price || 0);
        
        showToast.success(toastMessages.tripRouteDetailsSaved);
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
        <section className="space-y-6 w-[90%] px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[5rem] pb-20">
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

            <div className="space-y-4 w-full min-w-0 max-w-full">
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full max-w-full">
                    <label className="text-xs font-semibold" htmlFor="departureCity">
                        Departure city
                        {!formData.transportPartner && (
                          <span className="text-gray-500 ml-1">(Select transport partner first)</span>
                        )}
                    </label>
                    <Select 
                        value={localData.departureCity} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, departureCity: value, destinationCity: '', tripTime: '' }))}
                        disabled={!formData.transportPartner}
                    >
                        <SelectTrigger 
                            className={`select-fixed-width text-sm ${!formData.transportPartner ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            onClick={() => {
                                if (!formData.transportPartner) {
                                    showToast.warning(toastMessages.selectTransportForDeparture);
                                }
                            }}
                        >
                            <SelectValue className="select-value-fixed text-sm" placeholder={
                                !formData.transportPartner 
                                    ? "Select transport partner first" 
                                    : origins.length === 0 
                                        ? "No routes available for this company" 
                                        : "What city are you currently in?"
                            } />
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
                    <label className="text-xs font-semibold" htmlFor="destinationCity">
                        Destination City
                        {!localData.departureCity && (
                          <span className="text-gray-500 ml-1">(Select departure city first)</span>
                        )}
                    </label>
                    <Select 
                        value={localData.destinationCity} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, destinationCity: value, tripTime: '' }))}
                        disabled={!localData.departureCity}
                    >
                        <SelectTrigger 
                            className={`select-fixed-width text-sm ${!localData.departureCity ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            onClick={() => {
                                if (!localData.departureCity) {
                                    showToast.warning(toastMessages.selectDepartureForDestination);
                                }
                            }}
                        >
                            <SelectValue className="select-value-fixed text-sm" placeholder={
                                !localData.departureCity 
                                    ? "Select departure city first" 
                                    : destinations.length === 0 
                                        ? "No destinations available from this city" 
                                        : "What city are you heading to?"
                            } />
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
                    <label className="text-xs font-semibold" htmlFor="tripTime">
                        Trip time
                        {(!localData.departureCity || !localData.destinationCity) && (
                          <span className="text-gray-500 ml-1">(Select departure and destination first)</span>
                        )}
                    </label>
                    <Select 
                        value={localData.tripTime} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, tripTime: value }))}
                        disabled={!localData.departureCity || !localData.destinationCity}
                    >
                        <SelectTrigger 
                            className={`select-fixed-width text-sm ${(!localData.departureCity || !localData.destinationCity) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            onClick={() => {
                                if (!localData.departureCity || !localData.destinationCity) {
                                    showToast.warning(toastMessages.selectCitiesForTime);
                                }
                            }}
                        >
                            <SelectValue className="select-value-fixed text-sm" placeholder={
                                (!localData.departureCity || !localData.destinationCity)
                                    ? "Select departure and destination first" 
                                    : times.length === 0 
                                        ? "No times available for this route" 
                                    : "What time would you be heading out?"
                            } />
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