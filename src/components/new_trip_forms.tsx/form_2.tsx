import { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { usersService, type Company, type CompanyVehicle } from "@/services/users";

interface Form2Props {
  onNext: () => void;
  onPrevious: () => void;
  formData: {
    vehicleType: string;
    seatCount: string;
    transportPartner: string;
  };
  onFormDataChange: (field: string, value: any) => void;
}

export default function Form2({ onNext, onPrevious, formData, onFormDataChange }: Form2Props) {
    const [localData, setLocalData] = useState({
        vehicleType: formData.vehicleType,
        seatCount: formData.seatCount,
        transportPartner: formData.transportPartner
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [vehicles, setVehicles] = useState<CompanyVehicle[]>([]);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
      usersService.getAllCompanies().then(setCompanies).catch(() => setCompanies([]));
      usersService.getAllCompanyVehicles().then(vehicles => {
        console.log('Fetched vehicles:', vehicles);
        setVehicles(vehicles);
      }).catch(() => setVehicles([]));
    }, []);

    useEffect(() => {
      if (localData.vehicleType) {
        const selectedVehicle = vehicles.find(v => v.type === localData.vehicleType);
        if (selectedVehicle) {
          setLocalData(prev => ({ ...prev, seatCount: selectedVehicle.capacity.toString() }));
          onFormDataChange('seatCount', selectedVehicle.capacity.toString());
        }
      }
    }, [localData.vehicleType, vehicles]);

    const handleNext = () => {
        onFormDataChange('vehicleType', localData.vehicleType);
        onFormDataChange('seatCount', localData.seatCount);
        onFormDataChange('transportPartner', localData.transportPartner);
        onNext();
    };

    const handlePrevious = () => {
        onFormDataChange('vehicleType', localData.vehicleType);
        onFormDataChange('seatCount', localData.seatCount);
        onFormDataChange('transportPartner', localData.transportPartner);
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
                <h1 className="text-xl font-semibold">What's the ride like?</h1>
            </div>

            <div className="space-y-4 w-[90%] lg:w-full">
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="transportPartner">Transport partner</label>
                    <Select 
                        value={localData.transportPartner} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, transportPartner: value }))}
                    >
                        <SelectTrigger className="w-full text-sm">
                            <SelectValue className="text-sm" placeholder="Select which Odyss partner to travel with" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Odyss transport partners</SelectLabel>
                                {companies.map(company => (
                                  <SelectItem key={company.id} value={company.id}>{company.company_name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="vehicleType">Vehicle type</label>
                    <Select 
                        value={localData.vehicleType} 
                        onValueChange={(value) => setLocalData(prev => ({ ...prev, vehicleType: value }))}
                    >
                        <SelectTrigger className="w-full text-sm">
                            <SelectValue className="text-sm" placeholder="Select a vehicle you'd like to travel with" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Vehicle</SelectLabel>
                                {vehicles.map(vehicle => (
                                  <SelectItem key={vehicle.id} value={vehicle.type}>{vehicle.type} ({vehicle.capacity} seats)</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full relative">
                    <label className="text-xs font-semibold" htmlFor="seatCount">Number of seats you're offering</label>
                    <Input 
                        className="outline-none border-none text-sm focus:border-none bg-gray-100 cursor-not-allowed" 
                        type="number" 
                        placeholder="How many people can join this trip?"
                        value={localData.seatCount}
                        disabled
                        onClick={() => setShowTooltip(true)}
                        readOnly
                    />
                    {showTooltip && (
                      <div className="absolute top-12 left-0 bg-black text-white text-xs rounded px-3 py-2 z-10 shadow-lg" onMouseLeave={() => setShowTooltip(false)}>
                        This is automatically set based on the vehicle type.
                      </div>
                    )}
                </div>
            </div>
            
            <button 
                onClick={handleNext}
                className="w-[90%] lg:w-full cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
            >
                Next
            </button>
        </section>
    )
}